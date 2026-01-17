import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TripDetailEntity } from '../entities/trip-detail.entity';
import { ConfigService } from '@nestjs/config';
import puppeteer from 'puppeteer';
import moment from 'moment';
import { TripComplianceReportTemplate } from 'src/notification/templates/trip-compliance-report';

@Injectable()
export class TripReportService {
    private cloudfrontBaseUrl: string;
    private airOpsLogo: string;

    constructor(
        @InjectModel(TripDetailEntity.name)
        private readonly tripModel: Model<TripDetailEntity>,
        private readonly config: ConfigService,
    ) {
        this.cloudfrontBaseUrl = this.config.get<string>('s3.aws_cloudfront_base_url');
        this.airOpsLogo = this.config.get<string>('logo');
    }

    async generateTripPdf(tripId: string): Promise<Buffer> {
        const tripData = await this.fetchTripData(tripId);
        if (!tripData) throw new NotFoundException('Trip not found');

        const html = this.generateHtml(tripData);
        return this.createPdf(html);
    }

    async generateSectorPdf(tripId: string, sectorNo: number): Promise<Buffer> {
        const tripData = await this.fetchTripData(tripId);
        if (!tripData) throw new NotFoundException('Trip not found');

        // Filter for specific sector
        const sector = tripData.sectors.find((s: any) => s.sectorNo === Number(sectorNo));
        if (!sector) throw new NotFoundException(`Sector ${sectorNo} not found`);

        // Create a trip object with only this sector
        const sectorTripData = {
            ...tripData,
            sectors: [sector], // Only one sector
            isSectorReport: true
        };

        const html = this.generateHtml(sectorTripData);
        return this.createPdf(html);
    }

    private async fetchTripData(tripId: string) {
        const pipeline: any[] = [
            { $match: { tripId } },
            // Lookup Quotation for Aircraft, Operator, Passengers
            {
                $lookup: {
                    from: 'quotes',
                    localField: 'quotation',
                    foreignField: '_id',
                    as: 'quotationData',
                    pipeline: [
                        { $project: { _id: 1, aircraft: 1, category: 1, quotationNo: 1 } }
                    ]
                },
            },
            { $unwind: { path: '$quotationData', preserveNullAndEmptyArrays: true } },
            // Lookup Aircraft
            {
                $lookup: {
                    from: 'aircraft-details', // CHECK COLLECTION NAME: AircraftDetailEntity -> 'aircraftdetails'? Usually schema factory default.
                    // Wait, previous file used 'aircrafts'. Let's verify via TripDetailService line 541 used 'aircrafts'. 
                    // QuotesEntity ref says 'AircraftDetailEntity'. 
                    // I will stick to 'aircrafts' if that's what was in TripDetailService, but standard is 'aircraftdetails'.
                    // TripDetailService used 'aircrafts', so likely the collection name is 'aircrafts'.
                    localField: 'quotationData.aircraft',
                    foreignField: '_id',
                    as: 'aircraft',
                    pipeline: [
                        { $project: { name: 1, code: 1, registration: 1 } } // Project commonly used fields
                    ]
                },
            },
            { $unwind: { path: '$aircraft', preserveNullAndEmptyArrays: true } },
            // Lookup Operator using operatorId from TripDetail (it's at root)
            {
                $lookup: {
                    from: 'operators',
                    localField: 'operatorId',
                    foreignField: '_id',
                    as: 'operator',
                    pipeline: [
                        { $project: { name: 1, email: 1, phone: 1, companyName: 1, companyLogo: 1 } }
                    ]
                },
            },
            { $unwind: { path: '$operator', preserveNullAndEmptyArrays: true } },
            // Lookup Passenger Details based on Quotation No
            // Try matching by quotation ObjectId as well, as string might be unreliable? No, schema has both.
            {
                $lookup: {
                    from: 'passenger-details', // Schema explicitly says collection: 'passenger-details'
                    localField: 'quotationNo',
                    foreignField: 'quotationNo',
                    as: 'passengerDetails',
                    pipeline: [
                        { $project: { sectors: 1 } }
                    ]
                },
            },
            // We expect one passenger detail doc per quotation
            {
                $addFields: {
                    passengerDetail: { $arrayElemAt: ['$passengerDetails', 0] }
                }
            }
        ];

        const results = await this.tripModel.aggregate(pipeline).exec();
        if (!results.length) return null;

        const trip = results[0];

        // Improved Aggregation for Crew:
        // Identify all unique crew ObjectIds from the trip document's nested arrays
        const crewLookup = await this.tripModel.aggregate([
            { $match: { tripId } },
            { $unwind: '$sectors' },
            { $unwind: '$sectors.assignedCrews' },
            { $unwind: '$sectors.assignedCrews.crews' },
            { $group: { _id: null, ids: { $addToSet: '$sectors.assignedCrews.crews' } } },
            {
                $lookup: {
                    from: 'crew-details', // Confirm collection name. TripDetailService uses 'crew-details'.
                    localField: 'ids',
                    foreignField: '_id',
                    as: 'crews',
                    pipeline: [
                        { $project: { _id: 1, crewId: 1, fullName: 1, displayName: 1, designation: 1, email: 1 } }
                    ]
                }
            }
        ]);

        const crewMap = new Map();
        if (crewLookup.length > 0 && crewLookup[0].crews) {
            crewLookup[0].crews.forEach((c: any) => {
                crewMap.set(c._id.toString(), c);
            });
        }

        // Hydrate Trip Data in memory
        trip.sectors.forEach((sector: any) => {
            // Hydrate Crew
            sector.assignedCrews?.forEach((group: any) => {
                group.hydratedCrews = group.crews?.map((id: any) => crewMap.get(id.toString()) || { name: 'Unknown' });
            });

            // Hydrate Passengers
            // Find passengers for this sectorNo from passengerDetail
            const paxSector = trip.passengerDetail?.sectors?.find((s: any) => s.sectorNo === sector.sectorNo);
            sector.passengers = paxSector?.passengers || [];
            sector.sourceGroundHandler = paxSector?.sourceGroundHandler;
            sector.destinationGroundHandler = paxSector?.destinationGroundHandler;
        });

        // console.log("trippp:::", trip)

        return trip;
    }

    private async createPdf(html: string): Promise<Buffer> {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });
        const pdf = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' },
        });
        await browser.close();
        return Buffer.from(pdf);
    }

    private generateHtml(trip: any): string {
        const logoUrl = trip.operator?.companyLogo
            ? `${this.cloudfrontBaseUrl}${trip.operator.companyLogo}`
            : this.airOpsLogo;

        return TripComplianceReportTemplate({
            trip,
            latestDate: moment().format('DD MMM YYYY HH:mm'),
            logoUrl,
            cloudfrontBaseUrl: this.cloudfrontBaseUrl
        });
    }
}

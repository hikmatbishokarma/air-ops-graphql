import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TripDetailEntity } from '../entities/trip-detail.entity';
import { PassengerDetailEntity } from 'src/passenger-detail/entities/passenger-detail.entity';
import { BoardingPassEntity } from '../entities/boarding-pass.entity';
import { GenerateBoardingPassInput } from '../dto/boarding-pass.dto';
import { BoardingPassTemplate, BoardingPassPdfWrapper } from 'src/notification/templates/boarding-pass.template';
import { AirportsEntity } from 'src/airports/entities/airports.entity';

@Injectable()
export class BoardingPassService {
    constructor(
        @InjectModel(TripDetailEntity.name)
        private readonly tripDetailModel: Model<TripDetailEntity>,
        @InjectModel(PassengerDetailEntity.name)
        private readonly passengerDetailModel: Model<PassengerDetailEntity>,
        @InjectModel(BoardingPassEntity.name)
        private readonly boardingPassModel: Model<BoardingPassEntity>,
        @InjectModel(AirportsEntity.name)
        private readonly airportModel: Model<AirportsEntity>,
    ) { }

    async generateBoardingPass(input: GenerateBoardingPassInput): Promise<BoardingPassEntity[]> {
        const { tripId, sectorNo } = input;

        // 1. Fetch Trip Details (Flight Master)
        const trip = await this.tripDetailModel
            .findOne({ tripId })
            .populate({
                path: 'quotation',
                populate: { path: 'aircraft' },
            })
            .exec();

        if (!trip) {
            throw new NotFoundException(`Trip with ID ${tripId} not found`);


        }


        const aircraft = {
            code: (trip.quotation as any)?.aircraft?.code || '',
            name: (trip.quotation as any)?.aircraft?.name || '',
        };

        const tripSector = trip.sectors.find((s) => s.sectorNo === sectorNo);
        if (!tripSector) {
            throw new NotFoundException(`Sector ${sectorNo} not found in Trip ${tripId}`);
        }

        // Fetch Ground Handlers for source and destination airports
        const fetchGroundHandler = async (airportCode: string) => {
            if (!airportCode || airportCode.toUpperCase() === 'ZZZZ') {
                return null;
            }

            const airport = await this.airportModel.findOne({
                $or: [
                    { icao_code: airportCode.toUpperCase() },
                    { iata_code: airportCode.toUpperCase() }
                ]
            }).exec();

            if (!airport || !airport.groundHandlersInfo || airport.groundHandlersInfo.length === 0) {
                return null;
            }

            const handler = airport.groundHandlersInfo[0];
            return {
                name: handler.fullName || handler.companyName || 'N/A',
                email: handler.email || 'N/A',
                phone: handler.contactNumber || 'N/A',
                airportCode: airportCode.toUpperCase(),
            };
        };

        const sourceGroundHandler = await fetchGroundHandler(tripSector.source.code);
        const destGroundHandler = await fetchGroundHandler(tripSector.destination.code);

        // 2. Fetch Passenger Manifest
        // PassengerDetail is linked via quotationNo or quotation ID. Trip has quotationNo.
        const passengerDetail = await this.passengerDetailModel.findOne({
            quotationNo: trip.quotationNo,
        }).exec();

        if (!passengerDetail) {
            throw new NotFoundException(`Passenger manifest not found for Quotation ${trip.quotationNo}`);
        }

        const paxSector = passengerDetail.sectors.find((s) => s.sectorNo === sectorNo);
        if (!paxSector || !paxSector.passengers || paxSector.passengers.length === 0) {
            throw new NotFoundException(`No passengers found for Sector ${sectorNo}`);
        }

        const generatedPasses: BoardingPassEntity[] = [];

        // 3. Generate Boarding Pass for each passenger
        for (const pax of paxSector.passengers) {
            // Check if BP already exists (Idempotency)
            const existingBp = await this.boardingPassModel.findOne({
                tripId: tripId,
                sectorNo: sectorNo,
                'passenger.name': pax.name, // Assuming name is unique enough for this scope, or combined with other fields? 
                // Ideally we'd have a PAX ID, but schematic shows just name/age/gender. 
                // We will use name + gender + age combination to be safer, or just name if strict.
                // Let's use name. 
            }).exec();

            if (existingBp) {
                generatedPasses.push(existingBp);
                continue;
            }

            // Mask Govt ID
            let maskedId = 'N/A';
            if (pax.aadharId) { // using aadharId from PassengerEntity as Govt ID
                const len = pax.aadharId.length;
                if (len > 4) {
                    maskedId = 'X'.repeat(len - 4) + pax.aadharId.slice(-4);
                } else {
                    maskedId = pax.aadharId;
                }
            }

            // Create new Boarding Pass
            const newBp = new this.boardingPassModel({
                boardingPassId: `BP-${trip.quotationNo}-${sectorNo}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                tripId: tripId,
                tripObjectId: trip._id,
                quotationNo: trip.quotationNo,
                sectorNo: sectorNo,
                passenger: {
                    name: pax.name,
                    gender: pax.gender,
                    age: pax.age.toString(),
                    govtId: maskedId,
                },
                flight: {
                    fromCode: tripSector.source.code,
                    fromCity: tripSector.source.city || tripSector.source.name,
                    toCode: tripSector.destination.code,
                    toCity: tripSector.destination.city || tripSector.destination.name,
                    departureDate: tripSector.depatureDate,
                    departureTime: tripSector.depatureTime,
                    arrivalDate: tripSector.arrivalDate,
                    arrivalTime: tripSector.arrivalTime,
                    flightTime: tripSector.flightTime,
                    aircraft: aircraft,
                },
                groundHandlers: {
                    source: sourceGroundHandler,
                    destination: destGroundHandler,
                },
                operationType: 'NON-SCHEDULED',
                status: 'Issued',
            });

            const savedBp = await newBp.save();
            generatedPasses.push(savedBp);
        }

        return generatedPasses;
    }

    async getBoardingPasses(tripId: string, sectorNo: number): Promise<BoardingPassEntity[]> {
        return this.boardingPassModel.find({ tripId, sectorNo }).exec();
    }

    async generateBoardingPassHtml(tripId: string, sectorNo: number): Promise<string> {
        let passes = await this.getBoardingPasses(tripId, sectorNo);

        if (!passes || passes.length === 0) {
            // Try to generate if not found
            passes = await this.generateBoardingPass({ tripId, sectorNo: Number(sectorNo) });
        }

        if (!passes || passes.length === 0) {
            throw new NotFoundException(`No boarding passes could be generated for Trip ${tripId} Sector ${sectorNo}`);
        }

        // Read the map image and convert to base64
        const fs = require('fs');
        const path = require('path');
        const imagePath = path.join(process.cwd(), 'src', 'assets', 'world-map-dots.jpg');

        let mapBackgroundUrl = '';
        try {
            const imageBuffer = fs.readFileSync(imagePath);
            mapBackgroundUrl = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;
        } catch (error) {
            console.error('Error reading map background image:', error);
        }

        const passesHtml = passes.map((bp, index) => {
            const bpHtml = BoardingPassTemplate({
                ...bp.toObject(),
                mapBackgroundUrl,
                // formatted dates can be handled in template using moment
            });

            // Add page break locally between passes, but CSS class page-break handles it
            return index < passes.length - 1
                ? `${bpHtml}<div class="page-break"></div>`
                : bpHtml;
        }).join('');

        return BoardingPassPdfWrapper(passesHtml);
    }
}

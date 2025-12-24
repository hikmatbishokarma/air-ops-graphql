import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QuotesEntity } from 'src/quotes/entities/quotes.entity';
import { TripDetailEntity } from '../entities/trip-detail.entity';
import { QuoteStatus, TripDetailStatus } from 'src/app-constants/enums';
import { OpsDashboardDto } from '../dto/ops-dashboard.dto';

@Injectable()
export class OpsDashboardService {
    constructor(
        @InjectModel(QuotesEntity.name)
        private readonly quotesModel: Model<QuotesEntity>,
        @InjectModel(TripDetailEntity.name)
        private readonly tripDetailModel: Model<TripDetailEntity>,
    ) { }

    async getOpsDashboardData(filter: any): Promise<OpsDashboardDto> {
        const operatorId = filter.operatorId;

        // 1. Sale Confirmations: Count quotes where status is SALE_CONFIRMED or TRIP_GENERATED
        // Note: Adjust statuses as used in the app. User mentioned "SALE_CONFIRMED" from quotes collection.
        // OpsControllerPage also includes "TRIP_GENERATED".
        const saleConfirmationQuery: any = {
            status: { $in: [QuoteStatus.SALE_CONFIRMED, QuoteStatus.TRIP_GENERATED] },
        };
        if (operatorId) {
            saleConfirmationQuery.operatorId = operatorId;
        }

        const saleConfirmations = await this.quotesModel.countDocuments(
            saleConfirmationQuery,
        );

        // 2. Trip Details: Count trips (Draft, Published, etc.)
        // OpsControllerPage uses DRAFT, PUBLISHED.
        // const tripDetailsQuery: any = {
        //     status: {
        //         $in: [TripDetailStatus.DRAFT, TripDetailStatus.PUBLISHED],
        //     },
        // };
        const tripDetailsQuery: any = {
        }
        if (operatorId) {
            tripDetailsQuery.operatorId = operatorId;
        }
        const tripDetails = await this.tripDetailModel.countDocuments(
            tripDetailsQuery,
        );

        // 3. Crew Trips Doc: Trips where sectors have tripDocByCrew (non-empty)
        const crewTripsDocQuery: any = {
            sectors: {
                $elemMatch: {
                    tripDocByCrew: { $exists: true, $ne: [] },
                },
            },
        };
        if (operatorId) {
            crewTripsDocQuery.operatorId = operatorId;
        }
        const crewTripsDoc = await this.tripDetailModel.countDocuments(
            crewTripsDocQuery,
        );

        // 4. Reports: Placeholder 0
        const reports = 0;

        return {
            saleConfirmations,
            tripDetails,
            crewTripsDoc,
            reports,
        };
    }
}

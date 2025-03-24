import { Injectable } from '@nestjs/common';
import { getDateRangeFilter } from 'src/common/helper';
import { QuotesService } from 'src/quotes/services/quotes.service';

@Injectable()
export class SalesDashboardService {
  constructor(private readonly quoteService: QuotesService) {}

  async getSalesDashboardData(
    range: string,
    startDate?: string,
    endDate?: string,
  ) {
    const filter = getDateRangeFilter(range, startDate, endDate);

    // Fetch all required data in parallel
    const [
      summary,
      salesTrend,
      statusDistribution,
      revenueTrend,
      latestQuotations,
    ] = await Promise.all([
      this.getSalesSummary(filter),
      this.getSalesTrend(filter),
      this.getQuotationStatus(filter),
      this.getRevenueTrend(filter),
      this.getLatestQuotations(),
    ]);

    return {
      summary,
      salesTrend,
      quotationStatusDistribution: statusDistribution,
      revenueTrend,
      latestQuotations,
    };
  }

  private async getSummary(filter) {
    return this.quoteService.Model.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$status',
          value: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0, // Remove original _id
          label: '$_id', //
          value: 1,
        },
      },
    ]);
  }

  private async getSalesSummary(filter) {
    const salesSummary = await this.quoteService.Model.aggregate([
      {
        $match: filter,
      },
      {
        $group: {
          _id: null, // No grouping by month, we need a single summary
          totalQuotations: { $sum: 1 },
          newQuotations: {
            $sum: { $cond: [{ $eq: ['$status', 'new request'] }, 1, 0] },
          },
          confirmedQuotations: {
            $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] },
          },
          sales: {
            $sum: { $cond: [{ $eq: ['$status', 'booked'] }, 1, 0] },
          },
          cancellations: {
            $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] },
          },
        },
      },
      {
        $project: {
          _id: 0, // Remove _id
          newQuotations: 1,
          totalQuotations: 1,
          confirmedQuotations: 1,
          sales: 1,
          cancellations: 1,
          confirmRatio: {
            $cond: [
              { $eq: ['$totalQuotations', 0] },
              0,
              {
                $multiply: [
                  { $divide: ['$confirmedQuotations', '$totalQuotations'] },
                  100,
                ],
              },
            ],
          },
          confirmToSalesRatio: {
            $cond: [
              { $eq: ['$confirmedQuotations', 0] },
              0,
              {
                $multiply: [
                  { $divide: ['$sales', '$confirmedQuotations'] },
                  100,
                ],
              },
            ],
          },
          confirmToCancelRatio: {
            $cond: [
              { $eq: ['$confirmedQuotations', 0] },
              0,
              {
                $multiply: [
                  { $divide: ['$cancellations', '$confirmedQuotations'] },
                  100,
                ],
              },
            ],
          },
        },
      },
    ]);

    return (
      salesSummary[0] || {
        totalQuotations: 0,
        confirmedQuotations: 0,
        sales: 0,
        cancellations: 0,
        confirmRatio: 0,
        confirmToSalesRatio: 0,
        confirmToCancelRatio: 0,
      }
    );
  }

  private async getSalesTrend(filter) {
    return this.quoteService.Model.aggregate([
      { $match: filter },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          sales: { $sum: { $cond: [{ $eq: ['$status', 'Confirmed'] }, 1, 0] } },
          cancellations: {
            $sum: { $cond: [{ $eq: ['$status', 'Cancelled'] }, 1, 0] },
          },
        },
      },
      {
        $project: {
          _id: 0, // Remove original _id
          date: '$_id', //
          sales: 1,
          cancellations: 1,
        },
      },
    ]);
  }

  private async getQuotationStatus(filter) {
    return this.quoteService.Model.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$status',
          value: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0, // Remove original _id
          label: '$_id', //
          value: 1,
        },
      },
    ]);
  }

  private async getRevenueTrend(filter) {
    return this.quoteService.Model.aggregate([
      { $match: filter },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$totalPrice' },
        },
      },
      {
        $project: {
          _id: 0, // Remove original _id
          date: '$_id', //
          revenue: 1,
        },
      },
    ]);
  }

  private async getLatestQuotations() {
    return this.quoteService.Model.find().sort({ createdAt: -1 }).limit(10);
  }
}

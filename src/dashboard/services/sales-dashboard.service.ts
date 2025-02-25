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
      this.getSummary(filter),
      this.getSalesTrend(filter),
      //   this.getQuotationStatus(filter),
      this.getRevenueTrend(filter),
      this.getLatestQuotations(),
    ]);

    return {
      summary,
      salesTrend,
      //   quotationStatusDistribution: statusDistribution,
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
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0, // Remove original _id
          status: '$_id', //
          count: 1,
        },
      },
    ]);
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
          count: { $sum: 1 },
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

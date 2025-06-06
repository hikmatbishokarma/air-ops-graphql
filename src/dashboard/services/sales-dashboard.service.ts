import { Injectable } from '@nestjs/common';
import { getDateRangeFilter } from 'src/common/helper';
import { QuotesService } from 'src/quotes/services/quotes.service';
import { ObjectId } from 'mongodb';

@Injectable()
export class SalesDashboardService {
  constructor(private readonly quoteService: QuotesService) {}

  async getSalesDashboardData(
    range: string,
    startDate?: string,
    endDate?: string,
    operatorId?: string,
  ) {
    let filter = getDateRangeFilter(range, startDate, endDate);

    filter = {
      ...filter,
      ...(operatorId && { operatorId: { $eq: new ObjectId(operatorId) } }),
    };

    // Fetch all required data in parallel
    const [
      summary,
      // salesTrend,
      // statusDistribution,
      // revenueTrend,
      // latestQuotations,
    ] = await Promise.all([
      this.getSalesSummary(filter),
      // this.getSalesTrend(filter),
      // this.getQuotationStatus(filter),
      // this.getRevenueTrend(filter),
      // this.getLatestQuotations(),
    ]);

    return {
      summary,
      // salesTrend,
      // quotationStatusDistribution: statusDistribution,
      // revenueTrend,
      // latestQuotations,
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

  // private async getSalesSummary(filter) {
  //   const salesSummary = await this.quoteService.Model.aggregate([
  //     {
  //       $match: filter,
  //     },
  //     {
  //       $group: {
  //         _id: null, // No grouping by month, we need a single summary
  //         totalQuotations: { $sum: 1 },
  //         Quote: {
  //           $sum: { $cond: [{ $eq: ['$status', 'Quote'] }, 1, 0] },
  //         },
  //         Cancelled: {
  //           $sum: { $cond: [{ $eq: ['$status', 'Cancelled'] }, 1, 0] },
  //         },
  //         'Tax Invoice': {
  //           $sum: { $cond: [{ $eq: ['$status', 'Tax Invoice'] }, 1, 0] },
  //         },
  //         'Proforma Invoice': {
  //           $sum: { $cond: [{ $eq: ['$status', 'Proforma Invoice'] }, 1, 0] },
  //         },
  //       },
  //     },
  //     {
  //       $project: {
  //         _id: 0, // Remove _id
  //         Quote: 1,
  //         Cancelled: 1,
  //         'Tax Invoice': 1,
  //         'Proforma Invoice': 1,
  //         Invoices: { $add: ['$Tax Invoice', '$Proforma Invoice'] }, // Sum of invoices
  //         // confirmRatio: {
  //         //   $cond: [
  //         //     { $eq: ['$totalQuotations', 0] },
  //         //     0,
  //         //     {
  //         //       $multiply: [
  //         //         { $divide: ['$confirmedQuotations', '$totalQuotations'] },
  //         //         100,
  //         //       ],
  //         //     },
  //         //   ],
  //         // },
  //         // confirmToSalesRatio: {
  //         //   $cond: [
  //         //     { $eq: ['$confirmedQuotations', 0] },
  //         //     0,
  //         //     {
  //         //       $multiply: [
  //         //         { $divide: ['$sales', '$confirmedQuotations'] },
  //         //         100,
  //         //       ],
  //         //     },
  //         //   ],
  //         // },
  //         // confirmToCancelRatio: {
  //         //   $cond: [
  //         //     { $eq: ['$confirmedQuotations', 0] },
  //         //     0,
  //         //     {
  //         //       $multiply: [
  //         //         { $divide: ['$cancellations', '$confirmedQuotations'] },
  //         //         100,
  //         //       ],
  //         //     },
  //         //   ],
  //         // },
  //       },
  //     },
  //   ]);

  //   return (
  //     salesSummary[0] ||{
  //       totalQuotations: 0,
  //       Quote: 0,
  //       Cancelled: 0,
  //       'Tax Invoice': 0,
  //       'Proforma Invoice': 0,
  //       invoices: 0,
  //     }
  //   );
  // }

  private async getSalesSummary(filter) {
    const salesSummary = await this.quoteService.Model.aggregate([
      {
        $match: filter,
      },
      {
        $group: {
          _id: null, // No grouping by month, we need a single summary
          totalQuotations: { $sum: 1 },
          quotes: {
            $sum: { $cond: [{ $eq: ['$status', 'Quote'] }, 1, 0] },
          },
          tripConfirmations: {
            $sum: { $cond: [{ $eq: ['$status', 'Confirmed'] }, 1, 0] },
          },
          taxInvoice: {
            $sum: { $cond: [{ $eq: ['$status', 'Tax Invoice'] }, 1, 0] },
          },
          proformaInvoice: {
            $sum: { $cond: [{ $eq: ['$status', 'Proforma Invoice'] }, 1, 0] },
          },
          invoices: {
            $sum: {
              $cond: [
                {
                  $or: [
                    { $eq: ['$status', 'Tax Invoice'] },
                    { $eq: ['$status', 'Proforma Invoice'] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          revenue: {
            $sum: {
              $cond: [
                {
                  $or: [
                    { $eq: ['$status', 'Tax Invoice'] },
                    { $eq: ['$status', 'Proforma Invoice'] },
                  ],
                },
                '$grandTotal',
                0,
              ],
            },
          },
        },
      },
      {
        $project: {
          _id: 0, // Remove _id
          quotes: 1, // Count of quotes (plural)
          tripConfirmations: 1,
          taxInvoice: 1,
          proformaInvoice: 1,
          invoices: 1,
          revenue: 1, // Total revenue
        },
      },
    ]);

    return (
      salesSummary[0] || {
        totalQuotations: 0,
        quotes: 0,
        tripConfirmations: 0,
        taxInvoice: 0,
        proformaInvoice: 0,
        invoices: 0,
        revenue: 0,
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

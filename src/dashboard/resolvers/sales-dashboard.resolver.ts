import { Args, Query, Resolver } from '@nestjs/graphql';
import { SalesDashboardService } from '../services/sales-dashboard.service';
import { DateRange } from 'src/app-constants/enums';
import { GraphQLJSONObject } from 'graphql-type-json';

@Resolver()
export class SalesDashboardResolver {
  constructor(private readonly salesDashboardService: SalesDashboardService) {}

  @Query(() => GraphQLJSONObject, { name: 'getSalesDashboardData' })
  async getSalesDashboardData(
    @Args('range', { type: () => DateRange, defaultValue: DateRange.today })
    range: string,
    @Args('startDate', { nullable: true }) startDate?: string,
    @Args('endDate', { nullable: true }) endDate?: string,
    @Args('operatorId', { nullable: true }) operatorId?: string,
  ) {
    return await this.salesDashboardService.getSalesDashboardData(
      range,
      startDate,
      endDate,
      operatorId,
    );
  }
}

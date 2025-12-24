import { Args, Query, Resolver } from '@nestjs/graphql';
import { OpsDashboardService } from '../services/ops-dashboard.service';
import { OpsDashboardDto } from '../dto/ops-dashboard.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';

@Resolver()
@UseGuards(GqlAuthGuard)
export class OpsDashboardResolver {
    constructor(private readonly opsDashboardService: OpsDashboardService) { }

    @Query(() => OpsDashboardDto, { name: 'opsDashboardSummary' })
    async getOpsDashboardSummary(
        @Args('operatorId', { nullable: true }) operatorId?: string,
    ) {
        return await this.opsDashboardService.getOpsDashboardData({ operatorId });
    }
}

import { Module } from '@nestjs/common';
import { SalesDashboardService } from './services/sale-dashboard.service';
import { QuotesModule } from 'src/quotes/quotes.module';
import { SalesDashboardResolver } from './resolvers/sales-dashboard.resolver';

@Module({
  imports: [QuotesModule],
  providers: [SalesDashboardService, SalesDashboardResolver],
})
export class DashboardModule {}

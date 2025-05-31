import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { InvoiceService } from '../services/invoice.service';
import { GenerateInvoiceInput } from '../inputs/generate-invoice.input';
import { InvoiceDto } from '../dto/invoice.dto';

@Resolver()
export class InvoiceResolver {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Mutation(() => InvoiceDto)
  async generateInvoice(@Args('args') args: GenerateInvoiceInput) {
    return await this.invoiceService.generateInvoice(args);
  }
}

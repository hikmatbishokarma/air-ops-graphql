import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { InvoiceService } from '../services/invoice.service';
import { GenerateInvoiceInput } from '../inputs/generate-invoice.input';
import { InvoiceDto } from '../dto/invoice.dto';
import { InvoiceType } from 'src/app-constants/enums';

@Resolver()
export class InvoiceResolver {
  constructor(private readonly invoiceService: InvoiceService) { }

  @Mutation(() => InvoiceDto)
  async generateInvoice(@Args('args') args: GenerateInvoiceInput) {
    return await this.invoiceService.generateInvoice(args);
  }

  @Query(() => String)
  async showInvoicePreview(@Args('invoiceType', { type: () => InvoiceType }) invoiceType: InvoiceType, @Args('invoiceNo') invoiceNo: string) {
    return await this.invoiceService.previewInvoice({ invoiceType, invoiceNo });
  }

}

import { Args, Query, Resolver } from "@nestjs/graphql";
import { InvoiceService } from "../services/invoice.service";
import { GenerateInvoiceInput } from "../inputs/generate-invoice.input";

@Resolver()
export class InvoiceResolver{
constructor(private readonly invoiceService:InvoiceService){}

@Query(() => String)
async generateInvoice(@Args('args') args: GenerateInvoiceInput) {
  return await this.invoiceService.generateInvoice(args);
}

}
import { Field, InputType } from "@nestjs/graphql";



@InputType()
export class GenerateInvoiceInput {
  @Field({nullable:true})
  id: string;
  @Field()
  quotationNo: string;
  @Field({defaultValue:false})
  isRevised:boolean
}

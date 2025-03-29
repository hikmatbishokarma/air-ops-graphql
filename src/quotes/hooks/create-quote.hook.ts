import { BeforeCreateOneHook, CreateOneInputType } from '@app/query-graphql';
import { GqlContextType } from '@nestjs/graphql';
import { Injectable } from '@nestjs/common';
import { RoleType } from 'src/app-constants/enums';
import { hashPassword } from 'src/common/helper';
import { RolesService } from 'src/roles/services/roles.service';
import { QuotesDto } from '../dto/quotes.dto';
import { QuotesService } from '../services/quotes.service';
import { ObjectId } from 'mongodb';

@Injectable()
export class CreateQuoteHook<T extends QuotesDto>
  implements BeforeCreateOneHook<T, GqlContextType>
{
  constructor(private readonly quotesService: QuotesService) {}
  async run(
    instance: CreateOneInputType<T>,
    context: GqlContextType,
  ): Promise<CreateOneInputType<T>> {
    const { input } = instance;

    const refNo = await this.quotesService.generateQuotationNumber();

    input.quotationNo = refNo;
    input.code = new ObjectId().toString(); //generate random code to maintain same throught the every version

    return instance;
  }
}

import { BeforeCreateOneHook, CreateOneInputType } from '@app/query-graphql';
import { GqlContextType } from '@nestjs/graphql';
import { Injectable } from '@nestjs/common';
import { RoleType } from 'src/app-constants/enums';
import { hashPassword } from 'src/common/helper';
import { RolesService } from 'src/roles/services/roles.service';
import { QuotesDto } from '../dto/quotes.dto';

@Injectable()
export class CreateQuoteHook<T extends QuotesDto>
  implements BeforeCreateOneHook<T, GqlContextType>
{
  constructor() {}
  async run(
    instance: CreateOneInputType<T>,
    context: GqlContextType,
  ): Promise<CreateOneInputType<T>> {
    const { input } = instance;

    input.referenceNumber = `A-${Math.floor(1000 + Math.random() * 9000)}`;

    return instance;
  }
}

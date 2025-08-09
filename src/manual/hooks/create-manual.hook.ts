// src/manual/hooks/create-user.hook.ts
import { BeforeCreateOneHook, CreateOneInputType } from '@app/query-graphql';
import { GqlContextType } from '@nestjs/graphql';
import { Injectable } from '@nestjs/common';
import { ManualDto } from '../dto/manual.dto';

type GraphQLContextWithRequest = GqlContextType & {
  req: { user: { sub: string } };
};

@Injectable()
export class CreateManualHook<T extends ManualDto>
  implements BeforeCreateOneHook<T, GqlContextType>
{
  async run(
    instance: CreateOneInputType<T>,
    context: GqlContextType,
  ): Promise<CreateOneInputType<T>> {
    const gqlContext = context as GraphQLContextWithRequest;
    const user = gqlContext.req.user;

    instance.input.createdBy = user.sub;

    return instance;
  }
}

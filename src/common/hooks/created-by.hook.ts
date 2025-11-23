import { BeforeCreateOneHook, CreateOneInputType } from '@app/query-graphql';
import { Injectable } from '@nestjs/common';
import { GqlContextType } from '@nestjs/graphql';

// Define a local type that tells TypeScript the context has a 'req' property.
type GraphQLContextWithRequest = GqlContextType & {
  req: { user: { sub: string } };
};

/**
 * A generic hook to automatically set the `createdBy` field on any DTO.
 * This hook can be used with any DTO that has a `createdBy` property.
 */
@Injectable()
export class CreatedByHook<T>
  implements BeforeCreateOneHook<T, GqlContextType> {
  async run(
    instance: CreateOneInputType<T>,
    context: GqlContextType,
  ): Promise<CreateOneInputType<T>> {
    // Use a type assertion to inform TypeScript that the context contains 'req'
    const gqlContext = context as GraphQLContextWithRequest;
    const user = gqlContext.req.user;

    // We can now safely assume that `instance.input` has a `createdBy` property
    // because it will be a DTO that inherits from your BaseDTO.
    if (user && instance.input) {
      // @ts-ignore - Bypass type checking, as the DTO will have this field
      instance.input.createdBy = user.sub;


    }

    return instance;
  }
}

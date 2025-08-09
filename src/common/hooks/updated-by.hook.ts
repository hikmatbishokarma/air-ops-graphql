import { BeforeUpdateOneHook, UpdateOneInputType } from '@app/query-graphql';
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
export class UpdatedByHook<T>
  implements BeforeUpdateOneHook<T, GqlContextType>
{
  async run(
    instance: UpdateOneInputType<T>,
    context: GqlContextType,
  ): Promise<UpdateOneInputType<T>> {
    // Use a type assertion to inform TypeScript that the context contains 'req'
    const gqlContext = context as GraphQLContextWithRequest;
    const user = gqlContext.req.user;

    // Set the updatedBy field if the user is authenticated.
    if (user && instance.update) {
      // @ts-ignore - Bypass type checking, as the DTO will have this field
      instance.update.updatedBy = user.sub;
    }

    return instance;
  }
}

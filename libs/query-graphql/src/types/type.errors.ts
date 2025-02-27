import { Class } from '@app/core';

/** @internal */
export class UnregisteredObjectType<T> extends Error {
  constructor(Cls: Class<T>, description: string) {
    super(
      `${description} Ensure ${Cls.name} is annotated with @nestjs/graphql @ObjectType`,
    );
  }
}

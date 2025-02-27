import { Class } from '@app/core';
import { Inject } from '@nestjs/common';
import { getAuthorizerToken } from '../auth';

export const InjectAuthorizer = <DTO>(
  DTOClass: Class<DTO>,
): ParameterDecorator => Inject(getAuthorizerToken(DTOClass));

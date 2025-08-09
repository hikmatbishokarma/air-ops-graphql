// src/common/interceptors/audit.interceptor.ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const gqlContext = GqlExecutionContext.create(context);
    const request = gqlContext.getContext().req;
    const user = request.user; // Assuming you have an authentication guard that attaches the user object to the request

    // This is the key part: attach the user ID to the Mongoose model instance
    // so the plugin can access it.
    // Mongoose hooks don't have access to the request context, so we use this workaround.
    if (user) {
      const { input } = request.body.variables;

      const model = request.body.input || request.body.variables; // Adjust this depending on your GraphQL payload structure

      if (input) {
        // Dynamically find the key for the input data.
        // It's usually the first (and only) key in the input object.
        const inputKeys = Object.keys(input);
        const payloadKey = inputKeys[0];

        // Check if a payload key was found
        if (payloadKey) {
          // Get the actual data object
          const payload = input[payloadKey];

          // Attach the userId to this object
          payload.createdBy = user.sub; // user.sub contains the user ID
          payload.userId = user.sub; // user.sub contains the user ID
        }
      }
    }

    return next.handle();
  }
}

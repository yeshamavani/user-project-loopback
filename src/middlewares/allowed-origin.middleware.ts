import {inject, injectable, Provider} from '@loopback/core';
import {asMiddleware} from '@loopback/express';
import {Middleware, RestTags} from '@loopback/rest';
import {BinderKeys} from '../keys';
import {ILogger} from '../logger.interface';

@injectable(
  asMiddleware({
    chain: RestTags.REST_MIDDLEWARE_CHAIN,
    group: 'allowedOrigin',
    upstreamGroups: ['logger'],
  }),
)
export class AllowedOriginProvider implements Provider<Middleware> {

  constructor(
    @inject(BinderKeys.LOGGER)
    private logger: ILogger
  ) {
  }
  async value() {


    const checkOrigin: Middleware = async (middlewareCtx, next) => {
      const {request} = middlewareCtx;
      const referer = request.headers.referer;
      const allowedOrigin = process.env.ALLOWED_ORIGIN;

      try {

        this.logger.info('From the middleware!!!!!!!1');
        // if (referer == 'undefined' || referer !== allowedOrigin) {

        //   throw new Error(`Referer not allowed  ${referer}`);
        // }
        // Proceed with next middleware
        const result = await next();
        return result;
      } catch (err) {
        // Catch errors from downstream middleware
        console.error(
          'Error received from allowedOrigin for %s %s',
          request.method,
          request.originalUrl,
        );
        throw err;
      }

    };
    return checkOrigin;
  }

}

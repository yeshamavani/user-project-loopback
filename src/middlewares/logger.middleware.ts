import {injectable, Provider} from '@loopback/core';
import {asMiddleware} from '@loopback/express';
import {Middleware, RestTags} from '@loopback/rest';

@injectable(
  asMiddleware({
    chain: RestTags.REST_MIDDLEWARE_CHAIN,
    group: 'logger',
    downstreamGroups: ['allowedOrigin'],
  }),
)

export class LogginProvider implements Provider<Middleware>{

  async value() {
    const log: Middleware = async (middlewareCtx, next) => {
      const {request} = middlewareCtx;
      const startTime = Date.now();
      console.log(
        `Request ${request.method} ${request.url} start time at ${startTime.toLocaleString()} Request details Referer= ${request.headers.referer} Remote Address= ${request.connection.remoteAddress}`);
      try {
        // Proceed with next middleware
        const result = await next();
        console.log(result);
        // Process response
        // console.log(
        //   'Response received for %s %s',
        //   request.method,
        //   request.originalUrl,
        // );
        return result;
      } catch (err) {
        // Catch errors from downstream middleware
        console.log(`Request ${request.method} ${request.url
          } errored out. Error :: ${JSON.stringify(err)} ${err}`);
        throw err;
      } finally {

        console.log(
          `Request ${request.method} ${request.url
          } Completed in ${Date.now() - startTime}ms`,
        );
      }
    };
    return log;
  }



}


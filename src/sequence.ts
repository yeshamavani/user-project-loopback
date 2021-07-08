import {
  AuthenticateFn,
  AuthenticationBindings,
  AUTHENTICATION_STRATEGY_NOT_FOUND, USER_PROFILE_NOT_FOUND
} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {
  FindRoute, InvokeMethod, InvokeMiddleware,
  ParseParams, Reject, RequestContext, Send,
  SequenceActions, SequenceHandler
} from '@loopback/rest';
import {BinderKeys} from './keys';
import {ILogger} from './logger.interface';

export class MySequence implements SequenceHandler {

  @inject(SequenceActions.INVOKE_MIDDLEWARE, {optional: true})
  protected invokeMiddleware: InvokeMiddleware = () => false;

  constructor(
    @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(SequenceActions.PARSE_PARAMS)
    protected parseParams: ParseParams,
    @inject(SequenceActions.INVOKE_METHOD)
    protected invoke: InvokeMethod,
    @inject(SequenceActions.SEND) public send: Send,
    @inject(SequenceActions.REJECT) public reject: Reject,
    @inject(BinderKeys.LOGGER)
    private logger: ILogger,
    @inject(AuthenticationBindings.AUTH_ACTION)
    protected authenticateRequest: AuthenticateFn,
  ) { }

  async handle(context: RequestContext): Promise<void> {

    const startTime = Date.now();
    const {request, response} = context;

    try {
      this.logger.info(`Request ${request.method} ${request.url} start time at ${startTime.toLocaleString()} Request details Referer= ${request.headers.referer} Remote Address= ${request.connection.remoteAddress}`);
      console.log(`Referer - ${request.headers.referer}`);
      const finished = await this.invokeMiddleware(context);
      if (finished) return;
      const route = this.findRoute(request);
      const args = await this.parseParams(request, route);

      const userProfile = await this.authenticateRequest(request);
      console.log(userProfile);

      const result = await this.invoke(route, args);
      this.send(response, result);

    } catch (err) {

      this.logger.info(`Request ${request.method} ${request.url
        } errored out. Error :: ${JSON.stringify(err)} ${err}`);
      if (
        err.code === AUTHENTICATION_STRATEGY_NOT_FOUND ||
        err.code === USER_PROFILE_NOT_FOUND
      ) {
        Object.assign(err, {statusCode: 401 /* Unauthorized */});
      }
      // ---------- END OF SNIPPET -------------
      this.reject(context, err);
    } finally {

      this.logger.info(
        `Request ${request.method} ${request.url
        } Completed in ${Date.now() - startTime}ms`,
      );
    }

  }
}

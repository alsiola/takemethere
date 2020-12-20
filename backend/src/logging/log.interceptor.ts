import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Scope,
  HttpStatus,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { HTTP_CODE_METADATA, PATH_METADATA } from '@nestjs/common/constants';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { LogService } from './log.service';
import { catchError, tap, map } from 'rxjs/operators';

const NS_PER_SEC = 1e9;
const NS_PER_MS = 1e6;

@Injectable({ scope: Scope.REQUEST })
export class LogInterceptor implements NestInterceptor {
  constructor(
    private readonly logger: LogService,
    private reflector: Reflector
  ) {}

  private getElapsedMs(startTime: [number, number]) {
    const [seconds, nanoseconds] = process.hrtime(startTime);
    return (seconds * NS_PER_SEC + nanoseconds) / NS_PER_MS;
  }

  /**
   * Nest doesn't require/add leading or trailing slashes on paths, but does default to
   * a slash where a path is not provided. I.e.
   *
   * @Controller() -> "/"
   * @Controller("properties") -> "properties"
   *
   * This method normalises the controller and method parts of the path, so that the resulting
   * combined path matches that from the incoming express request
   */
  private formatPath(controllerPath: string, methodPath: string) {
    const emptyStringForSlash = (s: string) => (s === '/' ? '' : s);

    const formattedControllerPath = emptyStringForSlash(controllerPath);
    const formattedMethodPath = emptyStringForSlash(methodPath);

    const separator = formattedControllerPath || formattedMethodPath ? '/' : '';

    return `/${formattedControllerPath}${separator}${formattedMethodPath}`;
  }

  private onRequestStarted(
    context: ExecutionContext,
    startTime: [number, number]
  ) {
    const controller = context.getClass();
    const handler = context.getHandler();

    const controllerPath = this.reflector.get(PATH_METADATA, controller);
    const methodPath = this.reflector.get(PATH_METADATA, handler);

    const {
      url,
      method,
      ip,
      originalUrl,
    } = context.switchToHttp().getRequest<Request>();

    this.logger.addCtx({
      controller: controller.name,
      handler: handler.name,
      path: this.formatPath(controllerPath, methodPath),
      method,
    });

    this.logger.info('Request started', {
      url,
      method,
      ip,
      originalUrl,
    });
  }

  private onRequestError(
    context: ExecutionContext,
    startTime: [number, number],
    err: unknown
  ): never {
    if (err instanceof HttpException) {
      /**
       * Using info not error, as otherwise all 4xx errors would be logged at a
       * high severity. The error itself is not logged, as an HttpException is likely
       * to have been thrown intentionally, rather than being accidentally uncaught
       * within a request handler.
       */
      this.logger.info('Request failed', {
        statusCode: err.getStatus(),
        tookMs: this.getElapsedMs(startTime),
      });
      throw err;
    } else {
      this.logger.error('Request failed', {
        err,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        tookMs: this.getElapsedMs(startTime),
      });
      throw new InternalServerErrorException();
    }
  }

  private onRequestSuccess(
    context: ExecutionContext,
    startTime: [number, number]
  ) {
    const successfulStatusCode = this.reflector.get(
      HTTP_CODE_METADATA,
      context.getHandler()
    );
    this.logger.info('Request succeeded', {
      statusCode: successfulStatusCode || HttpStatus.OK,
      tookMs: this.getElapsedMs(startTime),
    });
  }

  intercept(context: ExecutionContext, next: CallHandler) {
    const startTime = process.hrtime();

    this.onRequestStarted(context, startTime);

    return next.handle().pipe(
      catchError(err => this.onRequestError(context, startTime, err)),
      tap(() => this.onRequestSuccess(context, startTime))
    );
  }
}

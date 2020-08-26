import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { ApplicationLoggerModule } from '../logger/logger.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpErrorFilter } from 'src/shared/filter/http-error.util';
import { LoggerInterceptor } from 'src/logger/logger.interceptor';
import { ReqestMiddleware } from 'src/shared/middlewares';
import { ConfigModule } from '@nestjs/config';
import { dbconfig } from 'src/shared/config/database.config';
import { ContentController } from 'src/content/content.controller';
import { AppService } from './app.service';
import { ContentService } from 'src/content/content.service';
import { ContentModule } from 'src/content/content.module';

@Module({
  imports: [ApplicationLoggerModule, ContentModule, ConfigModule.forRoot({
    isGlobal: true,
    load: [dbconfig]
  })],
  controllers: [AppController, ContentController],
  providers: [AppService, ContentService, {
    provide: APP_FILTER,
    useClass: HttpErrorFilter
  }, {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor
    }],
})
export class AppModule {
  /**
   * Adding middleware configuration
   */
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ReqestMiddleware)
      .forRoutes('*');
  }
}
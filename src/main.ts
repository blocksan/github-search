import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApplicationLoggerService } from './logger/logger.service';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  /**
   * Initializing the AppModule with default express framework
   */
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService)
  /**
   * Api prefix for all routers 
   * Configurability: Reading the router prefix from .env file
   */
  app.setGlobalPrefix(configService.get('ROUTE_PREFIX'))

  /**
   * Custom context based logging service
   * Formats the log in desirable format
   */
  app.useLogger(new ApplicationLoggerService())

  /**
   * Validation pipe configuration for class-validators
   */
  app.useGlobalPipes(new ValidationPipe({disableErrorMessages:false,dismissDefaultMessages:false}));

  /**
   * OpenApi (Swagger) setup configuration
   */
  const options = new DocumentBuilder()
    .setTitle('Github-searcher')
    .setDescription('API documentation for github-searcher')
    .addTag('github-searcher')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);

  /**
   * import swagger path from the configuration
   */
  const swaggerPath = configService.get('ROUTE_PREFIX')+'/'+configService.get('SWAGGER_PATH')
  SwaggerModule.setup(swaggerPath, app, document);
   /**
   * import app port from the configuration
   */
  const port = configService.get('APP_PORT')
  await app.listen(port,() => {
    Logger.log(`Service started at ${port} port`)
  });
  
}
bootstrap();

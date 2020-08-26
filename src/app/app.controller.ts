import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { ApplicationLoggerService } from 'src/logger/logger.service';

@Controller('app')
export class AppController {

  constructor(private readonly appService: AppService, private appLogger: ApplicationLoggerService) {
   this.appLogger.setContext('AppController')
  }
  
}

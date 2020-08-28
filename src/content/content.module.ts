import { Module } from '@nestjs/common';
import {ContentService} from './content.service';
import { ApplicationLoggerModule } from './../logger/logger.module';

@Module({
  imports:[ApplicationLoggerModule],
  providers: [ContentService],
  exports: [ContentService],
})
export class ContentModule {}
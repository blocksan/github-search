import { Test, TestingModule } from '@nestjs/testing';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';
import { ApplicationLoggerService } from './../../src/logger/logger.service';
import { ApplicationLoggerModule } from './../../src/logger/logger.module';
import { SuccessResponseDTO, FailedResponseDTO } from './../../src/shared/dto/response.dto';
import { ContentPaginatedDto } from './content.dto';
import { EContentType } from './../../src/shared/interfaces/EContentType';
// import { LoggerService } from '@nestjs/common';

describe('Content Controller', () => {
  let contentController: ContentController;
  let contentService : ContentService;
  let loggerService: ApplicationLoggerService;
  beforeEach(async () => {
    const content: TestingModule = await Test.createTestingModule({
      imports:[],
      controllers: [ContentController],
      providers: [ContentService,ApplicationLoggerService],
    }).compile();

    loggerService = await content.resolve(ApplicationLoggerService)
    contentService = content.get<ContentService>(ContentService)
    contentController = content.get<ContentController>(ContentController);
  });

  describe('Fetch Content', () => {
    it('It should fetch the content and return true status', async () => {
      const result = {status: true, content: {}};
      const query: ContentPaginatedDto = {page:"1",type:EContentType.user, searchkey:"abc" }
      jest.spyOn(contentService, 'fetchContent').mockImplementation(() => Promise.resolve(result as SuccessResponseDTO));
      expect(await contentController.fetchContent(query)).toEqual(result)
    });

    it('It should return error and return false status', async () => {
      const result = {status: false, error:"Exception in fetching content"};
      const query: ContentPaginatedDto = {page:"1",type:EContentType.user, searchkey:"abc" }
      jest.spyOn(contentService, 'fetchContent').mockImplementation(() => Promise.resolve(result as FailedResponseDTO));
      const response = await contentController.fetchContent(query) 
      expect(await contentController.fetchContent(query)).toEqual(result)
    });

  });
  describe('Clear Content', () => {
    it('It should clear the content and return status true', async () => {
      const result = {status: true};
      jest.spyOn(contentService, 'clearCache').mockImplementation(() => Promise.resolve({status: true}));
      expect(await contentController.clearContent()).toEqual(result)
    });
  })
});

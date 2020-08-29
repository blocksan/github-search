import { Test, TestingModule } from '@nestjs/testing';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';
import { ApplicationLoggerService } from './../../src/logger/logger.service';
import { ContentPaginatedDto } from './content.dto';
import { EContentType } from './../../src/shared/interfaces/EContentType';
import { IGenericSuccessResponse } from './../../src/shared/interfaces/IGenericResponse';

describe('Content Service', () => {
    let contentController: ContentController;
    let contentService: ContentService;
    let loggerService: ApplicationLoggerService;
    beforeEach(async () => {
        const content: TestingModule = await Test.createTestingModule({
            imports: [ApplicationLoggerService],
            controllers: [ContentController],
            providers: [ContentService],
        }).compile();

        loggerService = await content.resolve(ApplicationLoggerService)
        contentService = content.get<ContentService>(ContentService)
        contentController = content.get<ContentController>(ContentController);
    });

    describe('fetchContent Function', () => {

        it('It should fetch the content from REDIS', async () => {
            const result = { status: true, data: {} };
            const responseDto = { status: true, content: {} };
            const query: ContentPaginatedDto = { page: 1, type: EContentType.user, searchkey: "abc" }

            jest.spyOn(contentService, 'cacheContent').mockImplementation(() => Promise.resolve(result as IGenericSuccessResponse));
            expect(await contentService.fetchContent(query)).toEqual(responseDto)
        });

        it('It should throw error if valid type not passed', async () => {
            const responseDto = { status: false, error: "Type must be valid either Users or Repositories" };
            const query = { page: "1", type: "random", searchkey: "abc" }
            expect(await contentService.fetchContent(query as any)).toEqual(responseDto)
        });

        it('It should fetch the content from REDIS', async () => {
            const result = { status: true, data: {} };
            const responseDto = { status: true, content: {} };
            const query: ContentPaginatedDto = { page: 1, type: EContentType.user, searchkey: "abc" }

            jest.spyOn(contentService, 'cacheContent').mockImplementation(() => Promise.resolve(result as IGenericSuccessResponse));
            expect(await contentService.fetchContent(query)).toEqual(responseDto)

        });

    });
});

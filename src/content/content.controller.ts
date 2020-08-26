import { Controller, Post, Query, Delete, Body } from "@nestjs/common";
import { ContentService } from "./content.service";
import {
    ApiOperation,
    ApiResponse,
    ApiTags
} from '@nestjs/swagger';
import { ApplicationLoggerService } from "./../logger/logger.service";
import { ContentPaginatedDto } from "./content.dto";
import { SuccessResponseDTO, FailedResponseDTO, FailedExceptionDTO } from "./../shared/dto/response.dto";
import { IGenericSuccessResponse } from "src/shared/interfaces/IGenericResponse";

/**
 * Content controller responsible for handling routes related to content
 */
@ApiTags('content')
@Controller('content')
export class ContentController {

    constructor(private appLogger: ApplicationLoggerService, private contentService: ContentService) {
        /**
        * Setting up the logging context 
        * 
        * useful while debugging
        */
        this.appLogger.setContext('ContentController')
    }
    /**
     * 
     * Endpoint to fetch the users and repositories from the github API.
     * 
     * Throws HTTPException at 400 status code with type FailedExceptionDTO
     * 
     * @param body : ContentPaginatedDto {type, page, searchkey}
     * @returns SuccessResponseDTO | SuccessResponseDTO
     */
    @Post('/fetch')
    @ApiOperation({ summary: 'Fetch users or repositories from github. Return cached response if already present in REDIS' })
    @ApiResponse({ status: 403, description: 'Forbidden.', type:[FailedResponseDTO] })
    @ApiResponse({ status: 404, description: 'API not found.', type:[FailedResponseDTO] })
    @ApiResponse({ status: 422, description: 'Unprocessable entity.', type:[FailedResponseDTO] })
    @ApiResponse({ status: 400, description: 'Unprocessable entity.', type:[FailedExceptionDTO] })
    @ApiResponse({ status: 200, description: 'Successful fetched content.', type: [SuccessResponseDTO]  })
    async fetchContent(@Body() body: ContentPaginatedDto ): Promise<SuccessResponseDTO|FailedResponseDTO> {
        return this.contentService.fetchContent({...body})
    }


    /**
     * 
     * Endpoint to clear the cache from the REDIS if present any
     * 
     * @returns IGenericSuccessResponse  {status: true}
     */
    @Delete('/clearCache')
    @ApiOperation({ summary: 'Clears all the content from the REDIS. Not available from the consumer' })
    @ApiResponse({ status: 200, description: 'Content cleared successfully.'  })
    async clearContent(): Promise<IGenericSuccessResponse> {
        return this.contentService.clearCache()
    }
}
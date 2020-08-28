import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { ApplicationLoggerService } from './../logger/logger.service';
import { getTotalPages } from './../shared/utils/totalPages.util';
import { ContentPaginatedDto } from './content.dto';
import { EContentType } from './../shared/interfaces/EContentType';
import { apiUtil } from './../shared/utils/apitype.util';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { SuccessResponseDTO, FailedResponseDTO, IContent } from './../../src/shared/dto/response.dto';
import { IGenericSuccessResponse, IGenericFailureResponse, IGenericResponse } from 'src/shared/interfaces/IGenericResponse';
import { ConfigService } from '@nestjs/config';
import { formatItemResponse } from './../shared/utils/formatItemResponse';
/**
 * Content service responsible for performing
 */
@Injectable()
export class ContentService {

  private client: ClientProxy

  constructor(private appLogger: ApplicationLoggerService, private configService: ConfigService) {
    /**
    * Setting up the logging context 
    * useful while debugging
    */
    this.client = ClientProxyFactory.create({
      transport: Transport.REDIS, options: {
        url: process.env.REDIS_SERVER,
      }
    })
    this.appLogger.setContext('ContentService')
  }
  /**
   * 
   * Function responsible for fetching the content from Github and set it in REDIS
   * 
   * if cache found then it returns result from cache 
   * 
   * else new API request is made
   * 
   * @param params : ContentPaginatedDto
   * @returns data: SuccessResponseDTO | FailedResponseDTO
   */
  async fetchContent(params: ContentPaginatedDto): Promise<SuccessResponseDTO | FailedResponseDTO> {
    try {
      const {type} = params

      /**
       * Contruct the final api based on the type, user selected
       */
      let finalApi = this.constructFinalAPI(params)

      /**
       * Utility to check for data to exist in redis or not
       */
      const cacheResult = await this.cacheContent(finalApi)
      
      /**
       * Return the cache data which returned from REDIS
       */
      if (cacheResult.status) {
        return { status: true, content: {...cacheResult.data } as IContent};
      }

      /**
       * If no cache found, then
       * Make the API request to fetch the content
       */

      const result = await axios.request({
        method: 'GET',
        baseURL: finalApi
      })

      /**
       * Check for result status, if it is not 200 then API failed with exception
       */
      if (result.status !== HttpStatus.OK || !result.data.items) {
        throw new Error("Request failed")
      }

      /**
       * Destructure data from result
       */
      const { data } = result;

      /**
       * If type is Users, then more details about the user needs to be fetched to show on UI
       * Hence pass the items as call by reference and append the extra info from the user profile
       * Note: Appending extra info done at backend to cache the request for subsequent calls 
       */
      if (type === EContentType.user) {
        await this.fetchUserDetails(data.items)
      }

      let totalPages = 1
      /**
       * Github API respond with link tag if more than 1 page exists for the result.
       * Hence to make API paginated, total number of pages should be parsed from the link tag
       */
      if (result.headers.link) {
        /**
         * Utility function to parse the link tag and return the total number of pages
         */
        const totalPageResult = getTotalPages(result.headers.link)

        if (!totalPageResult.status) {
          this.appLogger.error('Exception in finding the total pages ', totalPageResult.error)
        }

        /**
         * Totalpages can be used by consumer to implement infinite scroll or paginated scroll
         */
        totalPages = totalPageResult.pages
      }

      /**
       * Prepare the content object which will be consumed by the endpoint
       * 
       */
      result.data.items = formatItemResponse(result.data.items, type)
      const content = { ...result.data, totalPages }

      /**
       * save the prepared content to redis using emitter pattern: fire and forget strategy
       * Same content will be parsed from the cache 
       */
      this.client.emit<number>('cacheContent', { key: finalApi, data: JSON.stringify(content) })

      return { status: true, content };
    } catch (err) {
      /**
       * Log the error via custom logger built which will beautify the log error message
       */
      this.appLogger.error(`Error in Contentservice ${err}`)

      /**
       * Throw HTTP Exception which will be handled by custom HTTPErrorFilter middleware
       * 
       * Formatted exception will be sent to the consumer of the end point.
       * 
       * @example
       * {
       *   "status": false,
       *   "error": "string",
       *   "code": {},
       *   "timestamp": "string",
       *   "path": "string",
       *   "method": "string",
       *   "requestId": "string",
       *   "message": "string"
       * }
       * 
       */
      throw new HttpException(`Error in Contentservice ${err}`, HttpStatus.BAD_REQUEST)
    }
  }


  /**
   * Helper method to find the already saved content if present
   */
  async cacheContent(key: string): Promise<IGenericSuccessResponse | IGenericFailureResponse> {
    return new Promise((resolve) => {
      this.client.send<string>('fetchContent', { key }).subscribe((data) => {
        if (data) {
          resolve({ status: true, data: JSON.parse(data) })
        }
        resolve({ status: false })
      }, (error) => {
        resolve({ status: false, error })
      });
    })
  }

  /**
   * Update the details for each user returned from the search API
   * 
   * Base search API doesn't return location, name and other information. 
   * 
   * It will update item details as "call by reference"
   * @params items: Array[]
   */
  async fetchUserDetails(items: Array<any>) {
    /**
     * Set authorized token if present
     */
    const token = this.configService.get("GIT_AUTH_TOKEN")
    let headers = {
      'User-Agent': 'github-searcher'
    }
    if (token) {
      headers['Authorization'] = `token ${token}`
    }
    await Promise.all(
      items.map(async (item) => {
        try {
          const profile = await axios.request({
            method: 'GET',
            baseURL: item.url,
            headers: {
              ...headers
            }
          })
          item.detailInfo = profile.data
        } catch (err) {
          throw new Error(err.message)
        }
      })
    )
  }


  /**
   * Function to return final API based on the type
   * @param params: ContentPaginatedDto  {type, searchkey, page}
   * @returns string final API which can be used by axios 
   */
  constructFinalAPI(params: ContentPaginatedDto): string{
      const {type, searchkey, page} = params;
      if (type === EContentType.user) {
        /**
         * Users
         */
        let finalApi = apiUtil[type]
        return finalApi += `?q=${searchkey}+type:user&page=${page}`
      } else if (type === EContentType.respository) {
        /**
        * Repositories
        */
        let finalApi = apiUtil[type]
        return finalApi += `?q=${searchkey}&page=${page}`
      } else {
        /**
         * If neither Users nor Repositories, 
         * then search should not work as per the scope, hence throw exception
         */
        throw new Error("Type must be valid either Users or Repositories")
      }
  }

  /**
   * 
   * API to clear the cache from REDIS
   * 
   * @returns IGenericSuccessResponse
   */
  async clearCache(): Promise<IGenericSuccessResponse> {
    this.client.emit<string>('clearCache', {})
    return { status: true, data: null }
  }

}

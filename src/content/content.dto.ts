import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { EContentType } from './../shared/interfaces/EContentType';
import { ApiProperty } from '@nestjs/swagger';

export class ContentPaginatedDto {

    @ApiProperty({type: Number, description:"Page number for which content will be fetched. Default :1 "})
    @IsNumber()
    page: number;

    @ApiProperty({enum: EContentType, description:"Entity type against which search will be implemented"})
    @IsNotEmpty()
    type: EContentType;

    @ApiProperty({type: String, description:"Search key which will be used to search the content"})
    @IsNotEmpty()
    @IsString()
    searchkey: string

}
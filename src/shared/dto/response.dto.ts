import { ApiProperty } from "@nestjs/swagger";
import { HttpStatus } from "@nestjs/common";
import { IContentItems } from "../interfaces/IGenericResponse";


export type IContent = {
    total_count: number,
    incomplete_results: boolean,
    items: IContentItems
    totalPages:number
}

export class SuccessResponseDTO {

    @ApiProperty({ type: Boolean, description: "Successful response status" })
    status: true;

    @ApiProperty({ type: Object, description: "Successful response content" })
    content: IContent

}

export class FailedResponseDTO {
    @ApiProperty({ type: Boolean, description: "Failed response status", default: false })
    status: false;

    @ApiProperty({ type: String, description: "Failed response error message" })
    error: string;

}

export class FailedExceptionDTO extends FailedResponseDTO {
    @ApiProperty({ description: "HTTP status code" })
    code: string | number;

    @ApiProperty({ description: "API timestamp" })
    timestamp: string

    @ApiProperty({ description: "API endpoint" })
    path: string

    @ApiProperty({ description: "API RESTful method type" })
    method: string

    @ApiProperty({ description: "Unique request ID" })
    requestId: string

    @ApiProperty({ description: "Exception message" })
    message: string
}
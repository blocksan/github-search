import { IUserTypeContent } from "./IUserType"
import { IRespositoryTypeContent } from "./IRespositoryTypeContent"

export type IGenericSuccessResponse = {
    status: true,
    data: object | null
}

export type IGenericFailureResponse = {
    status: false,
    error?: string
}

export type IGenericResponse = IGenericSuccessResponse | IGenericFailureResponse

export type IContentItems = Array<IUserTypeContent|IRespositoryTypeContent>
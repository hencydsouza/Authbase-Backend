import { HTTPSTATUS, HttpStatusCode } from "../../config/http.config";
import { ErrorCode } from "../enums/error-code.enum";
import { AppError } from "./AppError";


export class NotFoundException extends AppError {
    constructor(message: string = "Resource not found", errorCode?: ErrorCode) {
        super(
            message,
            HTTPSTATUS.NOT_FOUND,
            errorCode || ErrorCode.RESOURCE_NOT_FOUND
        );
    }
}

export class BadRequestException extends AppError {
    constructor(message: string, errorCode?: ErrorCode) {
        super(
            message,
            HTTPSTATUS.BAD_REQUEST,
            errorCode || ErrorCode.AUTH_USER_NOT_FOUND
        );
    }
}

export class UnauthorizedException extends AppError {
    constructor(message: string, errorCode?: ErrorCode) {
        super(
            message,
            HTTPSTATUS.UNAUTHORIZED,
            errorCode || ErrorCode.AUTH_UNAUTHORIZED_ACCESS
        );
    }
}

export class HttpException extends AppError {
    constructor(
        message: string,
        statusCode: HttpStatusCode,
        errorCode?: ErrorCode
    ) {
        super(
            message,
            statusCode,
            errorCode || ErrorCode.INTERNAL_SERVER_ERROR
        );
    }
}
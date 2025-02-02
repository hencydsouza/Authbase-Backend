import { ErrorRequestHandler, Response } from "express";
import { HTTPSTATUS } from "../config/http.config";
import { AppError } from "../common/utils/AppError";
import { z } from "zod"
import { clearAuthenticationCookies, REFRESH_PATH } from "../common/utils/cookie";

const formatZodError = (res: Response, err: z.ZodError) => {
    const errors = err?.issues?.map((error) => ({
        field: error.path.join("."),
        message: error.message
    }))

    return res.status(HTTPSTATUS.BAD_REQUEST).json({
        message: "Validation failed",
        errors: errors
    })
}

export const errorHandler: ErrorRequestHandler = (err, req, res, next): any => {
    console.error(`Error occured on PATH: ${req.path}`, err);

    if(req.path === REFRESH_PATH){
        clearAuthenticationCookies(res)
    }

    if (err instanceof SyntaxError) {
        return res.status(HTTPSTATUS.BAD_REQUEST).json({
            message: "Invalid JSON payload passed."
        })
    }

    if (err instanceof z.ZodError) {
        return formatZodError(res, err)
    }

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            message: err.message,
            errorCode: err.errorCode
        })
    }

    return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
        error: err?.message || "Unknown error occured"
    })
}
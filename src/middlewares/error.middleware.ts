import { Request, Response, NextFunction } from 'express';
export class AppError extends Error{
    public status: number;
    constructor(message: string, statusCode: number) {
        super(message);
        this.status = statusCode;
    }
}

export const ErrorMiddleware = (error: AppError, req: Request, res: Response, next: NextFunction) => {

    const status: number = error.status || 500;
    const message: string = error.message || 'Что-то пошло не так';
    res.status(status).json({ status:status,message:message });

};
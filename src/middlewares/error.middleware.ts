import { Request, Response, NextFunction } from 'express';
export class AppError extends Error {
    public status: number;
    source:'service' | 'repository'
    //public isOperational: boolean;

    constructor(message: string, statusCode: number,source:'service' | 'repository') {
        super(message);
        this.status = statusCode;
        //this.isOperational = isOperational;
        this.source = source;
        // Убедитесь, что имя ошибки корректно установлено
        //this.name = this.constructor.name;

        // Сохраняйте стек вызовов
       // Error.captureStackTrace(this, this.constructor);
    }
}
export const ErrorMiddleware = (error: AppError, req: Request, res: Response, next: NextFunction) => {
    console.log("ErrorMiddleware "+JSON.stringify(error))
    //try {
        const status: number = error.status || 500;
        const message: string = error.message || 'Something went wrong';



        res.status(status).json({ status:status,message:message });
    /*} catch (error) {
        console.log("ErrorMiddleware e")
        next(error);
    }*/
};
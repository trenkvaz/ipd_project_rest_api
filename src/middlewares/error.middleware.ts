import { Request, Response, NextFunction } from 'express';
export class AppError extends Error{
    public status: number;


    //public isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.status = statusCode;

        //this.isOperational = isOperational;

        // Убедитесь, что имя ошибки корректно установлено
        //this.name = this.constructor.name;

        // Сохраняйте стек вызовов
       // Error.captureStackTrace(this, this.constructor);
    }
}

export const ErrorMiddleware = (error: AppError, req: Request, res: Response, next: NextFunction) => {
    //console.log("ErrorMiddleware "+JSON.stringify(error))
    //try {
        const status: number = error.status || 500;
        const message: string = error.message || 'Что-то пошло не так';
        res.status(status).json({ status:status,message:message });
    /*} catch (error) {
        console.log("ErrorMiddleware e")
        next(error);
    }*/
};
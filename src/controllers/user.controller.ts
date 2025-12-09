import {NextFunction, Request, Response} from "express";
import {IUser} from '../types/user';
import {UserService} from "../services/user.service";
import {AppError} from "../middlewares/error.middleware";
import {IsDate, IsEnum, IsInt, IsObject, IsOptional, IsPositive, IsString, validate} from 'class-validator';
import { plainToInstance} from 'class-transformer';
import {Types} from "mongoose";

export class UserController {

    private userService:UserService;

    constructor() {
        this.userService = new UserService();
    }

    postUser = async(req: Request, res: Response)=>{
        //const body:any = req.body;
        const userDto = <UserDto>plainToInstance(UserDto, req.body);
        //console.log("userDto",JSON.stringify(userDto))
        const errors = await validate(userDto);
        const dtoKeys = Object.keys(new UserDto());
        const userKeys = Object.keys(userDto);
        const extraFields = userKeys.filter(key => !dtoKeys.includes(key));
        extraFields.forEach(key => {delete userDto[key as keyof UserDto];});
        ['_id', 'createdAt'].forEach(key => {delete userDto[key as keyof UserDto];});
        //console.log("clear userDto",JSON.stringify(userDto))
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }
        try {
            //console.log("postOrder req",req);
            // let result = await service();
            //console.log("exports.form-result",form-result)
            return res.status(200).json({ status: 200, data:(await this.userService.createUser(userDto)), message: "пользователь добавлен" });
        } catch (error:any) {
            //return res.status(500).json({ status: 500, message: e.message });
            /*if(error instanceof AppError) console.log("postOrder AppError "+error.message)
            else console.log("postOrder no AppError")
            next(new AppError('Ошибка контроллера: ',400))*/
            if(error instanceof AppError)throw error
            else throw new AppError('UserController Ошибка добавления пользователя: '+error.message,500);
        }
    }

    putUser = async(req: Request, res: Response)=>{
        //const body:any = req.body;
        const userDto = <UserDto>plainToInstance(UserDto, req.body);
        //console.log("userDto",JSON.stringify(userDto))
        const errors = await validate(userDto);
        const dtoKeys = Object.keys(new UserDto());
        const orderKeys = Object.keys(userDto);
        const extraFields = orderKeys.filter(key => !dtoKeys.includes(key));
        extraFields.forEach(key => {delete userDto[key as keyof UserDto];});
        ['_id', 'createdAt'].forEach(key => {delete userDto[key as keyof UserDto];});
        //console.log("clear userDto",JSON.stringify(userDto))
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }
        try {
            //console.log("postOrder req",req);
            // let result = await service();
            //console.log("exports.form-result",form-result)

            const id = (req.params.id as string) || "";
            return res.status(200).json({ status: 200, data:(await this.userService.updateUser(userDto,id)), message: "пользователь обновлен" });
        } catch (error:any) {
            //return res.status(500).json({ status: 500, message: e.message });
            /*if(error instanceof AppError) console.log("postOrder AppError "+error.message)
            else console.log("postOrder no AppError")
            next(new AppError('Ошибка контроллера: ',400))*/
            if(error instanceof AppError)throw error
            else throw new AppError('OrderController Ошибка изменения заказа: '+error.message,500);
        }
    }

    getUser = async(req: Request, res: Response)=>{

        try {
            //console.log("postOrder req",req);
            // let result = await service();
            //console.log("exports.form-result",form-result)
            const id = (req.params.id as string) || "";

            return res.status(200).json({ status: 200, data:(await this.userService.getUserById(id)), message: "пользователь получен" });
        } catch (error:any) {
            //return res.status(500).json({ status: 500, message: e.message });
            /*if(error instanceof AppError) console.log("postOrder AppError "+error.message)
            else console.log("postOrder no AppError")
            next(new AppError('Ошибка контроллера: ',400))*/
            if(error instanceof AppError)throw error
            else throw new AppError('OrderController Ошибка получения пользователя: '+error.message,500);
        }
    }

    getOrders = async(req: Request, res: Response)=>{

        try {
            //console.log("postOrder req",req);
            // let result = await service();
            //console.log("exports.form-result",form-result)

            /* let userId = "";
             if(req.query.userId!==undefined)userId = req.query.userId as string;*/
            const userId = (req.query.userId as string) || "";
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const offset = (page - 1) * limit;

            return res.status(200).json({ status: 200, data:(await this.userService.getOrders(page,offset,limit,userId)), message: "заказы получены" });
        } catch (error:any) {
            //return res.status(500).json({ status: 500, message: e.message });
            /*if(error instanceof AppError) console.log("postOrder AppError "+error.message)
            else console.log("postOrder no AppError")
            next(new AppError('Ошибка контроллера: ',400))*/
            if(error instanceof AppError)throw error
            else throw new AppError('OrderController Ошибка получения заказов: '+error.message,500);
        }
    }


    deleteOrder = async(req: Request, res: Response)=>{

        try {
            //console.log("postOrder req",req);
            // let result = await service();
            //console.log("exports.form-result",form-result)
            let id = Number(req.params.id);

            return res.status(200).json({ status: 200, data:(await this.userService.deleteOrderById(id)), message: "заказ удален" });
        } catch (error:any) {
            //return res.status(500).json({ status: 500, message: e.message });
            /*if(error instanceof AppError) console.log("postOrder AppError "+error.message)
            else console.log("postOrder no AppError")
            next(new AppError('Ошибка контроллера: ',400))*/
            if(error instanceof AppError)throw error
            else throw new AppError('OrderController Ошибка удаления заказа: '+error.message,500);
        }
    }
}


class UserDto implements IUser{
   /* @IsOptional()
    @IsString()
    _id?: string;*/

    @IsString()
    name!: string;

    @IsString()
    email!: string;

    @IsOptional()
    @IsObject()
    profile?: Object;

    @IsOptional()
    @IsDate()
    createdAt?: Date;
}

/*
_id?: Types.ObjectId;
name: string;
email: string;
profile?: Object;
createdAt?: Date;*/

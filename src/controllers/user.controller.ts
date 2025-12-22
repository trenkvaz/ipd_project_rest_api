import { Request, Response} from "express";
import {IUser} from '../types/user';
import {UserService} from "../services/user.service";
import {AppError} from "../middlewares/error.middleware";
import {IsDate, IsObject, IsOptional, IsString, validate} from 'class-validator';
import { plainToInstance} from 'class-transformer';


export class UserController {

    private userService:UserService;

    constructor() {
        this.userService = new UserService();
    }

    postUser = async(req: Request, res: Response)=>{
        const userDto = <UserDto>plainToInstance(UserDto, req.body);
        const errors = await validate(userDto);
        const dtoKeys = Object.keys(new UserDto());
        const userKeys = Object.keys(userDto);
        const extraFields = userKeys.filter(key => !dtoKeys.includes(key));
        extraFields.forEach(key => {delete userDto[key as keyof UserDto];});
        ['_id', 'createdAt'].forEach(key => {delete userDto[key as keyof UserDto];});
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }
        try {
            return res.status(200).json({ status: 200, data:(await this.userService.createUser(userDto)), message: "пользователь добавлен" });
        } catch (error:any) {
            if(error instanceof AppError)throw error
            else throw new AppError('UserController Ошибка добавления пользователя: '+error.message,500);
        }
    }

    putUser = async(req: Request, res: Response)=>{
        const userDto = <UserDto>plainToInstance(UserDto, req.body);
        const errors = await validate(userDto);
        const dtoKeys = Object.keys(new UserDto());
        const orderKeys = Object.keys(userDto);
        const extraFields = orderKeys.filter(key => !dtoKeys.includes(key));
        extraFields.forEach(key => {delete userDto[key as keyof UserDto];});
        ['_id', 'createdAt'].forEach(key => {delete userDto[key as keyof UserDto];});
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }
        try {
            const id = (req.params.id as string) || "";
            return res.status(200).json({ status: 200, data:(await this.userService.updateUser(userDto,id)), message: "пользователь обновлен" });
        } catch (error:any) {
            if(error instanceof AppError)throw error
            else throw new AppError('OrderController Ошибка изменения заказа: '+error.message,500);
        }
    }

    getUser = async(req: Request, res: Response)=>{
        try {
            const id = (req.params.id as string) || "";
            return res.status(200).json({ status: 200, data:(await this.userService.getUserById(id)), message: "пользователь получен" });
        } catch (error:any) {
            if(error instanceof AppError)throw error
            else throw new AppError('OrderController Ошибка получения пользователя: '+error.message,500);
        }
    }

    getUsers = async(req: Request, res: Response)=>{
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const offset = (page - 1) * limit;
            return res.status(200).json({ status: 200, data:(await this.userService.getUsers(page,offset,limit)), message: "пользователи получены" });
        } catch (error:any) {
            if(error instanceof AppError)throw error
            else throw new AppError('OrderController Ошибка получения пользователей: '+error.message,500);
        }
    }


    deleteUser = async(req: Request, res: Response)=>{
        try {

            const id = (req.params.id as string) || "";
            return res.status(200).json({ status: 200, data:(await this.userService.deleteUserById(id)), message: "пользователь удален" });
        } catch (error:any) {
            if(error instanceof AppError)throw error
            else throw new AppError('OrderController Ошибка удаления пользователя: '+error.message,500);
        }
    }
}


class UserDto implements IUser{

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



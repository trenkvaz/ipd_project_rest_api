import {IUser} from '../types/user';
import UserRepository from "../repositories/mongo/user.repository";
import {AppError} from "../middlewares/error.middleware";
import {NextFunction} from "express";

export class UserService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async createUser (user:IUser){
        try {
            return (await this.userRepository.creatUser(user));
        } catch (error:any) {
            if(error instanceof AppError)throw error
            else throw new AppError('UserService Ошибка добавления пользователя: '+error.message,500);
        }
    }

    async updateUser (user:IUser,_id:string){
        try {
            return (await this.userRepository.updateUser(user,_id));
        } catch (error:any) {
            if(error instanceof AppError)throw error
            else throw new AppError('UserService Ошибка обновления пользователя: '+error.message,500);
        }
    }

    async getUserById (id:string){
        try {
            return (await this.userRepository.getUserById(id));
        } catch (error:any) {
            if(error instanceof AppError)throw error
            else throw new AppError('UserService Ошибка получения пользователя по ид: '+error.message,500);
        }
    }


    async getUsers(page: number,offset:number,limit: number){
        try {
            return (await this.userRepository.getUsers(page, offset, limit));
        } catch (error:any) {
            if(error instanceof AppError)throw error
            else throw new AppError('UserService Ошибка получения пользователей: '+error.message,500);
        }
    }


    async deleteUserById (id:string ){
        try {
            return (await this.userRepository.deleteUserById(id));
        } catch (error:any) {
            if(error instanceof AppError)throw error
            else throw new AppError('UserService Ошибка удаления пользователя по ид: '+error.message,500);
        }
    }
}
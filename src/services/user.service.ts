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
            const res = await this.userRepository.creatUser(user);
            //resOrder.dataValues.id = undefined;
            //if(resOrder === undefined)throw new AppError('Order creation failed: id or createdAt is undefined',404);
            /*if (resOrder === undefined || resOrder.dataValues.id === undefined || resOrder.dataValues.createdAt === undefined) {
                //next(new AppError('Order creation failed: id or createdAt is undefined',404));
                throw new AppError('Order creation failed: id or createdAt is undefined',404);
            }
            const order1: IOrder = {
                id: resOrder.dataValues.id,
                userId: resOrder.dataValues.userId,
                amount: resOrder.dataValues.amount,
                status: resOrder.dataValues.status,
                createdAt: resOrder.dataValues.createdAt
            };*/
            //return resOrder;
            return res;
        } catch (error:any) {
            //console.log("ERROR")
            if(error instanceof AppError)throw error
            else throw new AppError('UserService Ошибка добавления пользователя: '+error.message,500);

            //next(new AppError('Ошибка создания заказа: ',404));
        }

    }

    async updateUser (user:IUser,_id:string){
        try {
            const res = await this.userRepository.updateUser(user,_id);
            //resOrder.dataValues.id = undefined;
            //if(resOrder === undefined)throw new AppError('Order creation failed: id or createdAt is undefined',404);
            /*if (resOrder === undefined || resOrder.dataValues.id === undefined || resOrder.dataValues.createdAt === undefined) {
                //next(new AppError('Order creation failed: id or createdAt is undefined',404));
                throw new AppError('Order creation failed: id or createdAt is undefined',404);
            }
            const order1: IOrder = {
                id: resOrder.dataValues.id,
                userId: resOrder.dataValues.userId,
                amount: resOrder.dataValues.amount,
                status: resOrder.dataValues.status,
                createdAt: resOrder.dataValues.createdAt
            };*/
            //return resOrder;
            return res;
        } catch (error:any) {
            //console.log("ERROR")
            if(error instanceof AppError)throw error
            else throw new AppError('UserService Ошибка обновления пользователя: '+error.message,500);

            //next(new AppError('Ошибка создания заказа: ',404));
        }

    }

    async getUserById (id:string){
        try {
            const res = await this.userRepository.getUserById(id);
            //console.log("getUserById res "+JSON.stringify(res))
            return res;
        } catch (error:any) {
            //console.log("ERROR")
            if(error instanceof AppError)throw error
            else throw new AppError('UserService Ошибка получения пользователя по ид: '+error.message,500);

            //next(new AppError('Ошибка создания заказа: ',404));
        }

    }


    async getUsers(page: number,offset:number,limit: number){
        try {
            return (await this.userRepository.getUsers(page, offset, limit));
        } catch (error:any) {
            //console.log("ERROR")
            if(error instanceof AppError)throw error
            else throw new AppError('UserService Ошибка получения пользователей: '+error.message,500);

            //next(new AppError('Ошибка создания заказа: ',404));
        }
    }


    async deleteUserById (id:string ){
        try {
            return (await this.userRepository.deleteUserById(id));
        } catch (error:any) {
            //console.log("ERROR")
            if(error instanceof AppError)throw error
            else throw new AppError('UserService Ошибка удаления пользователя по ид: '+error.message,500);

            //next(new AppError('Ошибка создания заказа: ',404));
        }

    }
}
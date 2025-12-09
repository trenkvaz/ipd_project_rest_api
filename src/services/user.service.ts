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

            return res;
        } catch (error:any) {
            //console.log("ERROR")
            if(error instanceof AppError)throw error
            else throw new AppError('UserService Ошибка получения пользователя по ид: '+error.message,500);

            //next(new AppError('Ошибка создания заказа: ',404));
        }

    }


    async getOrders(page: number,offset:number,limit: number,userId:string){
        try {
            //const resOrders = await this.userRepository.getOrders(page, offset, limit,userId);
            //console.log("resOrders "+JSON.stringify(resOrders))
            //return resOrders;
        } catch (error:any) {
            //console.log("ERROR")
            if(error instanceof AppError)throw error
            else throw new AppError('UserService Ошибка получения заказов: '+error.message,500);

            //next(new AppError('Ошибка создания заказа: ',404));
        }
    }


    async deleteOrderById (id:number){
        try {
            //const resOrder = await this.userRepository.deleteOrderById(id);
            //return resOrder;
        } catch (error:any) {
            //console.log("ERROR")
            if(error instanceof AppError)throw error
            else throw new AppError('UserService Ошибка удаления заказа по ид: '+error.message,500);

            //next(new AppError('Ошибка создания заказа: ',404));
        }

    }
}
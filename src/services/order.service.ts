import {IOrder} from '../types/order';
import OrderRepository from "../repositories/pg/order.repository";
import {AppError} from "../middlewares/error.middleware";
import {NextFunction} from "express";

export class OrderService {
    private orderRepository: OrderRepository;

    constructor() {
        this.orderRepository = new OrderRepository();
    }

    async createOrder (order:IOrder){
        try {
            const resOrder = await this.orderRepository.creatOrder(order);
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
            return resOrder;
        } catch (error:any) {
            //console.log("ERROR")
            if(error instanceof AppError)throw error
            else throw new AppError('OrderService Ошибка создания заказа: '+error.message,500);

            //next(new AppError('Ошибка создания заказа: ',404));
        }

    }

    async updateOrder (order:IOrder,id:number){
        try {
            const resOrder = await this.orderRepository.updateOrder(order,id);
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
            return resOrder;
        } catch (error:any) {
            //console.log("ERROR")
            if(error instanceof AppError)throw error
            else throw new AppError('OrderService Ошибка изменения заказа: '+error.message,500);

            //next(new AppError('Ошибка создания заказа: ',404));
        }

    }
}
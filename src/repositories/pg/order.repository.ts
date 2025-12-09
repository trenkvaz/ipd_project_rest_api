import {IOrder} from '../../types/order';
import {OrderModel} from '../../models/pg/order.model';
import {IUser} from "../../types/user";
import UserModel from "../../models/mongo/user.model";
import {Types} from "mongoose";
import {AppError} from "../../middlewares/error.middleware";
import {NextFunction} from "express";
//import {CreationAttributes} from "sequelize";


/*export async function creatOrder(order:IOrder){
    try {
        const result = await OrderModel.create(order);
        //res.status(201).json(result);
        return result;
    } catch (error) {
        //res.status(500).json({ error: 'Ошибка при создании заказа' });
        return error;
    }
}*/


export default class OrderRepository {

    public async creatOrder(order:IOrder){
        try {
            //return undefined;
            let res = await OrderModel.create(order);
            console.log("creatOrder",JSON.stringify(res));
            return res;
        } catch (error:any) {
            //console.log("ERROR")
            throw new AppError('Ошибка базы данных: ' + error.message,500);
            //next(new AppError('Ошибка базы данных: ' + error.message,502));
        }

    }

    public async updateOrder(order:IOrder,id:number){
        //console.log("updateOrder ",JSON.stringify(order))
        try {
            const [rowsUpdate, [updatedOrder]]  = await OrderModel.update(order,{ where: {id:id},returning: true});
            return updatedOrder;
        } catch (error:any) {
            //console.log("ERROR")
            throw new AppError('Ошибка базы данных: ' + error.message,500);
        }
    }

    public async getOrderById(id: number){
        try {
            const res  = await OrderModel.findOne({where: {id:id}});
            //console.log("getOrderById "+JSON.stringify(res))
            return res;
        } catch (error:any) {
            //console.log("ERROR")
            throw new AppError('Ошибка базы данных: ' + error.message,500);
        }

    }

    public async deleteOrderById(id: number){
        try {
            return (await OrderModel.destroy({where: {id:id}}));
        } catch (error:any) {
            //console.log("ERROR")
            throw new AppError('Ошибка базы данных: ' + error.message,500);
        }

    }

    public async getOrders(page: number,offset: number, limit: number,userId: string) {
        //page,offset,limit,userId
        //console.log("getOrders offset",offset,"")
        try {
            const { count, rows } = await OrderModel.findAndCountAll({where: {userId:userId}, limit: limit, offset: offset});
            return {total: count, orders: rows, page:page, totalPages: Math.ceil(count / limit)};
        } catch (error:any) {
            //console.log("ERROR")
            throw new AppError('Ошибка базы данных: ' + error.message,500);
        }

    }

}
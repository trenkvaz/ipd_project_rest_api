import {IOrder} from '../../types/order';
import {OrderModel} from '../../models/pg/order.model';
import {IUser} from "../../types/user";
import UserModel from "../../models/mongo/user.model";
import {Types} from "mongoose";
//import {CreationAttributes} from "sequelize";


export async function creatOrder(order:IOrder){
    try {
        const result = await OrderModel.create(order);
        //res.status(201).json(result);
        return result;
    } catch (error) {
        //res.status(500).json({ error: 'Ошибка при создании заказа' });
        return error;
    }
}


export default class OrderRepository {

    public async creatOrder(order:IOrder){
        return (await OrderModel.create(order));
    }

    public async updateOrder(order:IOrder){
        return (await OrderModel.update(order,{ where: {id:order.id},returning: true}));
    }

    public async getOrderById(id: number){
        return (await OrderModel.findAll({where: {id:id}}));
    }

    public async deleteOrderById(id: number){
        return (await OrderModel.destroy({where: {id:id}}));
    }

    public async getOrders(page: number, limit: number,userId: string) {
        const offset = (page - 1) * limit;
        const { count, rows } = await OrderModel.findAndCountAll({where: {userId:userId}, limit: limit, offset: offset});
        return {total: count, orders: rows, page, totalPages: Math.ceil(count / limit),
        };
    }

}
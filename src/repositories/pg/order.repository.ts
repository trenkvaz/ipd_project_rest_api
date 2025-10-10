import {IOrder} from '../../types/order';
import {OrderModel} from '../../models/pg/order.model';
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
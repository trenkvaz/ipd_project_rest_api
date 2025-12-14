import {IOrder} from '../../types/order';
import {OrderModel} from '../../models/pg/order.model';
import {AppError} from "../../middlewares/error.middleware";


export default class OrderRepository {

    public async creatOrder(order:IOrder){
        try {
            return (await OrderModel.create(order));
        } catch (error:any) {
            throw new AppError('Ошибка базы данных: ' + error.message,500);
        }

    }

    public async updateOrder(order:IOrder,id:number){
        try {
            const [rowsUpdate, [updatedOrder]]  = await OrderModel.update(order,{ where: {id:id},returning: true});
            if(!updatedOrder) throw new AppError('заказ не найден',404);
            return updatedOrder;
        } catch (error:any) {
            if(error instanceof AppError)throw error
            throw new AppError('Ошибка базы данных: ' + error.message,500);
        }
    }

    public async getOrderById(id: number){
        try {
            const res  = await OrderModel.findOne({where: {id:id}});
            if(!res) throw new AppError('заказ не найден',404);
            return res;
        } catch (error:any) {
            if(error instanceof AppError)throw error
            throw new AppError('Ошибка базы данных: ' + error.message,500);
        }

    }

    public async deleteOrderById(id: number){
        try {
            return (await OrderModel.destroy({where: {id:id}}));
        } catch (error:any) {
            throw new AppError('Ошибка базы данных: ' + error.message,500);
        }
    }

    public async getOrders(page: number,offset: number, limit: number,userId: string) {
        try {
            const { count, rows } = await OrderModel.findAndCountAll({where: {userId:userId}, limit: limit, offset: offset});
            return {total: count, orders: rows, page:page, totalPages: Math.ceil(count / limit)};
        } catch (error:any) {
            throw new AppError('Ошибка базы данных: ' + error.message,500);
        }
    }
}
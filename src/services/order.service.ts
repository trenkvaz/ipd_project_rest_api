import {IOrder} from '../types/order';
import OrderRepository from "../repositories/pg/order.repository";
import {AppError} from "../middlewares/error.middleware";


export class OrderService {
    private orderRepository: OrderRepository;

    constructor() {
        this.orderRepository = new OrderRepository();
    }

    async createOrder (order:IOrder){
        try {
            return (await this.orderRepository.creatOrder(order));
        } catch (error:any) {
            if(error instanceof AppError)throw error
            else throw new AppError('OrderService Ошибка создания заказа: '+error.message,500);
        }
    }

    async updateOrder (order:IOrder,id:number){
        try {
            return (await this.orderRepository.updateOrder(order,id));
        } catch (error:any) {
            if(error instanceof AppError)throw error
            else throw new AppError('OrderService Ошибка изменения заказа: '+error.message,500);
        }
    }

    async getOrderById (id:number){
        try {
            return (await this.orderRepository.getOrderById(id));
        } catch (error:any) {
            if(error instanceof AppError)throw error
            else throw new AppError('OrderService Ошибка получения заказа по ид: '+error.message,500);
        }
    }


    async getOrders(page: number,offset:number,limit: number,userId:string){
        try {
            return (await this.orderRepository.getOrders(page, offset, limit,userId));
        } catch (error:any) {
            if(error instanceof AppError)throw error
            else throw new AppError('OrderService Ошибка получения заказов: '+error.message,500);
        }
    }


    async deleteOrderById (id:number){
        try {
            return (await this.orderRepository.deleteOrderById(id));
        } catch (error:any) {
            if(error instanceof AppError)throw error
            else throw new AppError('OrderService Ошибка удаления заказа по ид: '+error.message,500);
        }
    }
}
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
            const resOrder = await this.orderRepository.creatOrder(order);
            //resOrder.dataValues.id = undefined;
            if (resOrder.dataValues.id === undefined || resOrder.dataValues.createdAt === undefined) {
                throw new AppError('Order creation failed: id or createdAt is undefined',404,'service');
            }
            const order1: IOrder = {
                id: resOrder.dataValues.id,
                userId: resOrder.dataValues.userId,
                amount: resOrder.dataValues.amount,
                status: resOrder.dataValues.status,
                createdAt: resOrder.dataValues.createdAt
            };
            return order1;
        } catch (error:unknown) {
            //console.log("ERROR")
            if(error instanceof AppError)throw error
            else throw new AppError('Ошибка создания заказа: ',404,'service');
        }

    }

}
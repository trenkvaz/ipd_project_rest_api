import {NextFunction, Request, Response} from "express";
import {IOrder} from '../types/order';
import {OrderService} from "../services/order.service";
import {AppError} from "../middlewares/error.middleware";
import {IsDate, IsEnum, IsInt, IsOptional, IsPositive, IsString, validate} from 'class-validator';
import { plainToInstance} from 'class-transformer';

export class OrderController {

    private orderService:OrderService;

    constructor() {
        this.orderService = new OrderService();
    }

     postOrder = async(req: Request, res: Response)=>{
         //const body:any = req.body;
         const orderDto = <OrderDto>plainToInstance(OrderDto, req.body);
         //console.log("orderDto",JSON.stringify(orderDto))
         const errors = await validate(orderDto);
         const dtoKeys = Object.keys(new OrderDto());
         const orderKeys = Object.keys(orderDto);
         const extraFields = orderKeys.filter(key => !dtoKeys.includes(key));
         extraFields.forEach(key => {delete orderDto[key as keyof OrderDto];});
         ['id', 'createdAt'].forEach(key => {delete orderDto[key as keyof OrderDto];});
         //console.log("clear orderDto",JSON.stringify(orderDto))
         if (errors.length > 0) {
             return res.status(400).json({ errors });
         }
         try {
             //console.log("postOrder req",req);
            // let result = await service();
             //console.log("exports.form-result",form-result)
             return res.status(200).json({ status: 200, data:(await this.orderService.createOrder(orderDto)), message: "заказ создан" });
         } catch (error:any) {
             //return res.status(500).json({ status: 500, message: e.message });
             /*if(error instanceof AppError) console.log("postOrder AppError "+error.message)
             else console.log("postOrder no AppError")
             next(new AppError('Ошибка контроллера: ',400))*/
             if(error instanceof AppError)throw error
             else throw new AppError('OrderController Ошибка создания заказа: '+error.message,500);
         }
     }

    putOrder = async(req: Request, res: Response)=>{
        //const body:any = req.body;
        const orderDto = <OrderDto>plainToInstance(OrderDto, req.body);
        //console.log("orderDto",JSON.stringify(orderDto))
        const errors = await validate(orderDto);
        const dtoKeys = Object.keys(new OrderDto());
        const orderKeys = Object.keys(orderDto);
        const extraFields = orderKeys.filter(key => !dtoKeys.includes(key));
        extraFields.forEach(key => {delete orderDto[key as keyof OrderDto];});
        ['id', 'createdAt'].forEach(key => {delete orderDto[key as keyof OrderDto];});
        //console.log("clear orderDto",JSON.stringify(orderDto))
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }
        try {
            //console.log("postOrder req",req);
            // let result = await service();
            //console.log("exports.form-result",form-result)
            let id = Number(req.params.id);

            return res.status(200).json({ status: 200, data:(await this.orderService.updateOrder(orderDto,id)), message: "заказ изменен" });
        } catch (error:any) {
            //return res.status(500).json({ status: 500, message: e.message });
            /*if(error instanceof AppError) console.log("postOrder AppError "+error.message)
            else console.log("postOrder no AppError")
            next(new AppError('Ошибка контроллера: ',400))*/
            if(error instanceof AppError)throw error
            else throw new AppError('OrderController Ошибка изменения заказа: '+error.message,500);
        }
    }

    getOrder = async(req: Request, res: Response)=>{

        try {
            //console.log("postOrder req",req);
            // let result = await service();
            //console.log("exports.form-result",form-result)
            let id = Number(req.params.id);

            return res.status(200).json({ status: 200, data:(await this.orderService.getOrderById(id)), message: "заказ получен" });
        } catch (error:any) {
            //return res.status(500).json({ status: 500, message: e.message });
            /*if(error instanceof AppError) console.log("postOrder AppError "+error.message)
            else console.log("postOrder no AppError")
            next(new AppError('Ошибка контроллера: ',400))*/
            if(error instanceof AppError)throw error
            else throw new AppError('OrderController Ошибка получения заказа: '+error.message,500);
        }
    }

    getOrders = async(req: Request, res: Response)=>{

        try {
            //console.log("postOrder req",req);
            // let result = await service();
            //console.log("exports.form-result",form-result)

           /* let userId = "";
            if(req.query.userId!==undefined)userId = req.query.userId as string;*/
            const userId = (req.query.userId as string) || "";
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const offset = (page - 1) * limit;

            return res.status(200).json({ status: 200, data:(await this.orderService.getOrders(page,offset,limit,userId)), message: "заказы получены" });
        } catch (error:any) {
            //return res.status(500).json({ status: 500, message: e.message });
            /*if(error instanceof AppError) console.log("postOrder AppError "+error.message)
            else console.log("postOrder no AppError")
            next(new AppError('Ошибка контроллера: ',400))*/
            if(error instanceof AppError)throw error
            else throw new AppError('OrderController Ошибка получения заказов: '+error.message,500);
        }
    }


    deleteOrder = async(req: Request, res: Response)=>{

        try {
            //console.log("postOrder req",req);
            // let result = await service();
            //console.log("exports.form-result",form-result)
            let id = Number(req.params.id);

            return res.status(200).json({ status: 200, data:(await this.orderService.deleteOrderById(id)), message: "заказ удален" });
        } catch (error:any) {
            //return res.status(500).json({ status: 500, message: e.message });
            /*if(error instanceof AppError) console.log("postOrder AppError "+error.message)
            else console.log("postOrder no AppError")
            next(new AppError('Ошибка контроллера: ',400))*/
            if(error instanceof AppError)throw error
            else throw new AppError('OrderController Ошибка удаления заказа: '+error.message,500);
        }
    }
}


class OrderDto implements IOrder{
    @IsOptional()
    @IsInt()
    id?: number;

    @IsString()
    userId!: string;

    @IsInt()
    @IsPositive()
    amount!: number;

    @IsEnum({ pending: 'pending', paid: 'paid', canceled: 'canceled' })
    status!: 'pending' | 'paid' | 'canceled';

    @IsOptional()
    @IsDate()
    createdAt?: Date;
}
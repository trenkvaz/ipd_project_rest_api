import {NextFunction, Request, Response} from "express";
import {IOrder} from '../types/order';
import {OrderService} from "../services/order.service";

export class OrderController {

    private orderService:OrderService;

    constructor() {
        this.orderService = new OrderService();
    }

     async answerController(res: Response, service: () => any, message: string){
         try {
             let result = await service();
             //console.log("exports.form-result",form-result)
             return res.status(200).json({ status: 200, data: result, message: message });
         } catch (e:any) {
             return res.status(500).json({ status: 500, message: e.message });
         }
     }

     postOrder = async(req: Request, res: Response, next:NextFunction)=>{

        const body:any = req.body
        //console.log(req)
        //console.log(body)
        /* userId: string;
         amount: number;
         status: 'pending' | 'paid' | 'canceled';*/
        const order:IOrder = {
            userId: body.userId,
            amount: body.amount,
            status: body.status
        }

         try {
            // let result = await service();
             //console.log("exports.form-result",form-result)
             return res.status(200).json({ status: 200, data:(await this.orderService.createOrder(order)), message: "заказ создан" });
         } catch (e) {
             //return res.status(500).json({ status: 500, message: e.message });
             console.log("postOrder e")
             next(e)
         }


        //return await this.answerController(res,():any=>{return this.orderService.createOrder(order)},"заказ создан")
     }

}
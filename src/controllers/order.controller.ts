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

     async answerController(res: Response, service: () => any, message: string){
         try {
             let result = await service();
             //console.log("exports.form-result",form-result)
             return res.status(200).json({ status: 200, data: result, message: message });
         } catch (e:any) {
             return res.status(500).json({ status: 500, message: e.message });
         }
     }

     postOrder = async(req: Request, res: Response)=>{
         console.log("req.user",req.user)
         //const body:any = req.body;
         const orderDto = <OrderDto>plainToInstance(OrderDto, req.body);
         console.log("orderDto",JSON.stringify(orderDto))
         const errors = await validate(orderDto);
         const dtoKeys = Object.keys(new OrderDto());
         const orderKeys = Object.keys(orderDto);
         const extraFields = orderKeys.filter(key => !dtoKeys.includes(key));
         extraFields.forEach(key => {delete orderDto[key as keyof OrderDto];});
         ['id', 'createdAt'].forEach(key => {delete orderDto[key as keyof OrderDto];});


         console.log("clear orderDto",JSON.stringify(orderDto))

         /*if (extraFields.length > 0) {
             const extraFieldError:ValidationError = {
                 toString(shouldDecorate?: boolean, hasParent?: boolean, parentPath?: string, showConstraintMessages?: boolean): string {
                     return "";
                 },
                 target: orderDto,
                 value: orderDto,
                 property: 'extraFields',
                 constraints: {
                     isExtraField: `Extra fields: ${extraFields.join(', ')}`
                 }
                 // Вы можете добавить другие поля, если это необходимо
             };
             errors.push(extraFieldError);
         }*/

         if (errors.length > 0) {
             return res.status(400).json({ errors });
         }
         try {

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


        //return await this.answerController(res,():any=>{return this.orderService.createOrder(order)},"заказ создан")
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
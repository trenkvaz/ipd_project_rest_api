//import {IsString, IsInt, IsPositive, IsEnum, IsOptional, IsDate} from 'class-validator';


export interface IOrder {
    id?: number;
    userId: string;
    amount: number;
    status: 'pending' | 'paid' | 'canceled';
    createdAt?: Date;
}

/*export class OrderDto implements IOrder{
    @IsOptional()
    @IsInt()
    id?: number;

    @IsString()
    userId: string;

    @IsInt()
    @IsPositive()
    amount: number;

    @IsEnum({ pending: 'pending', paid: 'paid', canceled: 'canceled' })
    status: 'pending' | 'paid' | 'canceled';

    @IsOptional()
    @IsDate()
    createdAt?: Date;
}*/

/*
export interface IOrderService {
    createOrder(order: IOrder);
    // другие методы...
}*/

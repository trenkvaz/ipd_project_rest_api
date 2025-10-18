
export interface IOrder {
    id?: number;
    userId: string;
    amount: number;
    status: 'pending' | 'paid' | 'canceled';
    createdAt?: Date;
}

/*
export interface IOrderService {
    createOrder(order: IOrder);
    // другие методы...
}*/

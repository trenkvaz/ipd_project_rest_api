

export interface IOrder {
    id?: number;
    userId: string;
    amount: number;
    status: 'pending' | 'paid' | 'canceled';
    createdAt?: Date;
}


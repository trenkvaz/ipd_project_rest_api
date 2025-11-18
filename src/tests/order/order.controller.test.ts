import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import {OrderController} from "../../controllers/order.controller";
import {OrderService} from "../../services/order.service";
import { describe, it, expect, beforeEach } from '@jest/globals';
import {IOrder} from '../../types/order';

let orderService = new OrderService();

/*const app = express();
app.use(bodyParser.json());
let orderController = new OrderController();
app.post('/orders', orderController.postOrder);*/
//app.get('/users', listUsers);
import App from "../../app";

const app1 = new App();

app1.listen();

let app = app1.getApp();
describe('Order Controller', () => {
    beforeEach(() => {
        // Сброс массива пользователей перед каждым тестом
        jest.clearAllMocks();
    });

    it('should create a order and return it', async () => {
        const order1 = {"id":1, "userId": "userId1", "amount": 1, "status": "pending",}

        const response = await request(app).post('/orders').send(order1);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(order1);
    });

    /*it('should return all users', async () => {
        const order1:IOrder = {"id":1, "userId": "userId1", "amount": 1, "status": "pending",}
        const order2:IOrder = {"id":2, "userId": "userId2", "amount": 1, "status": "paid",}

        // Добавляем пользователей через сервис
        orderService.createOrder(order1);
        orderService.createOrder(order2);

       /!* const response = await request(app).get('/users');

        expect(response.status).toBe(200);
        expect(response.body).toEqual([order1, order2]);*!/
    });*/
});

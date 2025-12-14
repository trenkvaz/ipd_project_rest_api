import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import {OrderController} from "../../controllers/order.controller";
import {OrderService} from "../../services/order.service";
import { describe, it, expect, beforeEach,beforeAll,afterAll } from '@jest/globals';
import {IOrder} from '../../types/order';
import * as dotenv from 'dotenv';
dotenv.config();

/*const app = express();
app.use(bodyParser.json());
let orderController = new OrderController();
app.post('/orders', orderController.postOrder);*/
//app.get('/users', listUsers);
import App from "../../app";

let isDocker = false;

/*const app1 = new App();

app1.listen();*/
let application:App;
let app: express.Application | string;
let token: string;

beforeAll(async () => {
    // Сброс массива пользователей перед каждым тестом
    if(!isDocker){
        application = await App.create();
        app = application.getApp();
    } else {
        let port:string = process.env.PORT!.toString();
        app = 'http://localhost:'+port;
        console.log("app "+app)
    }
    jest.clearAllMocks();
});

afterAll(async () => {
    console.log("afterAll")
    if(!isDocker) await application.closeServer();
});

const user_data = {
    username: "user3",
    password: "password11"
};

describe('Order Controller', () => {
  /*  let app:express.Application;
    beforeAll(async () => {
        // Сброс массива пользователей перед каждым тестом
        app = (await App.create()).getApp();
        jest.clearAllMocks();
    });

    const user_data = {
        "username": "user3",
        "password": "password11"
    }*/

    it('регистрация', async () => {
        const response = await request(app).post('/register').send(user_data);
        //console.log("response",JSON.stringify(response.text))
        expect(response.status).toBe(201);
        expect(response.body).toEqual({"message": "Пользователь успешно зарегистрирован"});
    });

    //let token:string;

    it('получение токена', async () => {

        const response = await request(app).post('/login').send(user_data);
        console.log("response",JSON.stringify(response.text))

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({token: expect.any(String)});
        token = response.body.token;
    });


    let orderIdPut = 0;
    let createdAtPut = '';
    it('создание ордера', async () => {
        const order1 = { "userId": "userId1", "amount": 1, "status": "pending","test":"test"}

        const response = await request(app).post('/orders').send(order1).set('Authorization', "Bearer "+token);
        console.log("response",JSON.stringify(response.text))
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            status: 200,
            data: {
                id: expect.any(Number), // Проверяем, что id — это число
                userId: 'userId1',
                amount: 1,
                status: 'pending',
                createdAt: expect.any(String)
            },
            message: 'заказ создан'
        });
        const createdAt = new Date(response.body.data.createdAt);
        expect(createdAt).toBeInstanceOf(Date);
        expect(createdAt.getTime()).toBeGreaterThan(0);
        //expect(response.body).toEqual(order1);
        orderIdPut = response.body.data.id;
        createdAtPut = response.body.data.createdAt;
    });
    let orderId2 = 0;
    let createdAtPut2 = ''
    it('создание ордера 2', async () => {
        const order1 = { "userId": "userId1", "amount": 1, "status": "pending","test":"test"}

        const response = await request(app).post('/orders').send(order1).set('Authorization', "Bearer "+token);
        console.log("response",JSON.stringify(response.text))
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            status: 200,
            data: {
                id: expect.any(Number), // Проверяем, что id — это число
                userId: 'userId1',
                amount: 1,
                status: 'pending',
                createdAt: expect.any(String)
            },
            message: 'заказ создан'
        });
        const createdAt = new Date(response.body.data.createdAt);
        expect(createdAt).toBeInstanceOf(Date);
        expect(createdAt.getTime()).toBeGreaterThan(0);
        //expect(response.body).toEqual(order1);
        orderId2 = response.body.data.id;
        createdAtPut2 = response.body.data.createdAt;
    });

    it('удаление ордера по ид', async () => {
        const response = await request(app).delete(`/orders/${orderId2}`).set('Authorization', "Bearer "+token);
        console.log("response",JSON.stringify(response.text))
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            status: 200,
            data:1,
            message: 'заказ удален'
        });
    });


    it('изменение ордера', async () => {
        const order1 = { "userId": "userId1", "amount": 1, "status": "canceled","test":"test"}

        const response = await request(app).put(`/orders/${orderId2}`).send(order1).set('Authorization', "Bearer "+token);
        console.log("response",JSON.stringify(response.text))
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            status: 200,
            data: {
                id: orderId2,
                userId: 'userId1',
                amount: 1,
                status: 'canceled',
                createdAt: createdAtPut2
            },
            message: 'заказ изменен'
        });
    });

    it('получение ордера по ид', async () => {

        const response = await request(app).get(`/orders/${orderId2}`).set('Authorization', "Bearer "+token);
        console.log("response",JSON.stringify(response.text))
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            status: 200,
            data: {
                id: orderId2,
                userId: 'userId1',
                amount: 1,
                status: 'canceled',
                createdAt: createdAtPut2
            },
            message: 'заказ получен'
        });
    });


    it('получение ордеров по userId', async () => {
        let req = "?userId=userId1&page=1&limit=10";
        const response = await request(app).get(`/orders/${req}`).set('Authorization', "Bearer "+token);
        console.log("response",JSON.stringify(response.text))
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            status: 200,
            data:{total: 2, orders: [{
                    id: orderIdPut,
                    userId: 'userId1',
                    amount: 1,
                    status: 'pending',
                    createdAt: createdAtPut
                },
                    {
                        id: orderId2,
                        userId: 'userId1',
                        amount: 1,
                        status: 'canceled',
                        createdAt: createdAtPut2
                    }

                ], page:1, totalPages: 1},
            message: 'заказы получены'
        });
    });

    it('удаление ордера по ид', async () => {
        const response = await request(app).delete(`/orders/${orderId2}`).set('Authorization', "Bearer "+token);
        console.log("response",JSON.stringify(response.text))
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            status: 200,
            data:1,
            message: 'заказ удален'
        });
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

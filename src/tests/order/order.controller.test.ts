import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import {OrderController} from "../../controllers/order.controller";
import {OrderService} from "../../services/order.service";
import { describe, it, expect, beforeEach,beforeAll } from '@jest/globals';
import {IOrder} from '../../types/order';

let orderService = new OrderService();

/*const app = express();
app.use(bodyParser.json());
let orderController = new OrderController();
app.post('/orders', orderController.postOrder);*/
//app.get('/users', listUsers);
import App from "../../app";


/*const app1 = new App();

app1.listen();*/
let application:App;
let app: express.Application;
let token: string;

beforeAll(async () => {
    // Сброс массива пользователей перед каждым тестом
    application = await App.create();
    app = application.getApp();
    jest.clearAllMocks();
});

afterAll(async () => {
    // Закрытие приложения, если это применимо
    application.closeServer(); // Или другой метод очистки
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



    it('создание ордера', async () => {
        const order1 = { "userId": "userId1", "amount": 1, "status": "pending",}

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

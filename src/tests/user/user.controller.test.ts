import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import {OrderController} from "../../controllers/order.controller";
import {OrderService} from "../../services/order.service";
import { describe, it, expect, beforeEach,beforeAll,afterAll } from '@jest/globals';
import {IOrder} from '../../types/order';

//let orderService = new OrderService();

/*const app = express();
app.use(bodyParser.json());
let orderController = new OrderController();
app.post('/orders', orderController.postOrder);*/
//app.get('/users', listUsers);
import App from "../../app";
import {Types} from "mongoose";


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
    console.log("afterAll")
    await application.closeServer(); // Или другой метод очистки
});

const user_data = {
    username: "user3",
    password: "password11"
};

describe('User Controller', () => {
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

  /*  _id?: Types.ObjectId;
    name: string;
    email: string;
    profile?: Object;
    createdAt?: Date;*/
    let userId1 = "";
    let createdAtPut = '';
    it('добавление пользователя', async () => {
        const user1 = { "name": "user1", "email": "email@user1", "profile": {t:"t"},"test":"test"}

        const response = await request(app).post('/users').send(user1).set('Authorization', "Bearer "+token);
        console.log("response",JSON.stringify(response.text))
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            status: 200,
            data: {
                _id: expect.any(String), // Проверяем, что id — это число
                name: 'user1',
                email: "email@user1",
                profile: {t:"t"},
                createdAt: expect.any(String)
            },
            message: 'пользователь добавлен'
        });
        const createdAt = new Date(response.body.data.createdAt);
        expect(createdAt).toBeInstanceOf(Date);
        expect(createdAt.getTime()).toBeGreaterThan(0);
        //expect(response.body).toEqual(user1);
        userId1 = response.body.data._id;
        createdAtPut = response.body.data.createdAt;
    });


    let userId2 = 0;
    let createdAtPut2 = ''
    it('добавление пользователя 2', async () => {
        const user2 = { "name": "user2", "email": "email@user2", "profile": {t:"t1"},"test":"test"}

        const response = await request(app).post('/users').send(user2).set('Authorization', "Bearer "+token);
        console.log("response",JSON.stringify(response.text))
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            status: 200,
            data: {
                _id: expect.any(String), // Проверяем, что id — это число
                name: 'user2',
                email: "email@user2",
                profile: {t:"t1"},
                createdAt: expect.any(String)
            },
            message: 'пользователь добавлен'
        });
        const createdAt = new Date(response.body.data.createdAt);
        expect(createdAt).toBeInstanceOf(Date);
        expect(createdAt.getTime()).toBeGreaterThan(0);
        //expect(response.body).toEqual(order1);
        userId2 = response.body.data._id;
        createdAtPut2 = response.body.data.createdAt;
    });




    it('обновление пользователя', async () => {
        const user2 = { "name": "user2", "email": "email1@user2", "profile": {t:"t2"},"test":"test"}

        const response = await request(app).put(`/users/${userId2}`).send(user2).set('Authorization', "Bearer "+token);
        console.log("response",JSON.stringify(response.text))
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            status: 200,
            data: {
                _id: userId2,
                name: 'user2',
                email: "email1@user2",
                profile: {t:"t2"},
                createdAt: createdAtPut2
            },
            message: 'пользователь обновлен'
        });
    });

    it('получение пользователя по ид', async () => {

        const response = await request(app).get(`/users/${userId2}`).set('Authorization', "Bearer "+token);
        console.log("response",JSON.stringify(response.text))
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            status: 200,
            data: {
                _id: userId2,
                name: 'user2',
                email: "email1@user2",
                profile: {t:"t2"},
                createdAt: createdAtPut2
            },
            message: 'пользователь получен'
        });
    });


    /*it('получение ордера по userId', async () => {
        let req = "?userId=userId1&page=1&limit=10";
        const response = await request(app).get(`/orders/${req}`).set('Authorization', "Bearer "+token);
        console.log("response",JSON.stringify(response.text))
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            status: 200,
            data:{total: 2, orders: [{
                    id: userId1,
                    userId: 'userId1',
                    amount: 1,
                    status: 'pending',
                    createdAt: createdAtPut
                },
                    {
                        id: userId2,
                        userId: 'userId1',
                        amount: 1,
                        status: 'canceled',
                        createdAt: createdAtPut2
                    }

                ], page:1, totalPages: 1},
            message: 'заказы получены'
        });
    });*/

   /* it('удаление ордера по ид', async () => {
        const response = await request(app).delete(`/orders/${userId2}`).set('Authorization', "Bearer "+token);
        console.log("response",JSON.stringify(response.text))
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            status: 200,
            data:1,
            message: 'заказ удален'
        });
    });*/


});

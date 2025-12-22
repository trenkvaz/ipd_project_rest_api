import request from 'supertest';
import express from 'express';
import { describe, it, expect, beforeEach,beforeAll,afterAll } from '@jest/globals';
import App from "../../app";
import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();

import { exec } from 'child_process';
import { promisify } from 'util';
import supertest from "supertest";
const execPromise = promisify(exec);


const startContainers = async () => {
    try {
        await execPromise("docker-compose -f docker-compose_test.yml up -d");
    } catch (error:any) {
        throw new Error(`Error starting containers: ${error}`);
    }
};

const stopContainers = async () => {
    try {
        await execPromise("docker-compose -f docker-compose_test.yml down");
    } catch (error:any) {
        throw new Error(`Error stopping containers: ${error}`);
    }
};


const waitForService = async (url: string, timeout: number = 30000) => {
    const startTime = Date.now();
    while (true) {
        try {
            await axios.get(url);
            console.log(`Сервис запущен! ${url}`);
            return;
        } catch (error:any) {
            if (Date.now() - startTime > timeout) {
                throw new Error(`Сервис не смог запуститься за отведенное время: ${url}`);
            }
            if(error.status&&error.status===403)return;
            console.log(`Ожидание запуска сервиса ${url}...${error.status}`);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
};




let isDocker = true;

let application:App;
let app: express.Application | string;
let token: string;


//'http://localhost:3100/api-docs/api/users'
beforeAll(async () => {

    if(!isDocker){
        application = await App.create();
        app = application.getApp();
    } else {
        await startContainers();
        await waitForService("http://localhost:3100/orders");
        let port:string = process.env.PORT!.toString();
        app = 'http://localhost:'+port;
    }
    jest.clearAllMocks();
},30000);

afterAll(async () => {
    if(!isDocker) await application.closeServer();
    else await stopContainers();
});

const user_data = {
    username: "user3",
    password: "password11"
};

describe('User Controller', () => {


    it('регистрация', async () => {
        // @ts-ignore
        const response = await request(app).post('/register').send(user_data);
        //console.log("response",JSON.stringify(response.text))
        expect(response.status).toBe(201);
        expect(response.body).toEqual({"message": "Пользователь успешно зарегистрирован"});
    });


    it('получение токена', async () => {
        // @ts-ignore
        const response = await request(app).post('/login').send(user_data);
        console.log("response",JSON.stringify(response.text))

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({token: expect.any(String)});
        token = response.body.token;
    });


    let userId1 = "";
    let createdAtPut = '';
    it('добавление пользователя', async () => {
        const user1 = { "name": "user1", "email": "email@user1", "profile": {t:"t"},"test":"test"}
        // @ts-ignore
        const response = await request(app).post('/users').send(user1).set('Authorization', "Bearer "+token);
        console.log("response",JSON.stringify(response.text))
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            status: 200,
            data: {
                _id: expect.any(String),
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
        // @ts-ignore
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
        // @ts-ignore
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
        // @ts-ignore
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


    it('получение пользователей', async () => {
        let req = "?page=1&limit=10";
        // @ts-ignore
        const response = await request(app).get(`/users/${req}`).set('Authorization', "Bearer "+token);
        console.log("response",JSON.stringify(response.text))
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            status: 200,
            data:{total: 2, users: [{
                    _id: userId1,
                    name: 'user1',
                    email: "email@user1",
                    profile: {t:"t"},
                    createdAt: createdAtPut
                },
                    {
                        _id: userId2,
                        name: 'user2',
                        email: "email1@user2",
                        profile: {t:"t2"},
                        createdAt: createdAtPut2
                    }

                ], page:1, totalPages: 1},
            message: 'пользователи получены'
        });
    });


    it('удаление пользователя по ид', async () => {
        // @ts-ignore
        const response = await request(app).delete(`/users/${userId2}`).set('Authorization', "Bearer "+token);
        console.log("response",JSON.stringify(response.text))
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            status: 200,
            data:{acknowledged:true,deletedCount:1},
            message: 'пользователь удален'
        });
    });

});

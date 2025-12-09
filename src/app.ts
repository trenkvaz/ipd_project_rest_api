import * as dotenv from 'dotenv';
dotenv.config();
import {mongoConnection,closeMongo} from "./config/mongoose";
import {postgresConnection,closePostgres} from "./config/sequelize";
import {IOrder} from './types/order';
import {IUser} from './types/user';
//import {creatOrder} from './repositories/pg/order.repository';
import UserRepository from './repositories/mongo/user.repository';
import OrderRepository from './repositories/pg/order.repository';

import express, {NextFunction, Request, Response} from 'express'
//import 'reflect-metadata'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import helmet from 'helmet'
import hpp from 'hpp'
//import {CreationAttributes} from "sequelize";
import {OrderRoutes} from "./routes/order.routes";
import {UserRoutes} from "./routes/user.routes";
import {AppError, ErrorMiddleware} from "./middlewares/error.middleware";
import passport ,{authRouter,authMiddleware} from "./middlewares/auth.middleware";
import bodyParser from 'body-parser';
import http from 'http';
import requestLogger from './utils/logger';
//import createError from 'http-errors';
class App {
    private userRepository: UserRepository;
    private orderRepository: OrderRepository;
    private expressApp: express.Application;
    //private env: string
    private port: string | number;
    private server:any;
    constructor() {
        this.expressApp = express();
        this.port = process.env.PORT!.toString();
        console.log("port", this.port);
        console.log(typeof this.port);
        this.initExpressAppMiddlewares();
        this.initAuthorization();
        this.initRoutes();
        this.expressApp.use(ErrorMiddleware);
        //this.connectToDatabases();
        this.userRepository = new UserRepository();
        this.orderRepository = new OrderRepository();
    }

    initExpressAppMiddlewares(){
        this.expressApp.use(cors({ origin: process.env.ORIGIN! }));
        this.expressApp.use(hpp());
        this.expressApp.use(helmet());
        this.expressApp.use(compression());
        this.expressApp.use(express.json());
        this.expressApp.use(express.urlencoded({ extended: true }));
        this.expressApp.use(cookieParser());
        this.expressApp.use(requestLogger);
        //this.expressApp.use(bodyParser.json());
    }

    initAuthorization(){
        this.expressApp.use(passport.initialize());
        this.expressApp.use('/', authRouter());
        this.expressApp.use(authMiddleware);
    }

    private initRoutes() {
        this.expressApp.use('/', new OrderRoutes().getRouter());
        this.expressApp.use('/', new UserRoutes().getRouter());
    }

    public listen() {
        //server.on('error', onError);
        /*this.expressApp.listen(this.port, () => {
            console.log("listen");
        })*/
        console.log("server listen()")
        this.expressApp.use(function(req: Request, res: Response, next:NextFunction) {
            next(new AppError("he he not found",404));
            //next(createError())
        });
        this.server = http.createServer(this.expressApp);
        this.server.on('error', (error:any) => {
            console.log('Error occurred:', error);
            //process.exit(0);
        });
        this.server.listen(this.port, () => {
            console.log(`Server is running on http://localhost:${this.port}`);
        });


        /*process.on('SIGINT', () => {
            console.log("Получен сигнал завершения. Приложение завершено.");
            process.exit(0);
        });*/
    }

    public async closeServer(){
        this.server.close();
        //console.log('MongoDB connection closed');
        await closeMongo();
        //console.log('PostgreSQL connection closed');
        await closePostgres(false);
    }
    static async create() {
        const app = new App();
        app.listen();
        await app.connectToDatabases();
        return app;
    }




    private async connectToDatabases() {
        try {
            await mongoConnection();
            await postgresConnection(false);
           // this.testDB();
        } catch (e) {
            await this.closeServer();
            //process.exit(1);
            throw e;
        }
    }

    public getApp(){
        return this.expressApp;
    }

    private async testDB(){
        const order:IOrder= {
            userId: "userId1",
            amount: 1,
            status: 'pending'
        }
        /*type OrderCreationAttributes = CreationAttributes<IOrder>;

        const newOrder: OrderCreationAttributes = {
            userId: 1,
            amount: 100,
            status: 'pending',
        };*/

       /* let resOrder =(await this.orderRepository.creatOrder(order))
        let resOrder1 =(await this.orderRepository.creatOrder(order))
        console.log(typeof resOrder)*/
      /*  if (resOrder.dataValues.id === undefined || resOrder.dataValues.createdAt === undefined) {
            throw new Error('Order creation failed: id or createdAt is undefined');
        }
        const order1: IOrder = {
            id: resOrder.dataValues.id,
            userId: resOrder.dataValues.userId,
            amount: resOrder.dataValues.amount,
            status: resOrder.dataValues.status,
            createdAt: resOrder.dataValues.createdAt
        };*/

       // console.log(order1)

        console.log((await this.orderRepository.getOrders(1,10,10,"userId1")))
        const user:IUser = {
            name:"name",
            email:"email12",
            profile:{test:"test"}
        }
        /*try {
            let res = await this.userRepository.creatUser(user);
            console.log((typeof res))
            console.log(res)

            console.log("find",(await this.userRepository.getUserById(res._id)));
        } catch (e) {
            if(e instanceof Error)
            console.log("error userRepository",e.message)
        }
*/

       // console.log("users ",JSON.stringify((await this.userRepository.getUsers(1,100))))
    }
}

export default App


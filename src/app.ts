import * as dotenv from 'dotenv';
dotenv.config();
import {mongoConnection} from "./config/mongoose";
import {postgresConnection} from "./config/sequelize";
import {IOrder} from './types/order';
import {IUser} from './types/user';
//import {creatOrder} from './repositories/pg/order.repository';
import UserRepository from './repositories/mongo/user.repository';
import OrderRepository from './repositories/pg/order.repository';

import express from 'express'
//import 'reflect-metadata'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import helmet from 'helmet'
import hpp from 'hpp'
//import {CreationAttributes} from "sequelize";
import {OrderRoutes} from "./routes/order.routes";
import {ErrorMiddleware} from "./middlewares/error.middleware";

class App {
    private userRepository: UserRepository;
    private orderRepository: OrderRepository;
    private expressApp: express.Application;
    //private env: string
    private port: string | number

    constructor() {
        this.expressApp = express();
        this.port = process.env.PORT!.toString();
        console.log("port",this.port)
        console.log(typeof this.port)
        this.initExpressAppMiddlewares();
        this.initRoutes();
        this.expressApp.use(ErrorMiddleware)
        this.connectToDatabases();
        this.userRepository = new UserRepository();
        this.orderRepository = new OrderRepository();
    }

    initExpressAppMiddlewares(){
        this.expressApp.use(cors({ origin: process.env.ORIGIN! }))
        this.expressApp.use(hpp())
        this.expressApp.use(helmet())
        this.expressApp.use(compression())
        this.expressApp.use(express.json())
        this.expressApp.use(express.urlencoded({ extended: true }))
        this.expressApp.use(cookieParser())

    }

    private initRoutes() {
        this.expressApp.use('/', new OrderRoutes().getRouter())
    }

    public listen() {
        this.expressApp.listen(this.port, () => {
            console.log("listen")
        })
    }

    private async connectToDatabases() {
        try {
            await mongoConnection();
            await postgresConnection();
           // this.testDB();
        } catch (e) {
            throw e
        }
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

        console.log((await this.orderRepository.getOrders(1,10,"userId1")))
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


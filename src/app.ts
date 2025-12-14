import * as dotenv from 'dotenv';
dotenv.config();
import {mongoConnection,closeMongo} from "./config/mongoose";
import {postgresConnection,closePostgres} from "./config/sequelize";
import UserRepository from './repositories/mongo/user.repository';
import OrderRepository from './repositories/pg/order.repository';
import express, {NextFunction, Request, Response} from 'express'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import helmet from 'helmet'
import hpp from 'hpp'
import {OrderRoutes} from "./routes/order.routes";
import {UserRoutes} from "./routes/user.routes";
import {AppError, ErrorMiddleware} from "./middlewares/error.middleware";
import passport ,{authRouter,authMiddleware} from "./middlewares/auth.middleware";
import http from 'http';
import requestLogger from './utils/logger';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';


class App {
    private userRepository: UserRepository;
    private orderRepository: OrderRepository;
    private expressApp: express.Application;
    private port: string | number;
    private server:any;
    constructor() {
        this.expressApp = express();
        this.port = process.env.PORT!.toString();
        console.log("port", this.port);
        console.log(typeof this.port);
        this.initSwagger();
        this.initExpressAppMiddlewares();
        this.initAuthorization();
        this.initRoutes();
        this.expressApp.use(ErrorMiddleware);
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

        console.log("server listen()")
        this.expressApp.use(function(req: Request, res: Response, next:NextFunction) {
            next(new AppError("he he not found",404));
        });
        this.server = http.createServer(this.expressApp);
        this.server.on('error', (error:any) => {
            console.log('Error occurred:', error);
        });
        this.server.listen(this.port, () => {
            console.log(`Server is running on http://localhost:${this.port}`);
        });
    }

    public async closeServer(){
        this.server.close();
        await closeMongo();
        await closePostgres();
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
            await postgresConnection();
        } catch (e) {
            await this.closeServer();
            throw e;
        }
    }

    public getApp(){
        return this.expressApp;
    }

    initSwagger(){
        const swaggerOptions = {
            swaggerDefinition: {
                openapi: '3.0.0',
                info: {
                    title: 'My API',
                    version: '1.0.0',
                    description: 'API для управления заказами и пользователями',
                },
                servers: [
                    {
                        url: 'http://localhost:'+this.port,
                    },
                ],
            },
            apis: ['./src/routes/*.ts'], // путь к файлам с аннотациями
        };
        const swaggerDocs = swaggerJsDoc(swaggerOptions);
        this.expressApp.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
    }
}

export default App


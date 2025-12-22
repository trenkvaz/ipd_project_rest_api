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

        this.expressApp.use(function(req: Request, res: Response, next:NextFunction) {
            next(new AppError("хе хе хе не нашлось",404));
        });
        this.server = http.createServer(this.expressApp);
        this.server.on('error', (error:any) => {
            console.log('Ошибка сервера:', error);
        });
        this.server.listen(this.port, () => {
            console.log(`Сервер запущен на http://localhost:${this.port}`);
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
                    title: 'Ipd project rest api',
                    version: '1.0.0',
                    description: 'API для управления заказами и пользователями',
                },
                servers: [
                    {
                        url: 'http://localhost:'+this.port,
                    },
                ],
                components: {
                    securitySchemes: {
                        Bearer: {
                            type: 'http',
                            scheme: 'bearer',
                            bearerFormat: 'JWT',
                            description: 'Используется токен полученный в запросе /login'
                        },
                    },
                },
            },
            apis: ['./src/middlewares/auth.middleware.ts','./src/routes/*.ts']
        };
        const swaggerDocs = swaggerJsDoc(swaggerOptions);
        this.expressApp.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
    }
}

export default App


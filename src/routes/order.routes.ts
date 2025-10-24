import { Router, Request, Response, NextFunction } from 'express';
import {OrderController} from "../controllers/order.controller";
import {ErrorMiddleware} from "../middlewares/error.middleware";
import passport ,{authRouter,authMiddleware} from "../middlewares/auth.middleware";
export class OrderRoutes {

    private orderController:OrderController;
   /* async testService (req: Request, res: Response, next: NextFunction){
        // Ваша логика здесь
        res.send("Service called");
    }
*/

    constructor() {
        this.orderController = new OrderController();
    }
    testService = async (req: Request, res: Response, next: NextFunction) => {
        console.log("testService")
        // Ваша логика здесь
        try {
            res.send("Service called");
        } catch (e) {
            next();
        }

    }
    getRouter(): Router{
        const path = "/orders"
        const router = Router();

        router.get(`${path}/`,this.testService);
        router.get(`${path}/:id`, this.testService);
        router.post(`${path}`,this.orderController.postOrder);
        router.put(`${path}/:id`, this.testService);
        router.delete(`${path}/:id`, this.testService);

        return router;
    }






}
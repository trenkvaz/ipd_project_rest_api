import { Router, Request, Response, NextFunction } from 'express';
import {UserController} from "../controllers/user.controller";
import {ErrorMiddleware} from "../middlewares/error.middleware";
import passport ,{authRouter,authMiddleware} from "../middlewares/auth.middleware";
export class UserRoutes {

    private userController:UserController;
    /* async testService (req: Request, res: Response, next: NextFunction){
         // Ваша логика здесь
         res.send("Service called");
     }
 */

    constructor() {
        this.userController = new UserController();
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
        const path = "/users"
        const router = Router();

        router.get(`${path}/`,this.userController.getOrders);
        router.get(`${path}/:id`, this.userController.getUser);
        router.post(`${path}`,this.userController.postUser);
        router.put(`${path}/:id`,this.userController.putUser);
        router.delete(`${path}/:id`, this.userController.deleteOrder);

        return router;
    }
}
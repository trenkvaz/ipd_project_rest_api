import { Router } from 'express';
import {OrderController} from "../controllers/order.controller";

export class OrderRoutes {

    private orderController:OrderController;

    constructor() {
        this.orderController = new OrderController();
    }


    getRouter(): Router{
        const path = "/orders"
        const router = Router();

        /**
         * @swagger
         * /orders:
         *   post:
         *     summary: Создать новый заказ
         *     tags: [Orders]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               userId:
         *                 type: string
         *                 example: userId1
         *               amount:
         *                 type: integer
         *                 example: 1
         *               status:
         *                 type: string
         *                 example: pending
         *     responses:
         *       200:
         *         description: Заказ создан
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 200
         *                 data:
         *                   type: object
         *                   properties:
         *                     id:
         *                       type: string
         *                       example: orderId1
         *                     userId:
         *                       type: string
         *                       example: userId1
         *                     amount:
         *                       type: integer
         *                       example: 1
         *                     status:
         *                       type: string
         *                       example: pending
         *                     createdAt:
         *                       type: string
         *                       format: date-time
         *                       example: '2023-12-14T10:00:00Z'
         *                 message:
         *                   type: string
         *                   example: 'заказ создан'
         *       400:
         *         description: Ошибка валидации данных
         *       500:
         *         description: Ошибка сервера
         */

        /**
         * @swagger
         * /orders/{id}:
         *   put:
         *     summary: Изменить заказ
         *     tags: [Orders]
         *     parameters:
         *       - name: id
         *         in: path
         *         required: true
         *         description: ID заказа
         *         schema:
         *           type: string
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               userId:
         *                 type: string
         *                 example: userId1
         *               amount:
         *                 type: integer
         *                 example: 2
         *               status:
         *                 type: string
         *                 example: shipped
         *     responses:
         *       200:
         *         description: Заказ изменен
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 200
         *                 data:
         *                   type: object
         *                   properties:
         *                     id:
         *                       type: string
         *                       example: orderId1
         *                     userId:
         *                       type: string
         *                       example: userId1
         *                     amount:
         *                       type: integer
         *                       example: 2
         *                     status:
         *                       type: string
         *                       example: shipped
         *                     createdAt:
         *                       type: string
         *                       format: date-time
         *                       example: '2023-12-14T10:00:00Z'
         *                 message:
         *                   type: string
         *                   example: 'заказ изменен'
         *       404:
         *         description: Пользователь не найден
         *       400:
         *         description: Ошибка валидации данных
         *       500:
         *         description: Ошибка сервера
         */

        /**
         * @swagger
         * /orders:
         *   get:
         *     summary: Получить список заказов с пагинацией
         *     tags: [Orders]
         *     parameters:
         *       - name: userId
         *         in: query
         *         description: ID пользователя для фильтрации заказов
         *         schema:
         *           type: string
         *           example: userId1
         *       - name: page
         *         in: query
         *         description: Номер страницы
         *         schema:
         *           type: integer
         *           example: 1
         *       - name: limit
         *         in: query
         *         description: Количество заказов на странице
         *         schema:
         *           type: integer
         *           example: 10
         *     responses:
         *       200:
         *         description: Список заказов
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 200
         *                 data:
         *                   type: object
         *                   properties:
         *                     total:
         *                       type: integer
         *                       example: 2
         *                     orders:
         *                       type: array
         *                       items:
         *                         type: object
         *                         properties:
         *                           id:
         *                             type: string
         *                             example: orderId1
         *                           userId:
         *                             type: string
         *                             example: userId1
         *                           amount:
         *                             type: integer
         *                             example: 1
         *                           status:
         *                             type: string
         *                             example: pending
         *                           createdAt:
         *                             type: string
         *                             format: date-time
         *                             example: '2023-12-14T10:00:00Z'
         *                     page:
         *                       type: integer
         *                       example: 1
         *                     totalPages:
         *                       type: integer
         *                       example: 1
         *                 message:
         *                   type: string
         *                   example: 'заказы получены'
         *       500:
         *         description: Ошибка сервера
         */

        /**
         * @swagger
         * /orders/{id}:
         *   get:
         *     summary: Получить заказ по ID
         *     tags: [Orders]
         *     parameters:
         *       - name: id
         *         in: path
         *         required: true
         *         description: ID заказа
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: Заказ найден
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 200
         *                 data:
         *                   type: object
         *                   properties:
         *                     id:
         *                       type: string
         *                       example: orderId1
         *                     userId:
         *                       type: string
         *                       example: userId1
         *                     amount:
         *                       type: integer
         *                       example: 1
         *                     status:
         *                       type: string
         *                       example: pending
         *                     createdAt:
         *                       type: string
         *                       format: date-time
         *                       example: '2023-12-14T10:00:00Z'
         *                 message:
         *                   type: string
         *                   example: 'заказ найден'
         *       404:
         *         description: Заказ не найден
         *       500:
         *         description: Ошибка сервера
         */

        /**
         * @swagger
         * /orders/{id}:
         *   delete:
         *     summary: Удалить заказ по ID
         *     tags: [Orders]
         *     parameters:
         *       - name: id
         *         in: path
         *         required: true
         *         description: ID заказа
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: Пользователь успешно удален
         *       500:
         *         description: Ошибка сервера
         */

        router.get(`${path}/`,this.orderController.getOrders);
        router.get(`${path}/:id`, this.orderController.getOrder);
        router.post(`${path}`,this.orderController.postOrder);
        router.put(`${path}/:id`,this.orderController.putOrder);
        router.delete(`${path}/:id`, this.orderController.deleteOrder);

        return router;
    }






}
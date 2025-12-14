import { Router } from 'express';
import {UserController} from "../controllers/user.controller";
export class UserRoutes {

    private userController:UserController;

    constructor() {
        this.userController = new UserController();
    }

    /**
     * @swagger
     * tags:
     *   name: Users
     *   description: Управление пользователями
     */
    getRouter(): Router{
        const path = "/users"
        const router = Router();
        /**
         * @swagger
         * /users:
         *   get:
         *     summary: Получить список пользователей с пагинацией
         *     tags: [Users]
         *     parameters:
         *       - name: page
         *         in: query
         *         description: Номер страницы
         *         schema:
         *           type: integer
         *           example: 1
         *       - name: limit
         *         in: query
         *         description: Количество пользователей на странице
         *         schema:
         *           type: integer
         *           example: 10
         *     responses:
         *       200:
         *         description: Список пользователей
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
         *                     users:
         *                       type: array
         *                       items:
         *                         type: object
         *                         properties:
         *                           _id:
         *                             type: string
         *                             example: userId1
         *                           name:
         *                             type: string
         *                             example: 'user1'
         *                           email:
         *                             type: string
         *                             example: 'email@user1'
         *                           profile:
         *                             type: object
         *                             properties:
         *                               t:
         *                                 type: string
         *                                 example: 't'
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
         *                   example: 'пользователи получены'
         *       500:
         *         description: Ошибка сервера
         */

        /**
         * @swagger
         * /users/{id}:
         *   get:
         *     summary: Получить пользователя по ID
         *     tags: [Users]
         *     description: Возвращает данные пользователя по указанному идентификатору.
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         description: Уникальный идентификатор пользователя
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: Успешный ответ с данными пользователя
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   description: Код статуса ответа
         *                 data:
         *                   type: object
         *                   properties:
         *                     _id:
         *                       type: string
         *                       description: Уникальный идентификатор пользователя
         *                     name:
         *                       type: string
         *                       description: Имя пользователя
         *                     email:
         *                       type: string
         *                       description: Электронная почта пользователя
         *                     profile:
         *                       type: object
         *                       properties:
         *                         t:
         *                           type: string
         *                           description: Дополнительные данные профиля
         *                     createdAt:
         *                       type: string
         *                       format: date-time
         *                       description: Дата создания пользователя
         *                 message:
         *                   type: string
         *                   description: Сообщение о результате запроса
         *       404:
         *         description: Пользователь не найден
         *       500:
         *         description: Ошибка сервера
         */

        /**
         * @swagger
         * /users:
         *   post:
         *     summary: Создать нового пользователя
         *     tags: [Users]
         *     description: Создает нового пользователя и возвращает его данные.
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               name:
         *                 type: string
         *               email:
         *                 type: string
         *               profile:
         *                 type: object
         *                 properties:
         *                   t:
         *                     type: string
         *     responses:
         *       200:
         *         description: Успешное создание пользователя
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                 data:
         *                   type: object
         *                   properties:
         *                     _id:
         *                       type: string
         *                     name:
         *                       type: string
         *                     email:
         *                       type: string
         *                     profile:
         *                       type: object
         *                       properties:
         *                         t:
         *                           type: string
         *                     createdAt:
         *                       type: string
         *                       format: date-time
         *                 message:
         *                   type: string
         *       400:
         *         description: Ошибка валидации данных
         *       500:
         *         description: Ошибка сервера
         */

        /**
         * @swagger
         * /users/{id}:
         *   put:
         *     summary: Обновить пользователя по ID
         *     tags: [Users]
         *     description: Обновляет данные существующего пользователя и возвращает обновленные данные.
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         description: Уникальный идентификатор пользователя
         *         schema:
         *           type: string
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               name:
         *                 type: string
         *               email:
         *                 type: string
         *               profile:
         *                 type: object
         *                 properties:
         *                   t:
         *                     type: string
         *     responses:
         *       200:
         *         description: Успешное обновление пользователя
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                 data:
         *                   type: object
         *                   properties:
         *                     _id:
         *                       type: string
         *                     name:
         *                       type: string
         *                     email:
         *                       type: string
         *                     profile:
         *                       type: object
         *                       properties:
         *                         t:
         *                           type: string
         *                     createdAt:
         *                       type: string
         *                       format: date-time
         *                 message:
         *                   type: string
         *       404:
         *         description: Пользователь не найден
         *       400:
         *         description: Ошибка валидации данных
         *       500:
         *         description: Ошибка сервера
         */

        /**
         * @swagger
         * /users/{id}:
         *   delete:
         *     summary: Удалить пользователя по ID
         *     tags: [Users]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         description: ID пользователя, которого нужно удалить
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: Пользователь успешно удален
         *       500:
         *         description: Ошибка сервера
         */

        router.get(`${path}/`,this.userController.getUsers);
        router.get(`${path}/:id`, this.userController.getUser);
        router.post(`${path}`,this.userController.postUser);
        router.put(`${path}/:id`,this.userController.putUser);
        router.delete(`${path}/:id`, this.userController.deleteUser);

        return router;
    }
}
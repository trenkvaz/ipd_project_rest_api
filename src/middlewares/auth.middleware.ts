import passport from "passport";
import {ExtractJwt,Strategy} from "passport-jwt";
import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import {AppError} from "./error.middleware";
import bcrypt from 'bcrypt';
interface User {
    id: number;
    username: string;
    password: string;
}

const users: User[] = [
    { id: 1, username: 'user1', password: 'password1' },
    { id: 2, username: 'user2', password: 'password2' }
];


const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'your_jwt_secret' // Замените на свой секрет
};

passport.use(new Strategy(opts, (jwtPayload, done) => {
    const user = users.find(user => user.id === jwtPayload.id);
    if (user) {
        return done(null, user);
    } else {
        return done(null, false);
    }
}));


export const authRouter = ()=>{
    /**
     * @swagger
     * tags:
     *   name: Logging
     *   description: Регистрация пользователя и получение токена
     */
    const router = Router();

    /**
     * @swagger
     * /register:
     *   post:
     *     tags: [Logging]
     *     summary: Регистрация нового пользователя
     *     description: Создает нового пользователя и возвращает сообщение о результате.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               username:
     *                 type: string
     *                 example: "user3"
     *               password:
     *                 type: string
     *                 example: "password11"
     *     responses:
     *       201:
     *         description: Пользователь успешно зарегистрирован
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Пользователь успешно зарегистрирован"
     *       400:
     *         description: Пользователь с таким именем уже существует
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Пользователь с таким именем уже существует"
     */

    /**
     * @swagger
     * /login:
     *   post:
     *     tags: [Logging]
     *     summary: Вход пользователя
     *     description: Проверяет учетные данные пользователя и возвращает токен.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               username:
     *                 type: string
     *                 example: "user3"
     *               password:
     *                 type: string
     *                 example: "password11"
     *     responses:
     *       200:
     *         description: Успешный вход, возвращает токен
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 token:
     *                   type: string
     *                   example: "your_jwt_token_here"
     *       400:
     *         description: Неверное имя пользователя или пароль
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Неверное имя пользователя или пароль"
     */


    router.post('/login', async (req: Request, res: Response) => {
        const { username, password } = req.body;

        const user = users.find(user => user.username === username);
        if (!user) {
            return res.status(400).json({ message: 'Неверное имя пользователя или пароль' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Неверное имя пользователя или пароль' });
        }


        const token = jwt.sign({ id: user.id }, opts.secretOrKey, { expiresIn: '1h' });
        return res.json({ token:token });
    });

    router.post('/register', async (req: Request, res: Response) => {
        const { username, password } = req.body;

        const existingUser = users.find(user => user.username === username);
        if (existingUser) {
            return res.status(400).json({ message: 'Пользователь с таким именем уже существует' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            id: users.length + 1,
            username,
            password: hashedPassword,
        };
        users.push(newUser);
        res.status(201).json({ message: 'Пользователь успешно зарегистрирован' });
    });
    return router;
}

export const authMiddleware =  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('jwt', { session: false }, (err: any, user: any, info: any) => {
        if (err) {
            next(new AppError('Ошибка авторизации: '+err.message,403));
        }
        if (!user) {
            next(new AppError('Отсутствует или неправильный токен авторизации',403));
        } else {
            req.user = user;
            next();
        }
    })(req, res, next);
};

export default passport;


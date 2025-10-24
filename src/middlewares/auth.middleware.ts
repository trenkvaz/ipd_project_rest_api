import passport from "passport";
import {ExtractJwt,Strategy} from "passport-jwt";
import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import {AppError} from "./error.middleware";
interface User {
    id: number;
    username: string;
    password: string;
}

const users: User[] = [
    { id: 1, username: 'user1', password: 'password1' },
    { id: 2, username: 'user2', password: 'password2' }
];

// Настройка стратегии JWT
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
    const router = Router();
    router.post('/login', (req: Request, res: Response) => {
        const { username, password } = req.body;
        const user = users.find(user => user.username === username && user.password === password);

        if (user) {
            const token = jwt.sign({ id: user.id }, opts.secretOrKey, { expiresIn: '1h' });
            return res.json({ token:token });
        } else {
            return res.status(401).json({ message: 'Неверные учетные данные' });
        }
    });
    return router;
}

export const authMiddleware =  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('jwt', { session: false }, (err: any, user: any, info: any) => {
        if (err) {
            return next(new AppError('Ошибка авторизации: '+err.message,403));
        }
        if (!user) {
            // Здесь можно обрабатывать запрос без аутентификации
            req.user = "test user"; // Установите пользователя как null
            next(new AppError('Отсутствует токен авторизации',403)); // Продолжите к следующему обработчику
        } else {
            req.user = user; // Установите пользователя
            next(); // Продолжите к следующему обработчику
        }
    })(req, res, next);
};

export default passport;


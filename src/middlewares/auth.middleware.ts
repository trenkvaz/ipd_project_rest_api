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
    const router = Router();
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
        //TODO test
       /* req.user = "test"; // Установите пользователя
        next(); // Продолжите к следующему обработчику"test"
        return*/
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


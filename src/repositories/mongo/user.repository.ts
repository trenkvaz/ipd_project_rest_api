import {IUser} from "../../types/user";
import UserModel from "../../models/mongo/user.model";
import {Types} from 'mongoose';
import {AppError} from "../../middlewares/error.middleware";


export default class UserRepository {

    public async creatUser(user:IUser){
        try {
            return (await UserModel.create(user) as unknown as IUser);
        } catch (error:any) {
            throw new AppError('Ошибка базы данных: ' + error.message,500);
        }

    }

    public async updateUser(user:IUser,_id: string){
        try {
            let res = await UserModel.findOneAndUpdate({ _id: _id }, { $set: user } ,{ new: true } );
            if(!res) throw new AppError('пользователь не найден',404);
            return res;
        } catch (error:any) {
            //console.log("ERROR")
            if(error instanceof AppError)throw error
            throw new AppError('Ошибка базы данных: ' + error.message,500);
        }
    }

    public async getUserById(id: Types.ObjectId | string){
        try {
           let res = await UserModel.findById(id) as unknown as IUser;
           if(!res) throw new AppError('пользователь не найден',404);
           return res;
        } catch (error:any) {
            //console.log("ERROR")
            if(error instanceof AppError)throw error
            throw new AppError('Ошибка базы данных: ' + error.message,500);
        }
    }

    public async deleteUserById(id: Types.ObjectId | string ){
        try {
            return (await UserModel.deleteOne({ _id: id }));
        } catch (error:any) {
            throw new AppError('Ошибка базы данных: ' + error.message,500);
        }

    }

    public async getUsers(page: number, offset:number, limit: number) {
        try {
            const count = await UserModel.countDocuments();
            const users = await UserModel.find().skip(offset).limit(limit).lean();
            return {total: count, users: users, page:page, totalPages: Math.ceil(count / limit)};
        } catch (error:any) {
            throw new AppError('Ошибка базы данных: ' + error.message,500);
        }

    }

}
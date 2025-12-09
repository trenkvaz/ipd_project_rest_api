import {IUser} from "../../types/user";
import UserModel from "../../models/mongo/user.model";
import {Types} from 'mongoose';
import {OrderModel} from "../../models/pg/order.model";
import {AppError} from "../../middlewares/error.middleware";


export default class UserRepository {

    public async creatUser(user:IUser){
        try {
            return (await UserModel.create(user) as unknown as IUser);
        } catch (error:any) {
            //console.log("ERROR")
            throw new AppError('Ошибка базы данных: ' + error.message,500);
        }

    }

    public async updateUser(user:IUser,_id: string){
        try {
            return (await UserModel.findOneAndUpdate({ _id: _id }, { $set: user } ,{ new: true } ));
        } catch (error:any) {
            //console.log("ERROR")
            throw new AppError('Ошибка базы данных: ' + error.message,500);
        }
    }

    public async getUserById(id: Types.ObjectId | string){
        try {
            return (await UserModel.findById(id) as unknown as IUser);
        } catch (error:any) {
            //console.log("ERROR")
            throw new AppError('Ошибка базы данных: ' + error.message,500);
        }
    }

    public async deleteUserById(id: Types.ObjectId | undefined){
        return (await UserModel.deleteOne(id));
    }

    public async getUsers(page: number, limit: number): Promise<{ users: IUser[]; total: number }> {
        const skip = (page - 1) * limit;
        const total = await UserModel.countDocuments();
        const users = await UserModel.find().skip(skip).limit(limit).lean();
        return { users, total };
    }

}
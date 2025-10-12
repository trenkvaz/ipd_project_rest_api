import {IUser} from "../../types/user";
import UserModel from "../../models/mongo/user.model";
import {Types} from 'mongoose';


export default class UserRepository {

    public async creatUser(user:IUser){
            return (await UserModel.create(user) as unknown as IUser);
    }

    public async updateUser(user:IUser){
        return (await UserModel.updateOne(user));
    }

    public async getUserById(id: Types.ObjectId | undefined){
        return (await UserModel.findById(id) as unknown as IUser);
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
import {IUser} from "../../types/user";
import mongoose, {Model, Schema, InferSchemaType} from 'mongoose';


const UserSchema: Schema<IUser> = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    profile: { type: Object, required: false },
    createdAt: { type: Date, default: Date.now }
});

const UserModel:Model<InferSchemaType<IUser>,any>= mongoose.model<InferSchemaType<IUser>>('User', UserSchema);

export default UserModel;
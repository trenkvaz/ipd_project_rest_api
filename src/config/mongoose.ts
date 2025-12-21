import * as dotenv from 'dotenv';
dotenv.config();
import mongoose,{ connect } from 'mongoose';
import UserModel from "../models/mongo/user.model";

const clearDB:boolean = Boolean(process.env.CLEAR_DB!)

export const mongoConnection = async () => {
    const url: string = process.env.MONGO!;
    const nameDB: string = process.env.MONGO_DB!;
    await connect(url, {dbName: nameDB,
        connectTimeoutMS: 5000,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 5000});
    console.log("mongoConnection testTB",clearDB)

    if(clearDB) clearCollection();
};


export const closeMongo = async ()=>{
    await mongoose.connection.close();
}


async function clearCollection() {
    try {
        await UserModel.deleteMany({}); // Удаляет все документы в коллекции
        console.log('Коллекция очищена.');
    } catch (error) {
        console.error('Ошибка при очистке коллекции:', error);
    }
}
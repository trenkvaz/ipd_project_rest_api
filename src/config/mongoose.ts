import * as dotenv from 'dotenv';
dotenv.config();
import { connect } from 'mongoose';

export const mongoConnection = async () => {
    const url: string = process.env.MONGO!;
    const nameDB: string = process.env.MONGO_DB!;
    await connect(url, {dbName: nameDB,
        connectTimeoutMS: 5000,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 5000});
    console.log("mongoConnection")
};
import * as dotenv from 'dotenv';
dotenv.config();
import { connect } from 'mongoose';

export const mongoConnection = async () => {
    const url: string = process.env.MONGO!;
    const nameDB: string = process.env.MONGO_DB!;
    await connect(url, {dbName: nameDB,
        connectTimeoutMS: 120000,
        serverSelectionTimeoutMS: 120000,
        socketTimeoutMS: 120000});
    console.log("mongoConnection")
};
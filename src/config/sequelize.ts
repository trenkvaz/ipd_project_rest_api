import * as dotenv from 'dotenv';
import {Sequelize} from 'sequelize';
import {OrderModel} from '../models/pg/order.model';
dotenv.config();

const database:string = process.env.POSTGRES_DATABASE!.toString();
const username:string = process.env.POSTGRES_USER!.toString();
const password:string = process.env.POSTGRES_PASSWORD!.toString();
const host:string = process.env.POSTGRES_HOST!.toString();
const port:number = Number(process.env.POSTGRES_PORT!);
//console.log(typeof password);
console.log("POSTGRES:");
console.log("database",database,"username",username,"password",password,"host",host,"port",port)


async function createDatabaseIfNotExists(){
    const sequelize1 = new Sequelize({
        dialect: 'postgres',
        username: username,
        password: password,
        host: host,
    });
    try {
        // Проверяем, существует ли база данных
        const [result] = await sequelize1.query(`SELECT 1 FROM pg_database WHERE datname='${database}'`);
        console.log(`База данных "${database}" уже существует.`+JSON.stringify(result));

        if (result.length > 0) {
            console.log(`База данных "${database}" уже существует.`);
        } else {
            console.log(`База данных "${database}" не найдена. Создаем...`);
            await sequelize_db.query(`CREATE DATABASE "${database}"`);
            console.log(`База данных "${database}" успешно создана.`);
        }


    } catch (error: any) {
        // Если база данных не существует, создаем её
        if (error.original && error.original.code === '3D000') {
            console.log(`База данных "${database}" не найдена. Создаем...`);
            await sequelize1.query(`CREATE DATABASE "${database}"`);
            console.log(`База данных "${database}" успешно создана.`);
        } else {
            console.error('Ошибка при проверке базы данных:', error);
            throw error;
        }
    }
    console.log("createDatabaseIfNotExists()")
}

export const sequelize_db :Sequelize = new Sequelize(database, username, password, {
    host: host,
    port: port,
    dialect: 'postgres',
    logging: false
});
const initModels = () => {
    OrderModel.initModel(sequelize_db);
};

export const postgresConnection = async () => {
    await createDatabaseIfNotExists();
    await sequelize_db.authenticate();
    initModels();
    await sequelize_db.sync({ force: true });
}


export const closePostgres = async () =>{
    await sequelize_db.close();
}

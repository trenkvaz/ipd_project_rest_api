import * as dotenv from 'dotenv';
import {Sequelize} from 'sequelize';
import {OrderModel} from '../models/pg/order.model';
import { newDb } from 'pg-mem';
dotenv.config();

const database:string = process.env.POSTGRES_DATABASE!.toString();
const username:string = process.env.POSTGRES_USER!.toString();
const password:string = process.env.POSTGRES_PASSWORD!.toString();
const host:string = process.env.POSTGRES_HOST!.toString();
const port:number = Number(process.env.POSTGRES_PORT!);
//console.log(typeof password);
console.log("POSTGRES:");
console.log("database",database,"username",username,"password",password,"host",host,"port",port)

let dialectModule:any = undefined;
async function createDatabaseIfNotExists(){
    const sequelize1 = new Sequelize({
        dialect: 'postgres',
        username: username,
        password: password,
        host: host
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

const sequelize_db :Sequelize = new Sequelize(database, username, password, {
    host: host,
    port: port,
    dialect: 'postgres',
    logging: false
});
const initModels = () => {
    OrderModel.initModel(sequelize_db);
};

let sequelize_test:Sequelize;
export const postgresConnection = async (isTest:boolean) => {
    console.log("isTest",isTest)
    if(isTest){
        try {
            const db = newDb();
            //db.public.many(`CREATE TYPE enum_orders_status AS ENUM ('pending', 'completed', 'canceled');`);
            /*sequelize_test = new Sequelize({
                dialect: 'postgres',
                dialectModule: db.adapters.createPg(),
            });*/

            sequelize_test = new Sequelize(database, username, password, {
                host: host,
                port: port,
                dialect: 'postgres',
                logging: false,
                dialectModule: db.adapters.createPg()
            });



            await sequelize_test.authenticate();
            console.log("Подключение к тестовой базе данных успешно!");

            // const result = await sequelize_test.query(`
            //     SELECT t.typname AS enum_name, array_agg(e.enumlabel ORDER BY enumsortorder) AS enum_value
            //     FROM pg_type t
            //     JOIN pg_enum e ON t.oid = e.enumtypid
            //     JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
            //     WHERE n.nspname = 'public' AND t.typname = 'enum_orders_status'
            //     GROUP BY 1;
            // `);
            // console.log("Перечисление:", result[0]);



            // Инициализация модели
            OrderModel.initModel(sequelize_test);
            console.log("Инициализация модели данных успешно!");
            // Синхронизация базы данных
            await sequelize_test.sync({ force: true });
            console.log("Синхронизация тестовой базы данных завершена!");

            // Проверка существования перечисления


        } catch (e:any) {
            console.error("postgresConnection test error "+JSON.stringify(e))
            throw e;
        }
    } else {
        await createDatabaseIfNotExists();
        await sequelize_db.authenticate();
        initModels();
        await sequelize_db.sync({ force: true });
    }
}


export const closePostgres = async (isTest:boolean) =>{
    if(isTest)await sequelize_test.close();
    await sequelize_db.close();
}

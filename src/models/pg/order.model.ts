import {Model, DataTypes, Sequelize, Optional,ModelAttributes} from 'sequelize';
//import {sequelize_db} from '../../config/sequelize';
import {IOrder} from "../../types/order";
import {SetOptions} from "sequelize/lib/model";
/*
interface OrderAttributes {
    id: number;
    userId: string;
    amount: number;
    status: 'pending' | 'paid' | 'canceled';
    createdAt?: Date; // Поля createdAt и updatedAt могут быть необязательными при создании
    updatedAt?: Date;
}

// Определяем интерфейс для создания нового заказа без id
type OrderCreationAttributes = Optional<OrderAttributes, 'id' | 'createdAt' | 'updatedAt'>;
export class OrderModel
    //extends Model
   extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes
{
    public id!: number;
    public userId!: string;
    public amount!: number;
    public status!: 'pending' | 'paid' | 'canceled';
    // Поля createdAt и updatedAt будут добавлены автоматически
}

OrderModel.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        amount: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('pending', 'paid', 'canceled'),
            allowNull: false,
        },
    },
    {
        sequelize_db,
        tableName: 'orders', // Изменяем имя таблицы на 'orders'
        timestamps: true, // Включаем автоматическое создание createdAt и updatedAt
    } as any
);
*/
/*id?: number;
userId: string;
amount: number;
status: 'pending' | 'paid' | 'canceled';
createdAt?: Date;*/

// @ts-ignore
export class OrderModel extends Model<IOrder>{
    declare id: number;
    declare userId: string;
    declare amount: number;
    declare status: 'pending' | 'paid' | 'canceled';
    declare createdAt: Date;
    /*public id?: number;
    public userId?: string;
    public amount?: number;
    public status?: 'pending' | 'paid' | 'canceled';
    public createdAt?: Date;*/
    // @ts-ignore
    //override set (): {};
    /*setAttributes(key: any, value: any): any {
        return super.set(key, value);
    }
    set(key: any, value: any): any {
        return super.set(key, value);
    }*/
    // Пустые реализации методов

    //setAttributes<K extends keyof OrderModel>(key: K, value: OrderModel[K], options?: SetOptions) {};
    //public setAttributes(keys: Partial<TModelAttributes>, options?: SetOptions): this;


        //return super.setAttributes(key, value, options);

    public static initModel(sequelize: Sequelize) {
        OrderModel.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                },
                userId: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                amount: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                status: {
                    //type: DataTypes.ENUM('pending', 'paid', 'canceled'),
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                createdAt: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    defaultValue: new Date(),
                },
            },
            {
                sequelize,
                modelName: 'Order',
                tableName:'orders',
                timestamps: false,
            }
        );
    }
}
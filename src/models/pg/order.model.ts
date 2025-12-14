import {Model, DataTypes, Sequelize} from 'sequelize';
import {IOrder} from "../../types/order";


// @ts-ignore
export class OrderModel extends Model<IOrder>{
    declare id: number;
    declare userId: string;
    declare amount: number;
    declare status: 'pending' | 'paid' | 'canceled';
    declare createdAt: Date;

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
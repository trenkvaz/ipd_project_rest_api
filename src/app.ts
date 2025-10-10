import {mongoConnection} from "./config/mongoose";
import {postgresConnection} from "./config/sequelize";
import {IOrder} from './types/order';
import {creatOrder} from './repositories/pg/order.repository'
//import {CreationAttributes} from "sequelize";

class App {

    constructor() {
        this.connectToDatabases();
    }
    private async connectToDatabases() {
        try {
            await mongoConnection();
            await postgresConnection();
            this.testDB();
        } catch (e) {
            throw e
        }

    }

    private async testDB(){
        const order:IOrder= {
            userId: "userId1",
            amount: 1,
            status: 'pending'
        }
        /*type OrderCreationAttributes = CreationAttributes<IOrder>;

        const newOrder: OrderCreationAttributes = {
            userId: 1,
            amount: 100,
            status: 'pending',
        };*/
        console.log((await creatOrder(order)))
    }
}

export default App


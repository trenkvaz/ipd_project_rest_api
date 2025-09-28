import {mongoConnection} from "./config/mongoose";


class App {

    constructor() {
        this.connectToDatabases();
    }
    private async connectToDatabases() {
        await mongoConnection();
    }
}

export default App


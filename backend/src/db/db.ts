import mongoose from "mongoose";
import env from "../config/config.js";
import type { EnvConfig } from "../Types/type.js";

const config:EnvConfig = env;  

const connectToDb = async()=>{
    try {
        const connection = await mongoose.connect(`${config.MONGO_URL}/${config.MONGO_DB_NAME}`);
        console.log("Db connect successfully 😊")

    } catch (error:unknown) {
        console.log("failed to connect to Db");
        throw error;
    }
}

export default connectToDb;
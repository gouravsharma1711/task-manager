import type {EnvConfig} from "../Types/type.js"

const getEnv = ( 
    key:string,
    defaultValue?:string
):string =>{
    
    const value = process.env[key] ?? defaultValue;

    if(!value){
        throw new Error(`Missing required env variable : ${key}`)
    }

    return value;
}

const env:EnvConfig = {
    PORT :Number( getEnv("PORT","5000") ),
    MONGO_DB_NAME: getEnv("MONGO_DB_NAME"),
    MONGO_URL: getEnv("MONGO_URL"),
    NODE_ENV:getEnv("NODE_ENV")
}

export default env;
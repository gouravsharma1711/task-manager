import env from "../config/config.js";
import type { EnvConfig } from "../Types/type.js";
const config:EnvConfig =  env;

class ApiError extends Error{
    statusCode:number;
    data: unknown;

    constructor(
        statusCode:number,
        message: string = "Something went wrong",
        data: unknown = null
    ){
        super(message)

        this.statusCode = statusCode;
        this.data = data;
        this.name ="ApiError"

        Error.captureStackTrace(this,this.constructor)

        if(config.NODE_ENV != "development") {
            delete this.stack;
        }
    }

}

export default ApiError;
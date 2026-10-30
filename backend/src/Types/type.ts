import mongoose from "mongoose";

export interface EnvConfig{
    PORT:number,
    MONGO_DB_NAME:string,
    MONGO_URL:string,
    NODE_ENV:string
}

export interface ITask {
    _id?:mongoose.Types.ObjectId,
    title:string,
    category : "Development" | "Design" | "Marketing";
    description:string
    status:  "Pending" | "Completed";
    createdAt?: Date,
    updatedAt?: Date;
}

export interface CreateTaskBody{
    title:string,
    description?: string;
    category: "Development" | "Design" | "Marketing";
}
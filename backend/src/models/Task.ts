import mongoose from "mongoose";
import type { ITask } from "../Types/type.js";

const taskSchema = new mongoose.Schema<ITask>({
    title:{
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: ""
    },
    category: {
        type: String,
        enum: ["Development", "Design", "Marketing"],
        required: true
    },
    status: {
        type: String,
        enum: ["Pending", "Completed"],
        default: "Pending"
    }
},{timestamps:true})

const Task = mongoose.model<ITask>("Task",taskSchema)
export default Task;
import type { Request, Response } from "express";
import Task from "../models/Task.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import type { CreateTaskBody } from "../Types/type.js";
import mongoose from "mongoose";

const validCategories = ["Development", "Design", "Marketing"];

const createTask = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const body: unknown = req.body;

    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      throw new ApiError(400, "Request body must be an object");
    }

    const { title, category, description } = body as Record<string, unknown>;

    if (
      typeof category !== "string" ||
      !validCategories.includes(category.trim())
    ) {
      throw new ApiError(
        400,
        "Category must be a string and must be Development, Design, or Marketing",
      );
    }

    if (typeof title !== "string" || !title.trim()) {
      throw new ApiError(
        400,
        "Title is required and must be a non-empty string",
      );
    }

    if (description !== undefined && typeof description !== "string") {
      throw new ApiError(400, "Description must be a string");
    }


    const normalizedCategory = category.trim();

    const taskData: CreateTaskBody = {
      title: title.trim(),
      category: normalizedCategory as CreateTaskBody["category"],
    };

    if (description !== undefined) {
      taskData.description = description.trim();
    }

    const task = await Task.create(taskData);

    res
      .status(201)
      .json(new ApiResponse(201,"Task Created Successfully",task));
});

const getAllTasks = asyncHandler(async (req: Request, res: Response): Promise<void> => {

    const { status, category } = req.query;

    const filter:Record<string,string> = {};

    if(status) filter.status = status as string;

    if(category) filter.category = category as string;

    const tasks = await Task.find(filter)
    
    res.status(200).json(
        new ApiResponse(200,"All Tasks Fetched Successfully",tasks)
    )
});


const toggleTask = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const {id} = req.params;

    if(!id){
        throw new ApiError(400,"Task ID is required")
    }

    if (!mongoose.isValidObjectId(id)) {
      throw new ApiError(400, "Invalid Task ID");
    }

    const task = await Task.findById(id);

    if(!task){
        throw new ApiError(404, "Task not found");
    }

    task.status = task.status === "Pending" ? "Completed": "Pending";
    task.save()

    res.status(200).json(
        new ApiResponse(200,"Task status updated successfully",task)
    )

});

const deleteTask = asyncHandler(async (req: Request, res: Response): Promise<void> => {

    const {id} = req.params;

    if (!id) {
      throw new ApiError(400, "Task ID is required");
    }

    if (!mongoose.isValidObjectId(id)) {
      throw new ApiError(400, "Invalid Task ID");
    }

    const task = await Task.findByIdAndDelete(id)
    
    if(!task){
        throw new ApiError(404, "Task not found");
    }

    res.status(200).json(
        new ApiResponse(200,"Task successfully deleted from database")
    )
});

const getHealth = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    res.status(200).json(
      new ApiResponse(200, "Server is healthy")
    );
});

const getStats = asyncHandler( async (req: Request, res: Response): Promise<void> => {
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({
      status: "Completed",
    });
    const pendingTasks = await Task.countDocuments({
      status: "Pending",
    });

    const completionPercentage =
      totalTasks === 0
        ? 0
        : Math.round((completedTasks / totalTasks) * 100);

    const stats = {
      totalTasks,
      completedTasks,
      pendingTasks,
      completionPercentage,
    };

    res.status(200).json(
      new ApiResponse(200, "Task statistics fetched successfully", stats)
    );
});

export {
  createTask,
  getAllTasks,
  getTask,
  toggleTask,
  deleteTask,
  getHealth,
  getStats,
};

import type { Request, Response } from "express";
import Task from "../models/Task.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import type { CreateTaskBody } from "../Types/type.js";
import mongoose from "mongoose";

const validCategories = ["Development", "Design", "Marketing"];
const validStatus = ["Pending","Completed"]

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

    const filter: Record<string, string> = {};

    if (status !== undefined && status !== "") {
      
      if (
        typeof status !== "string" ||
        !["Pending", "Completed"].includes(status.trim())
      ) {
        throw new ApiError(
          400,
          "Status must be either Pending or Completed",
        );
      }

      filter.status = status.trim();
    }

    if (category !== undefined && category!=="") {
      if (
        typeof category !== "string" ||
        !["Development", "Design", "Marketing"].includes(category.trim())
      ) {
        throw new ApiError(
          400,
          "Category must be Development, Design, or Marketing",
        );
      }

      filter.category = category.trim();
    }

    const tasks = await Task.find(filter);

    res.status(200).json(
      new ApiResponse(200, "Tasks fetched successfully", tasks),
    );
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
    await task.save()

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
    const databaseConnected = mongoose.connection.readyState === 1;
    const statusCode = databaseConnected ? 200 : 503;
    const message = databaseConnected
      ? "Server and database are healthy"
      : "Database is unavailable";

    res.status(statusCode).json(
      new ApiResponse(statusCode, message, {
        server: "healthy",
        database: databaseConnected ? "connected" : "disconnected",
      }),
    );
});

const getStats = asyncHandler( async (req: Request, res: Response): Promise<void> => {
    const [
      totalTasks,
      completedTasks,
      pendingTasks,
      developmentTasks,
      designTasks,
      marketingTasks,
    ] = await Promise.all([
      Task.countDocuments(),
      Task.countDocuments({ status: "Completed" }),
      Task.countDocuments({ status: "Pending" }),
      Task.countDocuments({ category: "Development" }),
      Task.countDocuments({ category: "Design" }),
      Task.countDocuments({ category: "Marketing" }),
    ]);

    const completionPercentage = totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);

    const stats = {
      totalTasks,
      completedTasks,
      pendingTasks,
      completionPercentage,
      categoryCounts: {
        Development: developmentTasks,
        Design: designTasks,
        Marketing: marketingTasks,
      },
    };

    res.status(200).json(
      new ApiResponse(200, "Task statistics fetched successfully", stats)
    );
});

export {
  createTask,
  getAllTasks,
  toggleTask,
  deleteTask,
  getHealth,
  getStats,
};

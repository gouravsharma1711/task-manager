import express from 'express'
const router = express.Router();
import upload from '../middleware/multer.middleware.js';

import {
    createTask,
    getAllTasks,
    toggleTask,
    deleteTask,
    getHealth,
    getStats
} from '../controllers/task.controller.js'
import app from '../App.js';

router.route("/tasks/create").post(upload.none(),createTask);
router.route("/tasks").get(getAllTasks);
router.route("/tasks/:id/status").patch(toggleTask);
router.route("/tasks/:id").delete(deleteTask);
router.route("/health").get(getHealth);
router.route("/tasks/stats").get(getStats);


const taskRouter = router;
export default taskRouter
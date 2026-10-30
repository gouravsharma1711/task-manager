import express from 'express'
import taskRouter from './routes/tasks.routes.js';
import errorHandler from './middleware/error.middleware.js';
import notFoundHandler from './middleware/notFound.middleware.js';

const app = express();

// middlewares
app.use(express.json())
app.use(express.urlencoded({extended:true}))

// task router
app.use('/api/v1',taskRouter)
app.use(notFoundHandler)
app.use(errorHandler)


export default app;
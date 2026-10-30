import app from './src/App.js' 
import type { EnvConfig } from './src/Types/type.js';
import env from './src/config/config.js'
import connectToDb from './src/db/db.js';
const config:EnvConfig = env;

const PORT = config.PORT;



const startServer = async()=>{
    try {
        await connectToDb();
        app.listen(PORT,async()=>{
            console.log(`Sever is running on http://localhost:${PORT}/ `)
        })
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}

startServer();
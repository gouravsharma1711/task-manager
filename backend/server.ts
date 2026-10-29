import app from './src/App.js' 
import type { EnvConfig } from './src/Types/type.js';
import env from './src/config/config.js'

const config:EnvConfig = env;

const PORT = config.PORT;
app.listen(PORT,()=>{
    console.log(`Sever is running on PORT ${PORT}`)
})
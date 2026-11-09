import dotenv from 'dotenv'; import path from 'node:path'; import {createApp} from './app.js';
dotenv.config({path:path.resolve(process.cwd(),'../.env')}); dotenv.config();
const port=Number(process.env.MOCK_PORT||4001); createApp().listen(port,()=>console.log(`Mock BSE API listening on ${port}`));

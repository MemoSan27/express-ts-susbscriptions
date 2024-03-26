import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { router } from './routes';
import dotenv from 'dotenv';
import dbConnection from './configs/database/mongo.conn';
import { morganMiddleware } from './middlewares/morgan.middleware';

dotenv.config();

const app = express(); 
const env: string = process.env.APP_ENV || 'dev';
const dbConnected = false;

app.use(cors()); 
app.use(helmet()); 
app.use(morgan(env)); 
app.use(express.json());
app.use(morganMiddleware);

dbConnection().then(db => {
    app.locals.db = db;
    app.use('/', router);
}).catch(error => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); 
});

export default app;
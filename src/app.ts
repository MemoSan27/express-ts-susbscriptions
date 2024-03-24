import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import homeRouter from './routes';
import dotenv from 'dotenv';
import dbConnection from './configs/database/mongo.conn';

dotenv.config();

const app = express(); 
const env: string = process.env.APP_ENV || 'dev';

app.use(cors()); 
app.use(helmet()); 
app.use(morgan(env)); 
app.use(express.json());

dbConnection().then(db => {
    app.locals.db = db;
    app.use('/', homeRouter);
}).catch(error => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); 
});

export default app;
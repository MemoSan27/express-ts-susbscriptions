import axios from 'axios';
import dotenv from 'dotenv';
import colors from 'colors';
import { healthFileLogger } from './logger';



dotenv.config();

// Función para ejecutar el Health Check
export async function runHealthCheck(): Promise<void> {
  try {
    const url = `${process.env.APP_URL}:${process.env.APP_PORT}/health`;
    const response = await axios.get(url);
    healthFileLogger.info('Health Check: ' + response.data);
    console.log(colors.bgGreen.bold('Health Status: ' + response.data));
  } catch (error) {
    console.error(colors.bgRed.bold('Health Check failed:' + (error as Error).message));
    healthFileLogger.error('Health Check failed:' + (error as Error).message); 
  }
}


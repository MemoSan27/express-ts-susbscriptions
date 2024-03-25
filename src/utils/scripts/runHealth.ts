import axios from 'axios';
import dotenv from 'dotenv';
import colors from 'colors'

dotenv.config();

// Función para ejecutar el Health Check
export async function runHealthCheck(): Promise<void> {
  try {
    const url = `${process.env.APP_URL}:${process.env.APP_PORT}/health`;
    const response = await axios.get(url);
    console.log(colors.bgGreen.bold('Health Check:' + response.data));
  } catch (error) {
    console.error(colors.bgRed.bold('Health Check failed:' + (error as Error).message)); // Casting error a tipo Error
  }
}


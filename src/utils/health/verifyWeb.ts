import axios, { AxiosError } from 'axios';
import dotenv from 'dotenv';
import colors from 'colors';

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

export const verifyWeb = async (): Promise<void> => {
    const appUrl = process.env.APP_URL || 'http://localhost';
    const appPort = process.env.APP_PORT || '8080';
    const url = `${appUrl}:${appPort}/health`;
    try {
        await axios.get(url);
        console.log(colors.bgGreen.bold(`Route ${url} is working success`));
    } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
            console.error(`Error verifying route ${url}: Status Code: ${axiosError.response.status}`);
        } else if (axiosError.request) {
            console.error(`Error verifying route ${url}: Response timeout`);
        } else {
            console.error(`Error verifying route ${url}:`, axiosError.message);
        }
        throw error;
    }
};
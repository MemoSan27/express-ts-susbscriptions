import app from './app';
import colors from 'colors';

const PORT: number = Number(process.env.APP_PORT) || 8080;

const main = async (): Promise<void> => {
    try {
        app.listen(PORT);
        console.log(colors.bgWhite.bold(`Server starting on port ${PORT}, waiting for database connection...`));
    } catch (error) {
        console.log(error);
    }
}

main();
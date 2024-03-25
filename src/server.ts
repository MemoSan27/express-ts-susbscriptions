import './utils/scripts/cronJob';
import app from './app';
import colors from 'colors';
import { appFileLogger } from './utils/scripts/logger';


const PORT: number = Number(process.env.APP_PORT) || 8080;

const main = async (): Promise<void> => {
    try {
        app.listen(PORT);
        console.log(colors.bgWhite.bold(`Server starting on port ${PORT}, waiting for database connection...`));
        appFileLogger.info(`Server starting on port ${PORT}`);
    } catch (error) {
        console.log(error);
        appFileLogger.error(error);
    }
}

main();


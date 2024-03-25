import morgan from 'morgan';
import { appFileLogger } from '../utils/scripts/logger';

const morganStream = {
  write: (message: string) => {
    appFileLogger.info(message.trim()); // Redirige los registros de Morgan al archivo de registro
  }
};

const morganFormat = ':date[iso] :remote-addr :method :url :status :res[content-length] - :response-time ms';

export const morganMiddleware = morgan(morganFormat, { stream: morganStream });
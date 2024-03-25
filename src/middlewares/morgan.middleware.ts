import morgan from 'morgan';
import { requestFileLogger } from '../utils/scripts/logger';

const morganStream = {
  write: (message: string) => {
    requestFileLogger.info(message.trim()); // Redirige los registros de Morgan al archivo de registro
  }
};

const morganFormat = ':date[iso] :remote-addr :method :url :status :res[content-length] - :response-time ms';

export const morganMiddleware = morgan(morganFormat, { stream: morganStream });
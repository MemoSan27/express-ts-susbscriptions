import cron from 'node-cron';
import { runHealthCheck } from './runHealth';
import colors from 'colors';

cron.schedule('*/10 * * * *', async () => {
  console.log(colors.bgYellow.bold('Running Health Check...'));
  await runHealthCheck();
});
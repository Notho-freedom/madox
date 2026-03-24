import 'dotenv/config';
import { startApiServer } from './app';
import { serverEnv } from './config';

startApiServer();

console.log(
  `[madox-api] listening on http://${serverEnv.apiHost}:${serverEnv.apiPort}`
);

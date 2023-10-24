import { registerAs } from '@nestjs/config';

export default registerAs('swagger', () => ({
  title: 'Swagger API Docs',
  description: 'API Documentation',
  version: 'V1.0',
  envname: 'local',
  url: process.env.APP_URL,
  port: process.env.APP_PORT,
  tag: 'API Docs',
  path: 'api-docs',
}));

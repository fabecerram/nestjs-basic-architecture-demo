import { registerAs } from '@nestjs/config';

export default registerAs('logger', () => ({
  dns: process.env.SENTRY_DNS,
  enable: process.env.SENTRY_ENABLE,
  release: process.env.npm_package_version,
}));

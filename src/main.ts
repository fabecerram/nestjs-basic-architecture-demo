import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { AppConfigService } from './config/app/config.service';
import { LoggerConfigService } from './config/logger/sentryio/config.service';
import { SwaggerConfigModule } from './config/openapi/swagger/config.module';
import { SwaggerConfigService } from './config/openapi/swagger/config.service';
import { KeyVaultConfigService } from './config/secrets/keyvault/config.service';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const appConfig: AppConfigService = app.get(AppConfigService);
  const sentryConfig: LoggerConfigService = app.get(LoggerConfigService);
  const swaggerConfig: SwaggerConfigService = app.get(SwaggerConfigService);
  const keyVaultService: KeyVaultConfigService = app.get(KeyVaultConfigService);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.use(helmet());

  Sentry.init({
    dsn: await keyVaultService.getKeyVaultSecret(sentryConfig.dns),
    enabled: sentryConfig.enable,
    release: sentryConfig.release,
    environment: appConfig.env,
  });

  if (appConfig.env == 'development') {
    const swagger: SwaggerConfigModule = new SwaggerConfigModule(swaggerConfig);
    swagger.setup(app);
  }

  await app.listen(appConfig.port);
}
bootstrap()
  .then(() => {
    console.log('Done');
  })
  .catch(() => new Error('Something fail loading the app'));

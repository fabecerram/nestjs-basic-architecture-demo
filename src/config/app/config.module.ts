import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './configuration';
import { AppConfigService } from './config.service';
import { getEnvironmentPath } from 'src/common/helpers/environment.helper';
import { DEFAULT_PORT, ENVIRONMENT_PATH } from 'src/common/constants/constants';

const envFilePath: string = getEnvironmentPath(ENVIRONMENT_PATH);

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath,
      load: [configuration],
      validationSchema: Joi.object({
        APP_NAME: Joi.string(),
        APP_ENV: Joi.string()
          .valid('development', 'production', 'testing', 'staging')
          .default('development'),
        APP_URL: Joi.string(),
        APP_PORT: Joi.number().default(DEFAULT_PORT),
      }),
    }),
  ],
  providers: [ConfigService, AppConfigService],
  exports: [ConfigService, AppConfigService],
})
export class AppConfigModule {}

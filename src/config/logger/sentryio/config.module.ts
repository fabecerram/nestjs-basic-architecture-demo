import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './configuration';
import { LoggerConfigService } from './config.service';
import { getEnvironmentPath } from 'src/common/helpers/environment.helper';
import { ENVIRONMENT_PATH } from 'src/common/constants/constants';

const envFilePath: string = getEnvironmentPath(ENVIRONMENT_PATH);

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath,
      load: [configuration],
      validationSchema: Joi.object({
        SENTRY_DNS: Joi.string(),
        SENTRY_ENABLE: Joi.boolean().default(false),
      }),
    }),
  ],
  providers: [ConfigService, LoggerConfigService],
  exports: [ConfigService, LoggerConfigService],
})
export class LoggerConfigModule {}

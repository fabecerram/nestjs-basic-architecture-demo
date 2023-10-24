import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './configuration';
import { StorageConfigService } from './config.service';
import { getEnvironmentPath } from 'src/common/helpers/environment.helper';
import { ENVIRONMENT_PATH } from 'src/common/constants/constants';

const envFilePath: string = getEnvironmentPath(ENVIRONMENT_PATH);

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath,
      load: [configuration],
      validationSchema: Joi.object({
        AZURE_STORAGE: Joi.string().required(),
      }),
    }),
  ],
  providers: [ConfigService, StorageConfigService],
  exports: [ConfigService, StorageConfigService],
})
export class StorageConfigModule {}

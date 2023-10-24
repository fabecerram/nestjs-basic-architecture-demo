import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/app/config.module';
import { DBConfigModule } from './config/database/mssqlserver/config.module';
import { MSSqlServerDatabaseProviderModule } from './providers/database/mssqlserver/provider.module';
import { LoggerConfigModule } from './config/logger/sentryio/config.module';
import { SwaggerConfigModule } from './config/openapi/swagger/config.module';
import { HealthController } from './api/health/health.controller';
import { KeyVaultConfigModule } from './config/secrets/keyvault/config.module';

@Module({
  imports: [
    AppConfigModule,
    DBConfigModule,
    MSSqlServerDatabaseProviderModule,
    LoggerConfigModule,
    SwaggerConfigModule,
    KeyVaultConfigModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}

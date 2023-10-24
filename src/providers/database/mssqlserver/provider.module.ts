import { DatabaseType } from 'typeorm';
import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { DBConfigModule } from 'src/config/database/mssqlserver/config.module';
import { DBConfigService } from 'src/config/database/mssqlserver/config.service';
import { KeyVaultConfigService } from 'src/config/secrets/keyvault/config.service';
import { KeyVaultConfigModule } from 'src/config/secrets/keyvault/config.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [DBConfigModule, KeyVaultConfigModule],
      useFactory: async (
        dbConfigService: DBConfigService,
        keyvaultService: KeyVaultConfigService,
        // eslint-disable-next-line @typescript-eslint/require-await
      ) => ({
        type: 'mssql' as DatabaseType,
        host: await keyvaultService.getKeyVaultSecret(dbConfigService.host),
        port: dbConfigService.port,
        username: await keyvaultService.getKeyVaultSecret(dbConfigService.user),
        password: await keyvaultService.getKeyVaultSecret(
          dbConfigService.password,
        ),
        database: await keyvaultService.getKeyVaultSecret(
          dbConfigService.database,
        ),
        autoLoadEntities: true,
        synchronize: false,
      }),
      inject: [DBConfigService, KeyVaultConfigService],
    } as TypeOrmModuleAsyncOptions),
  ],
})
export class MSSqlServerDatabaseProviderModule {}

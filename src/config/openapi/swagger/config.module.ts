import * as Joi from 'joi';
import { INestApplication, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './configuration';
import { SwaggerConfigService } from './config.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        APP_URL: Joi.string(),
      }),
    }),
  ],
  providers: [ConfigService, SwaggerConfigService],
  exports: [ConfigService, SwaggerConfigService],
})
export class SwaggerConfigModule {
  constructor(private readonly configService: SwaggerConfigService) {}

  setup(app: INestApplication): void {
    const url: URL = new URL(this.configService.url);
    url.port = this.configService.port.toString();

    const options = new DocumentBuilder()
      .setTitle(this.configService.title)
      .setDescription(this.configService.description)
      .setVersion(this.configService.version)
      .addServer(url.href, this.configService.name)
      .addTag(this.configService.tag)
      .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup(this.configService.path, app, document);
  }
}

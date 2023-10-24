import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DEFAULT_PORT } from 'src/common/constants/constants';

@Injectable()
export class SwaggerConfigService {
  constructor(private configService: ConfigService) {}

  get title(): string {
    return this.configService.get<string>('swagger.title') ?? '';
  }
  get description(): string {
    return this.configService.get<string>('swagger.description') ?? '';
  }
  get version(): string {
    return this.configService.get<string>('swagger.version') ?? '';
  }
  get name(): string {
    return this.configService.get<string>('swagger.envname') ?? '';
  }
  get url(): string {
    return this.configService.get<string>('swagger.url') ?? '';
  }
  get port(): number {
    return this.configService.get<number>('swagger.port') ?? DEFAULT_PORT;
  }
  get tag(): string {
    return this.configService.get<string>('swagger.tag') ?? '';
  }
  get path(): string {
    return this.configService.get<string>('swagger.path') ?? '';
  }
}

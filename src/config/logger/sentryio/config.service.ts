import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LoggerConfigService {
  constructor(private configService: ConfigService) {}

  get dns(): string {
    return this.configService.get<string>('logger.dns') ?? '';
  }

  get enable(): boolean {
    return this.configService.get<boolean>('logger.enable') ?? false;
  }

  get release(): string {
    return this.configService.get<string>('logger.release') ?? '';
  }
}

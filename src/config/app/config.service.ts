import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get name(): string {
    return this.configService.get<string>('app.name', { infer: true }) ?? '';
  }
  get env(): string {
    return this.configService.get<string>('app.env', { infer: true }) ?? '';
  }
  get url(): string {
    return this.configService.get<string>('app.url', { infer: true }) ?? '';
  }
  get port(): number {
    return Number(this.configService.get<number>('app.port'));
  }
}

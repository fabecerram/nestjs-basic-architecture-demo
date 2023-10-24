import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StorageConfigService {
  constructor(private configService: ConfigService) {}

  get connectionString(): string {
    return this.configService.get<string>('storage.connectionString') ?? '';
  }
}

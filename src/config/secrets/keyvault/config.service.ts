import { DefaultAzureCredential } from '@azure/identity';
import { SecretClient } from '@azure/keyvault-secrets';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KeyVaultConfigService {
  private secretCache: Map<string, string>;
  private credential: DefaultAzureCredential;
  private client: SecretClient;

  constructor(private configService: ConfigService) {
    this.secretCache = new Map<string, string>();

    this.credential = new DefaultAzureCredential();
    this.client = new SecretClient(
      this.configService.get<string>('keyvault.keyVaultUrl') ?? '',
      this.credential,
    );
  }

  get keyVaultUrl(): string {
    return this.configService.get<string>('keyvault.keyVaultUrl') ?? '';
  }

  async getKeyVaultSecret(secretKey: string): Promise<string> {
    if (this.secretCache.has(secretKey)) {
      const secretFromCache = this.secretCache.get(secretKey) ?? '';
      return Promise.resolve(secretFromCache);
    }

    try {
      const secret = await this.client.getSecret(secretKey);
      const secretFromKeyvault = secret.value ?? '';

      if (secretFromKeyvault.length === 0) {
        throw new Error("Key doesn't exist");
      }

      this.secretCache.set(secretKey, secretFromKeyvault);

      return Promise.resolve(secretFromKeyvault);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

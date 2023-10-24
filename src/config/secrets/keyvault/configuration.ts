import { registerAs } from '@nestjs/config';

export default registerAs('keyvault', () => ({
  keyVaultUrl: process.env.KEYVAULT_URL,
}));

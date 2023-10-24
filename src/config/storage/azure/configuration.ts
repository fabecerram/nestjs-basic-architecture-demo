import { registerAs } from '@nestjs/config';

export default registerAs('storage', () => ({
  connectionString: process.env.AZURE_STORAGE,
}));

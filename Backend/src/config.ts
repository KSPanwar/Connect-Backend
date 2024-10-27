import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env file located in the root of the project
config({ path: resolve(__dirname, '../.env') });

import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';

// Resolve relative to this file so startup does not depend on the working directory.
dotenv.config({ path: fileURLToPath(new URL('../.env', import.meta.url)), quiet: true });

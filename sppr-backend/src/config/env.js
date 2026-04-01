import dotenv from 'dotenv';
import Ajv from 'ajv';

dotenv.config();

const ajv = new Ajv({ allErrors: true, useDefaults: true });

const envSchema = {
  type: 'object',
  properties: {
    PORT: { type: 'string', default: '3000' },
    DB_HOST: { type: 'string', default: 'localhost' },
    DB_PORT: { type: 'string', default: '3306' },
    DB_USER: { type: 'string' },
    DB_PASSWORD: { type: 'string' },
    DB_NAME: { type: 'string' },
  },
  required: ['DB_USER', 'DB_PASSWORD', 'DB_NAME'],
  additionalProperties: true,
};

const validate = ajv.compile(envSchema);
const isValid = validate(process.env);

if (!isValid) {
  console.error('Error validating environment variables:', validate.errors);
  process.exit(1);
}

export const config = {
  port: parseInt(process.env.PORT, 10),
  db: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
};

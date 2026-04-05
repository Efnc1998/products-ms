import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  DATABASE_URL: string;
  KAFKA_BROKERS: string;
}

const envVarsSchema = joi
  .object<EnvVars>({
    PORT: joi.number().required(),
    DATABASE_URL: joi.string().required(),
    KAFKA_BROKERS: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envVarsSchema.validate(process.env);

if (error) throw new Error(`Config validation error: ${error.message}`);

const envVars: EnvVars = value;

export const envs = {
  /** The port number the microservice will listen on */
  port: envVars.PORT,
  /** The connection string for the database */
  dataBaseUrl: envVars.DATABASE_URL,
  /** Kafka broker addresses */
  kafkaBrokers: envVars.KAFKA_BROKERS.split(','),
};

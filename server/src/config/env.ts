import 'dotenv/config'
import Joi from 'joi'

const schema = Joi.object({
  PORT: Joi.number().default(3000),
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  MONGODB_URI: Joi.string().required(),
  JWT_SECRET: Joi.string().min(16).required(),
  JWT_EXPIRES_IN: Joi.string().default('7d'),
  CORS_ORIGIN: Joi.string().default('http://localhost:5173')
}).unknown(true)

const { error, value } = schema.validate(process.env)

if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}

export const env = {
  port: value.PORT as number,
  nodeEnv: value.NODE_ENV as string,
  mongoUri: value.MONGODB_URI as string,
  jwtSecret: value.JWT_SECRET as string,
  jwtExpiresIn: value.JWT_EXPIRES_IN as string,
  corsOrigin: value.CORS_ORIGIN as string,
  isDev: value.NODE_ENV === 'development'
}

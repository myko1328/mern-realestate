import dotenv from "dotenv";
dotenv.config();

export const env = {
  JWT_SECRET: String(process.env.JWT_SECRET),
  MONGO_URI: String(process.env.MONGO_URI),
  MONGO_URI_TEST: String(process.env.MONGO_URI_TEST),
  NODE_ENV: String(process.env.NODE_ENV),
};

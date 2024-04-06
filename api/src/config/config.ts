import dotenv from "dotenv";
dotenv.config();

export const env = {
  JWT_SECRET: String(process.env.JWT_SECRET),
};

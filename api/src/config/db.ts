import mongoose from "mongoose";
import { env } from "./config";

class Database {
  constructor(private mongoURI: string) {
    this.mongoURI =
      process.env.NODE_ENV === "test" ? env.MONGO_URI_TEST : env.MONGO_URI;
  }

  // Connect to the MongoDB database
  async connect(): Promise<void> {
    try {
      await mongoose.connect(this.mongoURI);
      console.log(
        `DB connected ${process.env.NODE_ENV === "test" ? "test" : "dev"} `
      );
    } catch (err) {
      console.error("Error connecting to database: ", err);
    }
  }

  // Close the database connection
  async close(): Promise<void> {
    try {
      await mongoose.connection.close();
      console.log("Database connection closed");
    } catch (err) {
      console.error("Error closing database connection: ", err);
    }
  }
}

export const db = new Database(env.MONGO_URI);

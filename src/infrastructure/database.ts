import { DataSource } from "typeorm";
import { Post } from "@/src/adapters/models/Post";
import { Comment } from "@/src/adapters/models/Comment";
import { Like } from "@/src/adapters/models/Like";
import { Bookmark } from "@/src/adapters/models/Bookmark";
import { User } from "@/src/adapters/models/User";
import { config } from "@/src/config";
import { Logger } from "@/src/shared/logger";

export const AppDataSource = new DataSource(config.postgresDb.databaseUrl ? {
  type: "postgres",
  url: config.postgresDb.databaseUrl,
  ssl: config.postgresDb.dbSsl ? { rejectUnauthorized: false } : false,
  synchronize: true,
  logging: ["error", "warn"],
  entities: [Post, Comment, Like, Bookmark, User],
} : {
  type: "postgres",
  host: config.postgresDb.dbHost,
  port: config.postgresDb.dbPort,
  username: config.postgresDb.dbUser,
  password: config.postgresDb.dbPassword,
  database: config.postgresDb.dbName,
  ssl: config.postgresDb.dbSsl ? { rejectUnauthorized: false } : false,
  synchronize: true,
  logging: ["error", "warn"],
  entities: [Post, Comment, Like, Bookmark, User],
});

export async function initializeDataSource() {
  try {
    if (!AppDataSource.isInitialized) {
      Logger.info(`Attempting to connect to Database...`);
      await AppDataSource.initialize();
      Logger.info(`✅ Database connection established`);
    }
  } catch (error) {
    Logger.error(`❌ Failed to initialize database connection: ${error}`);
    throw error;
  }
}

import dotenv from "dotenv";

dotenv.config();

export const config = {
  serverPort: parseInt(process.env.PORT || "5000", 10),
  jwtSecret: process.env.JWT_SECRET || "your-secret-key",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  postgresDb: {
    databaseUrl: process.env.DATABASE_URL,
    dbHost: process.env.DB_HOST || "localhost",
    dbPort: parseInt(process.env.DB_PORT || "5432", 10),
    dbUser: process.env.DB_USER || "postgres",
    dbPassword: process.env.DB_PASSWORD || "postgres",
    dbName: process.env.DB_NAME || "canvasblog",
    dbSsl: process.env.DB_SSL === "true",
  }
};

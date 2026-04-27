import "reflect-metadata";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { config } from "@/src/config";
import { Logger } from "@/src/shared/logger";
import { AppDataSource, initializeDataSource } from "@/src/infrastructure/database";
import routes from "./routes";

const app = express();

// Middlewares
app.use(helmet());
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Initialize Server
const start = async () => {
    try {
        await initializeDataSource();
        await routes(app, AppDataSource);

        app.listen(config.serverPort, () => {
            Logger.info(`🚀 Server running on http://localhost:${config.serverPort}`);
        });
    } catch (error) {
        Logger.error(`Failed to start server: ${error}`);
        process.exit(1);
    }
};

start();

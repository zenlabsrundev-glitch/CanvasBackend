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
    origin: true, // Allow all for now to help with Vercel testing, or add your Vercel frontend URL
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

let initialized = false;

// Vercel friendly initialization middleware
app.use(async (req, res, next) => {
    if (!initialized) {
        try {
            await initializeDataSource();
            await routes(app, AppDataSource);
            initialized = true;
        } catch (error) {
            return next(error);
        }
    }
    next();
});

// Local development server
if (process.env.NODE_ENV !== "production") {
    const startLocal = async () => {
        try {
            await initializeDataSource();
            await routes(app, AppDataSource);
            initialized = true;
            app.listen(config.serverPort, () => {
                Logger.info(`🚀 Local server running on http://localhost:${config.serverPort}`);
            });
        } catch (error) {
            Logger.error(`Failed to start local server: ${error}`);
        }
    };
    startLocal();
}

export default app;

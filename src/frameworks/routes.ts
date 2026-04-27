import { Application, Request, Response } from "express";
import { DataSource } from "typeorm";
import { PostController } from "../adapters/controllers/PostController";
import { CommentController } from "../adapters/controllers/CommentController";
import { AuthController } from "../adapters/controllers/AuthController";
import { InteractionController } from "../adapters/controllers/InteractionController";
import { PostRepository } from "../infrastructure/services/PostRepository";
import { CommentRepository } from "../infrastructure/services/CommentRepository";
import { UserRepository } from "../infrastructure/services/UserRepository";

export default async (app: Application, dataSource: DataSource) => {
    // Initialize Repositories
    const postRepository = new PostRepository();
    const commentRepository = new CommentRepository();
    const userRepository = new UserRepository();

    // Initialize Controllers
    const postController = new PostController(postRepository);
    const commentController = new CommentController(commentRepository);
    const authController = new AuthController(userRepository);
    const interactionController = new InteractionController(postRepository);

    // Health check
    app.get("/health", (_req: Request, res: Response) => res.json({ status: "ok" }));

    // Routes
    app.use("/api/auth", authController.router);
    app.use("/api/posts", postController.router);
    app.use("/api/comments", commentController.router);
    app.use("/api/interactions", interactionController.router);

    // Handle 404
    app.use((_req: Request, res: Response) => {
        res.status(404).json({ error: "Route not found" });
    });
};

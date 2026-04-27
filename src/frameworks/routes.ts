import { Express } from "express";
import { DataSource } from "typeorm";
import { PostController } from "@/src/adapters/controllers/PostController";
import { CommentController } from "@/src/adapters/controllers/CommentController";
import { AuthController } from "@/src/adapters/controllers/AuthController";
import { InteractionController } from "@/src/adapters/controllers/InteractionController";
import { PostRepository } from "@/src/infrastructure/services/PostRepository";
import { CommentRepository } from "@/src/infrastructure/services/CommentRepository";
import { UserRepository } from "@/src/infrastructure/services/UserRepository";

export default async (app: Express, dataSource: DataSource) => {
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
    app.get("/health", (_req, res) => res.json({ status: "ok" }));

    // Routes
    app.use("/api/auth", authController.router);
    app.use("/api/posts", postController.router);
    app.use("/api/comments", commentController.router);
    app.use("/api/interactions", interactionController.router);

    // Handle 404
    app.use((_req, res) => {
        res.status(404).json({ error: "Route not found" });
    });
};

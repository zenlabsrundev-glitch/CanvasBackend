import { Request, Response, Router } from "express";
import Joi from "joi";
import { PostRepository } from "@/src/infrastructure/services/PostRepository";
import CreatePostUsecase from "@/src/application/usecases/post/createPost";
import GetAllPostsUsecase from "@/src/application/usecases/post/getAllPosts";
import GetPostBySlugUsecase from "@/src/application/usecases/post/getPostBySlug";
import UpdatePostUsecase from "@/src/application/usecases/post/updatePost";
import DeletePostUsecase from "@/src/application/usecases/post/deletePost";
import { authenticate, authorize } from "@/src/frameworks/middleware/auth";
import { validate } from "@/src/frameworks/middleware/validator";
import { Logger } from "@/src/shared/logger";

const postSchema = Joi.object({
    title: Joi.string().required(),
    slug: Joi.string().required(),
    content: Joi.string().required(),
    excerpt: Joi.string().allow('', null),
    coverColor: Joi.string().allow('', null),
    tags: Joi.array().items(Joi.string()).optional(),
    published: Joi.boolean().optional()
});

export class PostController {
    public router: Router = Router();

    constructor(private postRepository: PostRepository) {
        this.router.post("/", authenticate, authorize(['admin']), validate(postSchema), this.createHandler.bind(this));
        this.router.get("/", this.getAllHandler.bind(this));
        this.router.get("/:slug", this.getBySlugHandler.bind(this));
        this.router.put("/:id", authenticate, authorize(['admin']), validate(postSchema.fork(Object.keys(postSchema.describe().keys), (schema) => schema.optional())), this.updateHandler.bind(this));
        this.router.delete("/:id", authenticate, authorize(['admin']), this.deleteHandler.bind(this));
    }

    async createHandler(req: Request, res: Response) {
        Logger.info(`📝 Creating new post with slug: [${req.body.slug}]`);
        const usecase = new CreatePostUsecase(this.postRepository);
        const result = await usecase.exec(req.body);
        if (typeof result === "string") {
            return res.status(400).json({ error: result });
        }
        return res.status(201).json(result);
    }

    async getAllHandler(req: Request, res: Response) {
        const publishedOnly = req.query.published === 'true';
        const usecase = new GetAllPostsUsecase(this.postRepository);
        const result = await usecase.exec(publishedOnly);
        return res.status(200).json(result);
    }

    async getBySlugHandler(req: Request, res: Response) {
        const slug = req.params.slug as string;
        Logger.info(`🔍 Fetching post with slug: [${slug}]`);
        
        const usecase = new GetPostBySlugUsecase(this.postRepository);
        const result = await usecase.exec(slug);
        if (typeof result === "string") {
            return res.status(404).json({ error: result });
        }
        return res.status(200).json(result);
    }

    async updateHandler(req: Request, res: Response) {
        const usecase = new UpdatePostUsecase(this.postRepository);
        const result = await usecase.exec(req.params.id as string, req.body);
        if (typeof result === "string") {
            return res.status(400).json({ error: result });
        }
        return res.status(200).json(result);
    }

    async deleteHandler(req: Request, res: Response) {
        const usecase = new DeletePostUsecase(this.postRepository);
        const result = await usecase.exec(req.params.id as string);
        if (typeof result === "string") {
            return res.status(400).json({ error: result });
        }
        return res.status(204).send();
    }
}

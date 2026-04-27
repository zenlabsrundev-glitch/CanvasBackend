import { Request, Response, Router } from "express";
import { CommentRepository } from "../../infrastructure/services/CommentRepository";
import AddCommentUsecase from "../../application/usecases/comment/addComment";
import GetCommentsUsecase from "../../application/usecases/comment/getComments";

export class CommentController {
    public router: Router = Router();

    constructor(private commentRepository: CommentRepository) {
        this.router.post("/:postId", this.addHandler.bind(this));
        this.router.get("/:postId", this.getAllHandler.bind(this));
    }

    async addHandler(req: Request, res: Response) {
        const usecase = new AddCommentUsecase(this.commentRepository);
        const result = await usecase.exec(req.params.postId as string, req.body);
        if (typeof result === "string") {
            return res.status(400).json({ error: result });
        }
        return res.status(201).json(result);
    }

    async getAllHandler(req: Request, res: Response) {
        const usecase = new GetCommentsUsecase(this.commentRepository);
        const result = await usecase.exec(req.params.postId as string);
        return res.status(200).json(result);
    }
}

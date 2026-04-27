import { Request, Response, Router } from "express";
import { PostRepository } from "@/src/infrastructure/services/PostRepository";
import { authenticate, AuthRequest } from "@/src/frameworks/middleware/auth";
import { AppDataSource } from "@/src/infrastructure/database";
import { Like } from "@/src/adapters/models/Like";
import { Bookmark } from "@/src/adapters/models/Bookmark";
import { Logger } from "@/src/shared/logger";

export class InteractionController {
    public router: Router = Router();

    constructor(private postRepository: PostRepository) {
        this.router.post("/like/:postId", authenticate, this.toggleLikeHandler.bind(this));
        this.router.post("/bookmark/:postId", authenticate, this.toggleBookmarkHandler.bind(this));
        this.router.get("/bookmarks", authenticate, this.getBookmarksHandler.bind(this));
    }

    async toggleLikeHandler(req: AuthRequest, res: Response) {
        const postId = req.params.postId as string;
        const userId = req.user!.id;

        const post = await this.postRepository.findById(postId);
        if (!post) return res.status(404).json({ error: "Post not found" });

        const likeRepository = AppDataSource.getRepository(Like);
        const existingLike = await likeRepository.findOne({ where: { postId, userId } });

        if (existingLike) {
            await likeRepository.remove(existingLike);
            post.likesCount = Math.max(0, post.likesCount - 1);
            await this.postRepository.update(postId, { likesCount: post.likesCount });
            return res.status(200).json({ message: "Like removed", liked: false });
        } else {
            const newLike = likeRepository.create({ postId, userId });
            await likeRepository.save(newLike);
            post.likesCount++;
            await this.postRepository.update(postId, { likesCount: post.likesCount });
            return res.status(201).json({ message: "Like added", liked: true });
        }
    }

    async toggleBookmarkHandler(req: AuthRequest, res: Response) {
        const postId = req.params.postId as string;
        const userId = req.user!.id;

        const post = await this.postRepository.findById(postId);
        if (!post) return res.status(404).json({ error: "Post not found" });

        const bookmarkRepository = AppDataSource.getRepository(Bookmark);
        const existingBookmark = await bookmarkRepository.findOne({ where: { postId, userId } });

        if (existingBookmark) {
            await bookmarkRepository.remove(existingBookmark);
            return res.status(200).json({ message: "Bookmark removed", bookmarked: false });
        } else {
            const newBookmark = bookmarkRepository.create({ postId, userId });
            await bookmarkRepository.save(newBookmark);
            return res.status(201).json({ message: "Bookmark added", bookmarked: true });
        }
    }

    async getBookmarksHandler(req: AuthRequest, res: Response) {
        const userId = req.user!.id;
        const bookmarkRepository = AppDataSource.getRepository(Bookmark);
        
        // Find all bookmarks for this user and include the Post relation
        const bookmarks = await bookmarkRepository.find({
            where: { userId },
            relations: ["post"]
        });

        // Return just the list of Post objects
        const posts = bookmarks.map(b => b.post);
        return res.status(200).json(posts);
    }
}


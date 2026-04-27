import { AppDataSource } from "../database";
import { Comment } from "@/src/adapters/models/Comment";
import { Post } from "@/src/adapters/models/Post";

export class CommentRepository {
    private repository = AppDataSource.getRepository(Comment);
    private postRepository = AppDataSource.getRepository(Post);

    async create(postId: string, commentData: Partial<Comment>): Promise<Comment> {
        const post = await this.postRepository.findOneBy({ id: postId });
        if (!post) throw new Error("Post not found");

        const comment = this.repository.create({
            ...commentData,
            post: post
        });
        
        const savedComment = await this.repository.save(comment);
        
        // Increment commentsCount in post
        await this.postRepository.increment({ id: postId }, 'commentsCount', 1);
        
        return savedComment;
    }

    async findByPostId(postId: string): Promise<Comment[]> {
        return await this.repository.find({
            where: { post: { id: postId } },
            order: { createdAt: 'DESC' }
        });
    }
}

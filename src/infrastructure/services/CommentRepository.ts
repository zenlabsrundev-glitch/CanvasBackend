import { AppDataSource } from "../database";
import { Comment } from "../../adapters/models/Comment";
import { Post } from "../../adapters/models/Post";

export class CommentRepository {
    private repository = AppDataSource.getRepository(Comment);

    async create(postId: string, commentData: Partial<Comment>): Promise<Comment> {
        const comment = this.repository.create({
            ...commentData,
            post: { id: postId } as Post
        });
        return await this.repository.save(comment);
    }

    async findByPost(postId: string): Promise<Comment[]> {
        return await this.repository.find({
            where: { post: { id: postId } },
            order: { createdAt: 'DESC' }
        });
    }
}

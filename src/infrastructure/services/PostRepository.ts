import { AppDataSource } from "../database";
import { Post } from "@/src/adapters/models/Post";

export class PostRepository {
    private repository = AppDataSource.getRepository(Post);

    async create(postData: Partial<Post>): Promise<Post> {
        const post = this.repository.create(postData);
        return await this.repository.save(post);
    }

    async update(id: string, postData: Partial<Post>): Promise<Post> {
        await this.repository.update(id, postData);
        const updated = await this.repository.findOneBy({ id });
        if (!updated) throw new Error("Post not found");
        return updated;
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }

    async findById(id: string): Promise<Post | null> {
        return await this.repository.findOneBy({ id });
    }

    async findBySlug(slug: string): Promise<Post | null> {
        return await this.repository.findOne({ 
            where: { slug },
            relations: ['comments']
        });
    }

    async findAll(publishedOnly = false): Promise<Post[]> {
        return await this.repository.find({
            where: publishedOnly ? { published: true } : {},
            order: { createdAt: 'DESC' }
        });
    }

    async incrementLikes(id: string): Promise<void> {
        await this.repository.increment({ id }, 'likesCount', 1);
    }
}

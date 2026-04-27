import { AppDataSource } from "../database";
import { Post } from "../../adapters/models/Post";

export class PostRepository {
    private repository = AppDataSource.getRepository(Post);

    async create(postData: Partial<Post>): Promise<Post> {
        const post = this.repository.create(postData);
        return await this.repository.save(post);
    }

    async findAll(publishedOnly: boolean = false): Promise<Post[]> {
        const where = publishedOnly ? { published: true } : {};
        return await this.repository.find({ 
            where,
            order: { createdAt: 'DESC' }
        });
    }

    async findById(id: string): Promise<Post | null> {
        return await this.repository.findOne({ 
            where: { id },
            relations: ['comments']
        });
    }

    async findBySlug(slug: string): Promise<Post | null> {
        return await this.repository.findOne({ 
            where: { slug },
            relations: ['comments']
        });
    }

    async update(id: string, postData: Partial<Post>): Promise<Post | null> {
        await this.repository.update(id, postData);
        return this.findById(id);
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.repository.delete(id);
        return result.affected !== 0;
    }
}

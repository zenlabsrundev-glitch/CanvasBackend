import { Post } from "@/src/adapters/models/Post";
import { PostRepository } from "@/src/infrastructure/services/PostRepository";

export default class GetPostBySlugUsecase {
    constructor(private postRepository: PostRepository) {}

    async exec(slug: string): Promise<Post | null | string> {
        const post = await this.postRepository.findBySlug(slug);
        if (!post) return "Post not found";
        return post;
    }
}

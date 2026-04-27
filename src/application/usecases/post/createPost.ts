import { Post } from "@/src/adapters/models/Post";
import { PostRepository } from "@/src/infrastructure/services/PostRepository";

export default class CreatePostUsecase {
    constructor(private postRepository: PostRepository) {}

    async exec(postData: Partial<Post>): Promise<Post | string> {
        if (!postData.title || !postData.content || !postData.slug) {
            return "Title, content and slug are required";
        }
        try {
            return await this.postRepository.create(postData);
        } catch (error: any) {
            return error.message;
        }
    }
}

import { Post } from "../../../adapters/models/Post";
import { PostRepository } from "../../../infrastructure/services/PostRepository";

export default class UpdatePostUsecase {
    constructor(private postRepository: PostRepository) {}

    async exec(id: string, postData: Partial<Post>): Promise<Post | string> {
        const post = await this.postRepository.update(id, postData);
        if (!post) return "Post not found";
        return post;
    }
}

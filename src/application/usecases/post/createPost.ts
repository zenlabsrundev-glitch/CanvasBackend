import { Post } from "../../../adapters/models/Post";
import { PostRepository } from "../../../infrastructure/services/PostRepository";

export default class CreatePostUsecase {
    constructor(private postRepository: PostRepository) {}

    async exec(postData: Partial<Post>): Promise<Post | string> {
        if (!postData.title || !postData.slug) {
            return "Title and slug are required";
        }
        return await this.postRepository.create(postData);
    }
}

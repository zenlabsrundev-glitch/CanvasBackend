import { Post } from "@/src/adapters/models/Post";
import { PostRepository } from "@/src/infrastructure/services/PostRepository";

export default class GetAllPostsUsecase {
    constructor(private postRepository: PostRepository) {}

    async exec(publishedOnly = false): Promise<Post[]> {
        return await this.postRepository.findAll(publishedOnly);
    }
}

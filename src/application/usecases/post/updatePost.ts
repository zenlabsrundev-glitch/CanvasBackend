import { Post } from "@/src/adapters/models/Post";
import { PostRepository } from "@/src/infrastructure/services/PostRepository";

export default class UpdatePostUsecase {
    constructor(private postRepository: PostRepository) {}

    async exec(id: string, postData: Partial<Post>): Promise<Post | string> {
        try {
            return await this.postRepository.update(id, postData);
        } catch (error: any) {
            return error.message;
        }
    }
}

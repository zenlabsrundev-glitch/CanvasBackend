import { PostRepository } from "@/src/infrastructure/services/PostRepository";

export default class DeletePostUsecase {
    constructor(private postRepository: PostRepository) {}

    async exec(id: string): Promise<void | string> {
        try {
            await this.postRepository.delete(id);
        } catch (error: any) {
            return error.message;
        }
    }
}

import { CommentRepository } from "@/src/infrastructure/services/CommentRepository";

export default class GetCommentsUsecase {
    constructor(private commentRepository: CommentRepository) {}

    async exec(postId: string) {
        return await this.commentRepository.findByPostId(postId);
    }
}

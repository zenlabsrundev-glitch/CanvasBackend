import { CommentRepository } from "../../../infrastructure/services/CommentRepository";

export default class GetCommentsUsecase {
    constructor(private commentRepository: CommentRepository) {}

    async exec(postId: string) {
        return await this.commentRepository.findByPost(postId);
    }
}

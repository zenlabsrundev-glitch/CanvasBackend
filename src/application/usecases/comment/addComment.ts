import { CommentRepository } from "@/src/infrastructure/services/CommentRepository";

export default class AddCommentUsecase {
    constructor(private commentRepository: CommentRepository) {}

    async exec(postId: string, commentData: { authorName: string, content: string }) {
        if (!commentData.authorName || !commentData.content) {
            return "Author name and content are required";
        }
        try {
            return await this.commentRepository.create(postId, commentData);
        } catch (error: any) {
            return error.message;
        }
    }
}

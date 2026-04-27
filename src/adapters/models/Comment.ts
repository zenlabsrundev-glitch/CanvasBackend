import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Post } from './Post';

@Entity('comments')
export class Comment {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    authorName!: string;

    @Column({ type: 'text' })
    content!: string;

    @ManyToOne(() => Post, (post) => post.comments, { onDelete: 'CASCADE' })
    post!: Post;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt!: Date;
}

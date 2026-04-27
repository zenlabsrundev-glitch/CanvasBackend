import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Post } from './Post';

@Entity('bookmarks')
export class Bookmark {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    userId!: string;

    @Column()
    postId!: string;

    @ManyToOne(() => Post, (post) => post.bookmarks, { onDelete: 'CASCADE' })
    post!: Post;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt!: Date;
}

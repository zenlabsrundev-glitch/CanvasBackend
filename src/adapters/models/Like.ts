import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Post } from './Post';

@Entity('likes')
export class Like {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    userId!: string; // Using string for now, could be relation to User

    @Column()
    postId!: string;

    @ManyToOne(() => Post, (post) => post.likes, { onDelete: 'CASCADE' })
    post!: Post;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt!: Date;
}

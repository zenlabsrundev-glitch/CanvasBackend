import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Comment } from './Comment';
import { Like } from './Like';
import { Bookmark } from './Bookmark';

@Entity('posts')
export class Post {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    title!: string;

    @Column({ unique: true })
    slug!: string;

    @Column({ type: 'text', nullable: true })
    excerpt!: string;

    @Column({ type: 'text' })
    content!: string;

    @Column({ nullable: true })
    coverColor!: string;

    @Column({ type: 'text', array: true, default: '{}' })
    tags!: string[];

    @Column({ default: false })
    published!: boolean;

    @Column({ default: 0 })
    likesCount!: number;

    @Column({ default: 0 })
    commentsCount!: number;

    @OneToMany(() => Comment, (comment) => comment.post)
    comments!: Comment[];

    @OneToMany(() => Like, (like) => like.post)
    likes!: Like[];

    @OneToMany(() => Bookmark, (bookmark) => bookmark.post)
    bookmarks!: Bookmark[];

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updatedAt!: Date;
}

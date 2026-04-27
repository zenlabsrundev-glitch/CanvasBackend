import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ default: "" })
    name!: string;

    @Column({ unique: true })
    email!: string;

    @Column()
    password!: string;

    @Column({ default: 'user' })
    role!: 'admin' | 'user';

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updatedAt!: Date;
}

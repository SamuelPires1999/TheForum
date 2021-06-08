import {  Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class Post{
  @PrimaryGeneratedColumn()
  id!: number

  @ManyToOne(() => User, user => user.posts, {onDelete: 'CASCADE'})
  creator:User

  @Column()
  content!: string

  @Column({default: 0})
  likes: number

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Post } from "./Post";

@Entity()
export class User{
  
  @PrimaryGeneratedColumn()
  id!: number

  @Column({unique: true})
  name!: string

  @Column()
  password!: string

  @OneToMany(() => Post, post => post.creator)
  posts: Post[]

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

}
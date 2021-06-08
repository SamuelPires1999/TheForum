import { Request , Response } from 'express'
import {Post} from '../models/Post'
import {User} from '../models/User'
import { getRepository } from 'typeorm';

export class PostService {
  async makePost(req: Request, res:Response) {
    const postRepo = getRepository(Post)
    const userRepo = getRepository(User)
 
    try {
      const {content} = req.body.data
      const loggedUser = await userRepo.findOne(req.session.userId)
      
      if(!loggedUser){
        return res.status(404).json({
          message : "Session Error, invalid token"
        })
      }

      let newPost = new Post()
      newPost.content = content
      newPost.creator = loggedUser

      const savedPost = await postRepo.save(newPost)

      return res.status(200).json({
        savedPost,
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message: "internal server eror"
      })
    }
  }

  async getAllPosts(_:Request, res:Response){
    try {
      const postRepo = getRepository(Post)
      const posts = await postRepo.findAndCount({relations: ["creator"]})

      return res.json({posts})
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message: "internal server error"
      })
    }
  }
}
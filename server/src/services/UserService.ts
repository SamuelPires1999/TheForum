import {Request, Response} from 'express'
import {User} from '../models/User'
import { getRepository } from 'typeorm'

export class UserService {
  
  async me(req: Request, res: Response){
    const userRepo = getRepository(User)
    const userData = await userRepo.findOne(req.session.userId)

    if(!userData){
      return res.status(404).json({
        message: "User not found..."
      })
    }

    return res.status(200).json({
      userData
    })
    
  }

  async update(req:Request, res:Response){
    try {
      const { name } = req.body.data
      const userRepo = getRepository(User)
      await userRepo.update({id: req.session.userId}, {name})

      return res.status(200).json({
        message:"Username modified",
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message: "internal server eror"
      })
    }
  }

  async logout(req: Request, res: Response){
    req.session.destroy(() => {
      res.clearCookie('qid')
      return res.status(200).json({
        message :"logged out"
      })
    })
  }

}
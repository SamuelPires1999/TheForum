import { Request, Response } from 'express';
import {User} from '../models/User'
import argon2 from 'argon2'
import { getRepository } from 'typeorm';

export class AuthService {
  async registerUser(req: Request, res: Response) {
    // console.log(req)
    // return res.json({
    //   message:"here"
    // })
    const {password, name} = await req.body.data
    const userRepo =  getRepository(User)
    const foundUser = await userRepo.findOne({where:{name}})

    if(foundUser){
      console.log(foundUser)
      return res.status(409).json({
        error: "User with this name already exists"
      })
    }

    try {
      const hashedPassword = await argon2.hash(password)
      let user = new User()
      user.name = name
      user.password = hashedPassword

      const savedUser = await userRepo.save(user)
      return res.json({newUser: {savedUser}})

    } catch (error) {
      console.log(error)
      return res.status(500).json({
        error: "Internal server error"
      })
    }
  }

  async loginUser(req: Request , res: Response) {
    const {password, name} = req.body.data
    const userRepo =  getRepository(User)
    const foundUser = await userRepo.findOne({where:{name}})
    const validPassword = foundUser ?  await argon2.verify(foundUser.password , password) : false

    if(!foundUser || !validPassword) {
      console.log(foundUser)
      console.log(validPassword)
      return res.status(404).json({
        error: "Credential error"
      })
    }

    // TODO -> Find a way to save the user's id at the session storage
    req.session.userId = foundUser.id
    // the above still doesnt work

    return res.json({
      message: "login successful",
      userData: foundUser
    })

  }
}
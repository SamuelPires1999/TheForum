import { NextFunction, Request, Response } from "express";

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  if(!req.session.userId){
    return res.status(401).json({
      message: "Authentication Error"
    })
  }
  return next()
}
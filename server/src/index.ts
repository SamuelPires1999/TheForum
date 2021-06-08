import express from 'express'
import cors from 'cors'
import session from 'express-session'
import Redis from 'ioredis'
import connectRedis from 'connect-redis'
import { createConnection } from 'typeorm';
import { User } from './models/User';
import { Post } from './models/Post';
import {router as AuthRoutes} from './controllers/AuthController'
import {router as UserRoutes} from './controllers/UserController'
import {router as PostRoutes} from './controllers/PostController'
import { isAuth } from './middlewares/isAuth'

const main = async () => {

  const conn = await createConnection({
    type: "postgres",
    username: "postgres",
    password: "12345",
    database: "theforum",
    logging: ["query", "error"],
    entities: [Post, User],
    synchronize: true,
  });

  conn.isConnected ? console.log('db up') : console.log('DB ERROR')

  const app = express()

  //general middlewares declaration
  app.use(express.json())
  app.use(cors())

  //session setup
  const RedisStore = connectRedis(session)
  const redis = new Redis('127.0.0.1:6379') // default redis port

  app.use(session({
    name: 'qid',
    store: new RedisStore({
      client: redis,
      disableTouch: true,
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      domain: undefined,
    },
    saveUninitialized: false, 
    secret: 'redissecrettoken',
    resave: false
  }))

  //route declaration
  app.use('/auth', AuthRoutes)
  app.use('/users', isAuth , UserRoutes)
  app.use('/posts', isAuth , PostRoutes)

  app.listen(4000, ()=>{
    console.log('server running on port 4000')
  })

}

main().catch(error => {
  console.log(error)
})
import express from 'express'
import {PostService} from '../services/PostService'

const router = express.Router()
const service = new PostService()

router.post('/makePost', service.makePost)
router.get('/all',service.getAllPosts)

export { router }
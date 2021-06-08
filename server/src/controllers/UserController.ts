import express from 'express'
import {UserService} from '../services/UserService'

const router = express.Router()
const service = new UserService()

router.get('/me', service.me)
router.put('/update', service.update)
router.delete('/me', service.logout)

export { router }
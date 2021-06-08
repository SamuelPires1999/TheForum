import express from 'express'
import {AuthService} from '../services/AuthService'

const router = express.Router()
const service = new AuthService()

router.post('/register', service.registerUser)
router.post('/login', service.loginUser)

export { router }
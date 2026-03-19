import { Router } from 'express'
import { getMe, updateMe } from '../controllers/user.controller.js'
import { authenticate } from '../middleware/auth.middleware.js'

const router = Router()

router.use(authenticate)
router.get('/me', getMe)
router.put('/me', updateMe)

export default router

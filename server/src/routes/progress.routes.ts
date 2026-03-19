import { Router } from 'express'
import { authenticate } from '../middleware/auth.middleware.js'
import { validate } from '../middleware/validate.middleware.js'
import { progressSchema } from '../validators/progress.validator.js'
import { upsertProgress, getMyProgress } from '../controllers/progress.controller.js'

const router = Router()

router.use(authenticate)

/**
 * @swagger
 * /progress:
 *   post:
 *     summary: Create or update milestone progress
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', validate(progressSchema), upsertProgress as any)

/**
 * @swagger
 * /progress/my-progress:
 *   get:
 *     summary: Get all progress records for the current user
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 */
router.get('/my-progress', getMyProgress as any)

export default router

import { Router } from 'express'
import { authenticate } from '../middleware/auth.middleware.js'
import { validate } from '../middleware/validate.middleware.js'
import { feedbackSchema } from '../validators/feedback.validator.js'
import { submitFeedback, getMyFeedback } from '../controllers/feedback.controller.js'

const router = Router()

router.use(authenticate)

/**
 * @swagger
 * /feedback:
 *   post:
 *     summary: Submit feedback for a recommendation
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', validate(feedbackSchema), submitFeedback as any)

/**
 * @swagger
 * /feedback/my:
 *   get:
 *     summary: Get current user's feedback history
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 */
router.get('/my', getMyFeedback as any)

export default router

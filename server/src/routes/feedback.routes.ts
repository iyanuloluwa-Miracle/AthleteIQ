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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - recommendationId
 *               - pathwaySlug
 *               - rating
 *               - interested
 *             properties:
 *               recommendationId:
 *                 type: string
 *                 pattern: '^[a-fA-F0-9]{24}$'
 *               pathwaySlug:
 *                 type: string
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               interested:
 *                 type: boolean
 *               comment:
 *                 type: string
 *                 maxLength: 1000
 *     responses:
 *       200:
 *         description: Feedback submitted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccessResponse'
 *       400:
 *         description: Invalid request payload
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
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

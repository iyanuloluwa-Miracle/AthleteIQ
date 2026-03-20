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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pathwaySlug
 *               - milestoneId
 *               - milestoneTitle
 *               - status
 *             properties:
 *               pathwaySlug:
 *                 type: string
 *               milestoneId:
 *                 type: string
 *               milestoneTitle:
 *                 type: string
 *                 maxLength: 200
 *               status:
 *                 type: string
 *                 enum: [not_started, in_progress, completed]
 *               notes:
 *                 type: string
 *                 maxLength: 1000
 *     responses:
 *       200:
 *         description: Progress updated
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

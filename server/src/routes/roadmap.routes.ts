import { Router } from 'express'
import { authenticate } from '../middleware/auth.middleware.js'
import { validate } from '../middleware/validate.middleware.js'
import { roadmapProgressSchema } from '../validators/progress.validator.js'
import {
  getPathwayRoadmap,
  getRoadmapSummary,
  updateRoadmapProgress
} from '../controllers/roadmap.controller.js'

const router = Router()

router.use(authenticate)

/**
 * @swagger
 * /roadmap/summary:
 *   get:
 *     summary: Get roadmap summary for all user's started pathways
 *     tags: [Roadmap]
 *     security:
 *       - bearerAuth: []
 */
router.get('/summary', getRoadmapSummary as any)

/**
 * @swagger
 * /roadmap/pathway/{slug}:
 *   get:
 *     summary: Get personalised roadmap for a specific pathway
 *     tags: [Roadmap]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 */
router.get('/pathway/:slug', getPathwayRoadmap as any)

/**
 * @swagger
 * /roadmap/pathway/{slug}/progress:
 *   post:
 *     summary: Update roadmap milestone progress
 *     tags: [Roadmap]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - milestoneId
 *               - milestoneTitle
 *               - status
 *             properties:
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
 *         description: Milestone progress updated
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
router.post('/pathway/:slug/progress', validate(roadmapProgressSchema), updateRoadmapProgress as any)

export default router

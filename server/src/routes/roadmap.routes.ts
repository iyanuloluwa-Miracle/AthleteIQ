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
 */
router.post('/pathway/:slug/progress', validate(roadmapProgressSchema), updateRoadmapProgress as any)

export default router

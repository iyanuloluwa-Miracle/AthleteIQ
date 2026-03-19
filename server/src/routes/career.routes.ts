import { Router } from 'express'
import { authenticate } from '../middleware/auth.middleware.js'
import {
  listPathways,
  getPathway,
  getRecommendations,
  getHistory
} from '../controllers/career.controller.js'

const router = Router()

/**
 * @swagger
 * /career/pathways:
 *   get:
 *     summary: List all career pathways
 *     tags: [Career]
 *     responses:
 *       200:
 *         description: List of career pathways
 */
router.get('/pathways', listPathways)

/**
 * @swagger
 * /career/pathways/{slug}:
 *   get:
 *     summary: Get a specific career pathway by slug
 *     tags: [Career]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 */
router.get('/pathways/:slug', getPathway)

// Protected routes
router.use(authenticate)

/**
 * @swagger
 * /career/recommendations:
 *   get:
 *     summary: Get user's saved recommendations
 *     tags: [Career]
 *     security:
 *       - bearerAuth: []
 */
router.get('/recommendations', getRecommendations as any)

/**
 * @swagger
 * /career/history:
 *   get:
 *     summary: Get user's full assessment history
 *     tags: [Career]
 *     security:
 *       - bearerAuth: []
 */
router.get('/history', getHistory as any)

export default router

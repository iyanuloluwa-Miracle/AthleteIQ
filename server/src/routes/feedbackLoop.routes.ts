import { Router } from 'express'
import { authenticate } from '../middleware/auth.middleware.js'
import { advisorOrAdmin } from '../middleware/rbac.middleware.js'
import { getInsights, getPathwayBreakdown } from '../controllers/feedbackLoop.controller.js'

const router = Router()

// Feedback loop routes are accessible to career_advisors and admins
router.use(authenticate, advisorOrAdmin)

/**
 * @swagger
 * /feedback-loop/insights:
 *   get:
 *     summary: Get aggregated feedback insights (advisor/admin)
 *     tags: [Feedback Loop]
 *     security:
 *       - bearerAuth: []
 */
router.get('/insights', getInsights)

/**
 * @swagger
 * /feedback-loop/pathway/{slug}:
 *   get:
 *     summary: Get feedback breakdown for a specific pathway (advisor/admin)
 *     tags: [Feedback Loop]
 *     security:
 *       - bearerAuth: []
 */
router.get('/pathway/:slug', getPathwayBreakdown)

export default router

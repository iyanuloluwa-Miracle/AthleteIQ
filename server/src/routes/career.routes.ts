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
 *     description: Public endpoint — returns all active career pathways sorted by title.
 *     tags: [Career]
 *     security: []
 *     responses:
 *       200:
 *         description: List of active career pathways
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Career pathways retrieved
 *                 data:
 *                   type: object
 *                   properties:
 *                     pathways:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: 65f7a6f5d2a8f8b6b85f1123
 *                           title:
 *                             type: string
 *                             example: Sports Coaching
 *                           slug:
 *                             type: string
 *                             example: sports-coaching
 *                           icon:
 *                             type: string
 *                             example: 🏋️
 *                           colour:
 *                             type: string
 *                             example: "#3B82F6"
 *                           category:
 *                             type: string
 *                             example: Coaching
 *                           description:
 *                             type: string
 *                           workEnvironment:
 *                             type: array
 *                             items:
 *                               type: string
 *                           jobOutlook:
 *                             type: string
 *                             example: Growing
 *                           salaryRange:
 *                             type: object
 *                             properties:
 *                               min:
 *                                 type: integer
 *                                 example: 35000
 *                               max:
 *                                 type: integer
 *                                 example: 75000
 *                               currency:
 *                                 type: string
 *                                 example: USD
 *                           keySkills:
 *                             type: array
 *                             items:
 *                               type: string
 *                           educationRequirements:
 *                             type: array
 *                             items:
 *                               type: string
 *                           certifications:
 *                             type: array
 *                             items:
 *                               type: string
 *                           isActive:
 *                             type: boolean
 *                             example: true
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
router.get('/pathways', listPathways)

/**
 * @swagger
 * /career/pathways/{slug}:
 *   get:
 *     summary: Get a specific career pathway by slug
 *     description: Public endpoint — returns full details for a single active career pathway.
 *     tags: [Career]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         example: sports-coaching
 *     responses:
 *       200:
 *         description: Career pathway details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Pathway retrieved
 *                 data:
 *                   type: object
 *                   properties:
 *                     pathway:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: 65f7a6f5d2a8f8b6b85f1123
 *                         title:
 *                           type: string
 *                           example: Sports Coaching
 *                         slug:
 *                           type: string
 *                           example: sports-coaching
 *                         icon:
 *                           type: string
 *                           example: 🏋️
 *                         colour:
 *                           type: string
 *                           example: "#3B82F6"
 *                         category:
 *                           type: string
 *                           example: Coaching
 *                         description:
 *                           type: string
 *                         workEnvironment:
 *                           type: array
 *                           items:
 *                             type: string
 *                         jobOutlook:
 *                           type: string
 *                           example: Growing
 *                         salaryRange:
 *                           type: object
 *                           properties:
 *                             min:
 *                               type: integer
 *                               example: 35000
 *                             max:
 *                               type: integer
 *                               example: 75000
 *                             currency:
 *                               type: string
 *                               example: USD
 *                         keySkills:
 *                           type: array
 *                           items:
 *                             type: string
 *                         educationRequirements:
 *                           type: array
 *                           items:
 *                             type: string
 *                         certifications:
 *                           type: array
 *                           items:
 *                             type: string
 *                         careerProgressionSteps:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               level:
 *                                 type: string
 *                               title:
 *                                 type: string
 *                               yearsExperience:
 *                                 type: string
 *                               description:
 *                                 type: string
 *                         successStories:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               name:
 *                                 type: string
 *                               sport:
 *                                 type: string
 *                               career:
 *                                 type: string
 *                               quote:
 *                                 type: string
 *       404:
 *         description: Pathway not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
router.get('/pathways/:slug', getPathway)

// Protected routes
router.use(authenticate)

/**
 * @swagger
 * /career/recommendations:
 *   get:
 *     summary: Get user's saved recommendations
 *     description: Returns the user's 10 most recent ML-generated recommendation sets, each with populated questionnaire data.
 *     tags: [Career]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's most recent career recommendations (up to 10)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Recommendations retrieved
 *                 data:
 *                   type: object
 *                   properties:
 *                     recommendations:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: 65f7a6f5d2a8f8b6b85f2234
 *                           topRecommendation:
 *                             type: string
 *                             example: sports-coaching
 *                           mlModelVersion:
 *                             type: string
 *                             example: 1.0.0
 *                           processingTimeMs:
 *                             type: integer
 *                             example: 312
 *                           recommendations:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 pathwaySlug:
 *                                   type: string
 *                                   example: sports-coaching
 *                                 pathwayName:
 *                                   type: string
 *                                   example: Sports Coaching
 *                                 matchPercentage:
 *                                   type: integer
 *                                   example: 87
 *                                 confidence:
 *                                   type: number
 *                                   format: float
 *                                   example: 0.87
 *                                 rank:
 *                                   type: integer
 *                                   example: 1
 *                                 keySkillsMatch:
 *                                   type: array
 *                                   items:
 *                                     type: string
 *                                 salaryRange:
 *                                   type: object
 *                                   properties:
 *                                     min:
 *                                       type: integer
 *                                     max:
 *                                       type: integer
 *                                     currency:
 *                                       type: string
 *                                 jobGrowthOutlook:
 *                                   type: string
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *       401:
 *         description: Unauthorized — missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
router.get('/recommendations', getRecommendations as any)

/**
 * @swagger
 * /career/history:
 *   get:
 *     summary: Get user's full assessment history
 *     description: Returns all recommendation records for the user (no limit), sorted newest first, with populated questionnaire data.
 *     tags: [Career]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Full list of the user's career assessment history
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Assessment history retrieved
 *                 data:
 *                   type: object
 *                   properties:
 *                     history:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: 65f7a6f5d2a8f8b6b85f2234
 *                           topRecommendation:
 *                             type: string
 *                             example: sports-coaching
 *                           mlModelVersion:
 *                             type: string
 *                             example: 1.0.0
 *                           recommendations:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 pathwaySlug:
 *                                   type: string
 *                                 pathwayName:
 *                                   type: string
 *                                 matchPercentage:
 *                                   type: integer
 *                                 rank:
 *                                   type: integer
 *                           questionnaireResponse:
 *                             type: object
 *                             description: Populated questionnaire document
 *                             properties:
 *                               primary_sport:
 *                                 type: string
 *                                 example: Football
 *                               academic_level:
 *                                 type: string
 *                                 example: Year 3
 *                               submittedAt:
 *                                 type: string
 *                                 format: date-time
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *       401:
 *         description: Unauthorized — missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
router.get('/history', getHistory as any)

export default router

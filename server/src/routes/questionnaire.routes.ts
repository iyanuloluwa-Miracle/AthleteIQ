import { Router } from 'express'
import { authenticate } from '../middleware/auth.middleware.js'
import { validate } from '../middleware/validate.middleware.js'
import { questionnaireSchema } from '../validators/questionnaire.validator.js'
import {
  submitQuestionnaire,
  getMyQuestionnaires
} from '../controllers/questionnaire.controller.js'

const router = Router()

router.use(authenticate)

/**
 * @swagger
 * /questionnaire:
 *   post:
 *     summary: Submit questionnaire and get career recommendations
 *     tags: [Questionnaire]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - academic_level
 *               - primary_sport
 *               - participation_years
 *               - participation_level
 *               - fitness_level
 *               - technical_skill
 *               - leadership
 *               - data_comfort
 *               - motivation
 *               - career_importance
 *               - work_environment
 *               - biggest_challenge
 *               - injury_history
 *               - career_interests
 */
router.post('/', validate(questionnaireSchema), submitQuestionnaire as any)

/**
 * @swagger
 * /questionnaire/my:
 *   get:
 *     summary: Get current user's questionnaire history
 *     tags: [Questionnaire]
 *     security:
 *       - bearerAuth: []
 */
router.get('/my', getMyQuestionnaires as any)

export default router

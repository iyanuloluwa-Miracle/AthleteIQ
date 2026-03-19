import { Router } from 'express'
import { authenticate } from '../middleware/auth.middleware.js'
import { validate } from '../middleware/validate.middleware.js'
import { updateProfileSchema } from '../validators/profile.validator.js'
import { getMyProfile, updateMyProfile } from '../controllers/profile.controller.js'

const router = Router()

router.use(authenticate)

/**
 * @swagger
 * /profile/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 */
router.get('/me', getMyProfile as any)

/**
 * @swagger
 * /profile/me:
 *   put:
 *     summary: Update current user profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 */
router.put('/me', validate(updateProfileSchema), updateMyProfile as any)

export default router

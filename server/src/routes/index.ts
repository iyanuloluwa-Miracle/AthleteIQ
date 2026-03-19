import { Router } from 'express'
import authRoutes from './auth.routes.js'
import userRoutes from './user.routes.js'
import profileRoutes from './profile.routes.js'
import careerRoutes from './career.routes.js'
import questionnaireRoutes from './questionnaire.routes.js'
import roadmapRoutes from './roadmap.routes.js'
import feedbackRoutes from './feedback.routes.js'
import feedbackLoopRoutes from './feedbackLoop.routes.js'
import progressRoutes from './progress.routes.js'
import adminRoutes from './admin.routes.js'

const router = Router()

router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/profile', profileRoutes)
router.use('/career', careerRoutes)
router.use('/questionnaire', questionnaireRoutes)
router.use('/roadmap', roadmapRoutes)
router.use('/feedback', feedbackRoutes)
router.use('/feedback-loop', feedbackLoopRoutes)
router.use('/progress', progressRoutes)
router.use('/admin', adminRoutes)

export default router

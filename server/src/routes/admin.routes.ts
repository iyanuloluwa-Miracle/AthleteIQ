import { Router } from 'express'
import { authenticate } from '../middleware/auth.middleware.js'
import { adminOnly } from '../middleware/rbac.middleware.js'
import {
  getDashboardStats,
  listUsers,
  getRecentAssessments,
  deleteUser
} from '../controllers/admin.controller.js'

const router = Router()

// All admin routes require authentication + admin role
router.use(authenticate, adminOnly)

/**
 * @swagger
 * /admin/stats:
 *   get:
 *     summary: Get admin dashboard statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 */
router.get('/stats', getDashboardStats)

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: List all users (paginated)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 */
router.get('/users', listUsers)

/**
 * @swagger
 * /admin/assessments:
 *   get:
 *     summary: Get recent assessments across all users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 */
router.get('/assessments', getRecentAssessments)

/**
 * @swagger
 * /admin/users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.delete('/users/:id', deleteUser)

export default router

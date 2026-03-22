import api from './api'
import type {
  ApiResponse,
  AdminDashboardData,
  PaginatedUsers,
  AssessmentsData
} from '@/types'
import type { AxiosResponse } from 'axios'

export default {
  /** GET /api/admin/stats — dashboard overview */
  getDashboardStats: (): Promise<AxiosResponse<ApiResponse<AdminDashboardData>>> =>
    api.get('/admin/stats'),

  /** GET /api/admin/users?page=&limit= — paginated user list */
  listUsers: (
    page = 1,
    limit = 20
  ): Promise<AxiosResponse<ApiResponse<PaginatedUsers>>> =>
    api.get('/admin/users', { params: { page, limit } }),

  /** GET /api/admin/assessments?limit= — recent assessments */
  getRecentAssessments: (
    limit = 20
  ): Promise<AxiosResponse<ApiResponse<AssessmentsData>>> =>
    api.get('/admin/assessments', { params: { limit } }),

  /** DELETE /api/admin/users/:id — remove a user */
  deleteUser: (id: string): Promise<AxiosResponse<ApiResponse<null>>> =>
    api.delete(`/admin/users/${id}`)
}

export interface User {
  _id: string
  name: string
  email: string
  role: 'student' | 'career_advisor' | 'admin'
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface RegisterResponse {
  user: User
}

export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data: T
}

export interface Toast {
  id: number
  type: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
}

export interface WorkoutLog {
  type: string
  duration: string
  notes: string
}

// ── Admin types ──────────────────────────────────────────────────────────────

export interface AdminStats {
  totalUsers: number
  totalStudents: number
  totalAdvisors: number
  totalAssessments: number
  totalFeedback: number
}

export interface AdminDashboardData {
  stats: AdminStats
  recentUsers: User[]
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  pages: number
}

export interface PaginatedUsers {
  users: User[]
  pagination: PaginationMeta
}

export interface Assessment {
  _id: string
  user: Pick<User, '_id' | 'name' | 'email' | 'role'> | null
  questionnaireResponse: {
    primary_sport?: string
    academic_level?: string
  } | null
  createdAt: string
}

export interface AssessmentsData {
  assessments: Assessment[]
}

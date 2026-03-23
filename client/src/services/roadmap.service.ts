import api from './api'
import type { ApiResponse } from '@/types'
import type { AxiosResponse } from 'axios'

export interface RoadmapSummaryItem {
  pathwaySlug: string
  pathwayTitle: string
  overallProgress: number
  lastActivityAt: string
}

export type MilestoneStatus = 'not_started' | 'in_progress' | 'completed'

export interface RoadmapMilestone {
  id: string
  title: string
  description: string
  type: string
  duration: string
  estimatedCost?: string
  resources?: Array<{ name: string; url: string }>
  status: MilestoneStatus
  completedAt?: string
  notes?: string
}

export interface Roadmap {
  pathwaySlug: string
  pathwayTitle: string
  milestones: RoadmapMilestone[]
}

export interface UpdateProgressPayload {
  milestoneId: string
  milestoneTitle: string
  status: MilestoneStatus
  notes?: string
}

export default {
  getSummary: (): Promise<AxiosResponse<ApiResponse<{ summary: RoadmapSummaryItem[] }>>> =>
    api.get('/roadmap/summary'),

  getPathwayRoadmap: (slug: string): Promise<AxiosResponse<ApiResponse<{ roadmap: Roadmap }>>> =>
    api.get(`/roadmap/pathway/${slug}`),

  updateProgress: (slug: string, payload: UpdateProgressPayload): Promise<AxiosResponse<ApiResponse<{ progress: unknown }>>> =>
    api.post(`/roadmap/pathway/${slug}/progress`, payload),
}

import api from './api'
import type { ApiResponse } from '@/types'
import type { AxiosResponse } from 'axios'

export interface FeedbackPayload {
  recommendationId: string
  pathwaySlug: string
  rating: number
  interested: boolean
  comment?: string
}

export interface FeedbackRecord {
  _id: string
  recommendationId: string
  pathwaySlug: string
  rating: number
  interested: boolean
  comment?: string
  createdAt: string
}

export default {
  submit: (payload: FeedbackPayload): Promise<AxiosResponse<ApiResponse<{ feedback: FeedbackRecord }>>> =>
    api.post('/feedback', payload),

  getHistory: (): Promise<AxiosResponse<ApiResponse<{ feedback: FeedbackRecord[] }>>> =>
    api.get('/feedback/my'),
}

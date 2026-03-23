import api from './api'
import type { ApiResponse } from '@/types'
import type { AxiosResponse } from 'axios'

export interface SalaryRange {
  min: number
  max: number
  currency: string
}

export interface MotivationRecommendation {
  pathwaySlug: string
  pathwayName: string
  reason: string
}

export interface RecommendationItem {
  pathwaySlug: string
  pathwayName: string
  matchPercentage: number
  confidence: number
  rank: number
  keySkillsMatch: string[]
  sportSpecificInsights: string[]
  salaryRange: SalaryRange
  jobGrowthOutlook: string
}

export interface CareerRecommendation {
  _id: string
  recommendations: RecommendationItem[]
  topRecommendation: string
  motivationRecommendation: MotivationRecommendation
  mlModelVersion: string
  processingTimeMs: number
  createdAt: string
}

export interface CareerPathway {
  _id: string
  title: string
  slug: string
  icon: string
  colour: string
  category: string
  description: string
  workEnvironment: string[]
  jobOutlook: string
  salaryRange: SalaryRange
  educationRequirements: string[]
  keySkills: string[]
  certifications: string[]
  careerProgressionSteps: Array<{
    level: string
    title: string
    yearsExperience: string
    description: string
  }>
  successStories: Array<{
    name: string
    sport: string
    career: string
    quote: string
  }>
  isActive: boolean
  createdAt: string
}

export default {
  getPathways: (): Promise<AxiosResponse<ApiResponse<{ pathways: CareerPathway[] }>>> =>
    api.get('/career/pathways'),

  getPathway: (slug: string): Promise<AxiosResponse<ApiResponse<{ pathway: CareerPathway }>>> =>
    api.get(`/career/pathways/${slug}`),

  getRecommendations: (): Promise<AxiosResponse<ApiResponse<{ recommendations: CareerRecommendation[] }>>> =>
    api.get('/career/recommendations'),

  getHistory: (): Promise<AxiosResponse<ApiResponse<{ history: CareerRecommendation[] }>>> =>
    api.get('/career/history'),
}

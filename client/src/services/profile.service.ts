import api from './api'
import type { ApiResponse } from '@/types'
import type { AxiosResponse } from 'axios'

export interface UserProfile {
  _id?: string
  user: string
  university: string
  programOfStudy: string
  primarySport: string
  yearOfStudy: string
  bio: string
  avatarUrl: string
  createdAt?: string
  updatedAt?: string
}

export type UpdateProfilePayload = Partial<
  Pick<UserProfile, 'university' | 'programOfStudy' | 'primarySport' | 'yearOfStudy' | 'bio' | 'avatarUrl'>
>

export default {
  getProfile: (): Promise<AxiosResponse<ApiResponse<{ profile: UserProfile }>>> =>
    api.get('/profile/me'),

  updateProfile: (data: UpdateProfilePayload): Promise<AxiosResponse<ApiResponse<{ profile: UserProfile }>>> =>
    api.put('/profile/me', data),
}

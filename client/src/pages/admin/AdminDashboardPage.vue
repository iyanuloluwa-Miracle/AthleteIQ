<template>
  <div>
    <!-- Page Header -->
    <div class="mb-8">
      <div class="flex items-center gap-3 mb-1">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-500 flex items-center justify-center shadow-lg shadow-primary-500/20">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" class="w-5 h-5">
            <path d="M12 20V10"/>
            <path d="M18 20V4"/>
            <path d="M6 20v-4"/>
          </svg>
        </div>
        <div>
          <h1 class="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
          <p class="text-sm text-slate-500">Platform overview and management</p>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading && !stats" class="flex items-center justify-center py-20">
      <AppSpinner size="lg" />
    </div>

    <!-- Error state -->
    <BaseAlert v-if="error" type="error" :show="!!error" dismissible @dismiss="error = null">
      {{ error }}
    </BaseAlert>

    <!-- Stats grid -->
    <div v-if="stats" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      <StatCard label="Total Users" :value="stats.totalUsers" icon-bg="#ffedd5">
        <template #icon>
          <svg viewBox="0 0 24 24" fill="none" stroke="#ea580c" stroke-width="2" class="w-5.5 h-5.5">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </template>
      </StatCard>

      <StatCard label="Students" :value="stats.totalStudents" icon-bg="#dcfce7">
        <template #icon>
          <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2" class="w-5.5 h-5.5">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
            <path d="M6 12v5c0 2 6 3 6 3s6-1 6-3v-5"/>
          </svg>
        </template>
      </StatCard>

      <StatCard label="Advisors" :value="stats.totalAdvisors" icon-bg="#dbeafe">
        <template #icon>
          <svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" class="w-5.5 h-5.5">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </template>
      </StatCard>

      <StatCard label="Assessments" :value="stats.totalAssessments" icon-bg="#fef3c7">
        <template #icon>
          <svg viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2" class="w-5.5 h-5.5">
            <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
            <rect x="9" y="3" width="6" height="4" rx="1"/>
            <path d="M9 14l2 2 4-4"/>
          </svg>
        </template>
      </StatCard>

      <StatCard label="Feedback" :value="stats.totalFeedback" icon-bg="#fce7f3">
        <template #icon>
          <svg viewBox="0 0 24 24" fill="none" stroke="#db2777" stroke-width="2" class="w-5.5 h-5.5">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </template>
      </StatCard>
    </div>

    <!-- Content grid -->
    <div v-if="stats" class="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
      <!-- Recent Users -->
      <BaseCard title="Recent Users" subtitle="Latest user registrations">
        <template #actions>
          <router-link
            to="/admin/users"
            class="text-sm text-primary-600 font-semibold hover:text-primary-700 transition-colors"
          >
            View all →
          </router-link>
        </template>

        <div v-if="recentUsers.length === 0" class="text-center py-8 text-slate-400">
          <p class="text-sm">No users found</p>
        </div>

        <ul v-else class="divide-y divide-slate-100">
          <li
            v-for="u in recentUsers"
            :key="u._id"
            class="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
          >
            <UserAvatar :name="u.name" size="sm" />
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-slate-800 truncate">{{ u.name }}</p>
              <p class="text-xs text-slate-400 mt-0.5 truncate">{{ u.email }}</p>
            </div>
            <span :class="roleBadgeClass(u.role)" class="text-[11px] px-2.5 py-0.5 rounded-full font-medium whitespace-nowrap">
              {{ formatRole(u.role) }}
            </span>
            <span class="text-xs text-slate-400 whitespace-nowrap">{{ formatDate(u.createdAt) }}</span>
          </li>
        </ul>
      </BaseCard>

      <!-- Recent Assessments -->
      <BaseCard title="Recent Assessments" subtitle="Latest career path assessments">
        <div v-if="assessments.length === 0" class="text-center py-8 text-slate-400">
          <p class="text-sm">No assessments yet</p>
        </div>

        <ul v-else class="divide-y divide-slate-100">
          <li
            v-for="a in assessments"
            :key="a._id"
            class="py-3 first:pt-0 last:pb-0"
          >
            <div class="flex items-center gap-3">
              <UserAvatar :name="a.user?.name ?? 'Unknown'" size="sm" />
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-slate-800 truncate">{{ a.user?.name ?? 'Unknown User' }}</p>
                <p class="text-xs text-slate-400 mt-0.5">{{ formatDate(a.createdAt) }}</p>
              </div>
            </div>
            <div v-if="a.questionnaireResponse" class="flex gap-2 mt-2 ml-11">
              <span v-if="a.questionnaireResponse.primary_sport" class="text-[11px] bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full font-medium">
                {{ a.questionnaireResponse.primary_sport }}
              </span>
              <span v-if="a.questionnaireResponse.academic_level" class="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                {{ a.questionnaireResponse.academic_level }}
              </span>
            </div>
          </li>
        </ul>
      </BaseCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAdminStore } from '@/stores/adminStore'
import StatCard from '@/components/StatCard.vue'
import BaseCard from '@/components/BaseCard.vue'
import BaseAlert from '@/components/BaseAlert.vue'
import AppSpinner from '@/components/AppSpinner.vue'
import UserAvatar from '@/components/UserAvatar.vue'

const adminStore = useAdminStore()
const { stats, recentUsers, assessments, loading, error } = storeToRefs(adminStore)

function formatRole(role: string): string {
  const labels: Record<string, string> = {
    student: 'Student',
    career_advisor: 'Advisor',
    admin: 'Admin'
  }
  return labels[role] ?? role
}

function roleBadgeClass(role: string): string {
  const map: Record<string, string> = {
    student: 'bg-emerald-50 text-emerald-700',
    career_advisor: 'bg-blue-50 text-blue-700',
    admin: 'bg-amber-50 text-amber-700'
  }
  return map[role] ?? 'bg-slate-100 text-slate-600'
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays}d ago`

  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

onMounted(async () => {
  try {
    await Promise.all([
      adminStore.fetchDashboardStats(),
      adminStore.fetchAssessments(10)
    ])
  } catch {
    // Errors are already stored in adminStore.error
  }
})
</script>

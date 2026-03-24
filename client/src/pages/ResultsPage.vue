<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h2 class="text-2xl font-bold text-slate-800">Your Career Recommendations</h2>
      <p class="text-slate-500 mt-1">Based on your assessment, here are your top career pathway matches.</p>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>

    <!-- Error -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
      <p class="text-red-700 font-medium">{{ error }}</p>
      <button
        class="mt-3 text-sm text-red-600 underline hover:no-underline"
        @click="loadRecommendations"
      >Try again</button>
    </div>

    <template v-else-if="recommendation">
      <!-- Motivation recommendation banner -->
      <div v-if="recommendation.motivationRecommendation" class="bg-primary-50 border border-primary-200 rounded-xl p-5 flex gap-4">
        <div class="shrink-0 w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5">
            <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
          </svg>
        </div>
        <div>
          <p class="text-sm font-semibold text-primary-800">Top Match: {{ recommendation.motivationRecommendation.pathwayName }}</p>
          <p class="text-sm text-primary-700 mt-0.5">{{ recommendation.motivationRecommendation.reason }}</p>
        </div>
      </div>

      <!-- Recommendations list -->
      <div class="space-y-4">
        <div
          v-for="(rec, index) in recommendation.recommendations"
          :key="rec.pathwaySlug"
          class="bg-white border border-slate-200 rounded-xl p-5 hover:border-primary-300 hover:shadow-sm transition-all"
        >
          <div class="flex items-start gap-4">
            <!-- Rank badge -->
            <div
              :class="[
                'shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold',
                index === 0 ? 'bg-amber-100 text-amber-700' :
                index === 1 ? 'bg-slate-100 text-slate-600' :
                index === 2 ? 'bg-orange-50 text-orange-600' :
                'bg-slate-50 text-slate-500'
              ]"
            >
              #{{ rec.rank }}
            </div>

            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between gap-3 flex-wrap">
                <h3 class="text-base font-semibold text-slate-800">{{ rec.pathwayName }}</h3>
                <span
                  :class="[
                    'text-xs font-bold px-2.5 py-1 rounded-full',
                    rec.matchPercentage >= 80 ? 'bg-green-100 text-green-700' :
                    rec.matchPercentage >= 60 ? 'bg-blue-100 text-blue-700' :
                    'bg-slate-100 text-slate-600'
                  ]"
                >
                  {{ rec.matchPercentage }}% match
                </span>
              </div>

              <!-- Match bar -->
              <div class="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  :class="[
                    'h-full rounded-full transition-all duration-700',
                    rec.matchPercentage >= 80 ? 'bg-green-500' :
                    rec.matchPercentage >= 60 ? 'bg-primary-500' : 'bg-slate-400'
                  ]"
                  :style="{ width: rec.matchPercentage + '%' }"
                />
              </div>

              <!-- Meta row -->
              <div class="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-slate-500">
                <span v-if="rec.salaryRange" class="flex items-center gap-1.5">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4">
                    <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                  </svg>
                  {{ formatSalary(rec.salaryRange) }}
                </span>
                <span class="flex items-center gap-1.5">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                  </svg>
                  {{ rec.jobGrowthOutlook }}
                </span>
                <span class="flex items-center gap-1.5">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  {{ Math.round(rec.confidence * 100) }}% confidence
                </span>
              </div>

              <!-- Skills match -->
              <div v-if="rec.keySkillsMatch?.length" class="mt-3 flex flex-wrap gap-1.5">
                <span
                  v-for="skill in rec.keySkillsMatch"
                  :key="skill"
                  class="text-sm bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full"
                >{{ skill }}</span>
              </div>

              <!-- Sport-specific insights -->
              <div v-if="rec.sportSpecificInsights?.length" class="mt-3 space-y-1.5">
                <p
                  v-for="insight in rec.sportSpecificInsights"
                  :key="insight"
                  class="text-sm text-slate-600 flex gap-2"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4 shrink-0 mt-0.5 text-primary-400">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {{ insight }}
                </p>
              </div>

              <!-- Actions -->
              <div class="mt-4 flex gap-3">
                <router-link
                  :to="`/app/pathways/${rec.pathwaySlug}`"
                  class="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1"
                >
                  View pathway
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </router-link>
                <span class="text-slate-300">·</span>
                <router-link
                  :to="`/app/roadmap/${rec.pathwaySlug}`"
                  class="text-sm font-medium text-slate-500 hover:text-slate-700 flex items-center gap-1"
                >
                  Start roadmap
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer actions -->
      <div class="flex flex-col sm:flex-row gap-3 pt-2">
        <router-link
          to="/app/pathways"
          class="flex-1 text-center py-2.5 px-4 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Browse All Pathways
        </router-link>
        <router-link
          to="/app/questionnaire"
          class="flex-1 text-center py-2.5 px-4 border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg transition-colors"
        >
          Retake Assessment
        </router-link>
      </div>

      <!-- Model info -->
      <p class="text-xs text-center text-slate-400">
        Analysed in {{ recommendation.processingTimeMs }}ms · Model {{ recommendation.mlModelVersion }}
      </p>
    </template>

    <!-- Empty state -->
    <div v-else class="text-center py-16 space-y-4">
      <div class="mx-auto w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-8 h-8">
          <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
          <rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4"/>
        </svg>
      </div>
      <div>
        <p class="font-semibold text-slate-700">No recommendations yet</p>
        <p class="text-sm text-slate-500 mt-1">Complete the career assessment to get your personalised results.</p>
      </div>
      <router-link
        to="/app/questionnaire"
        class="inline-block py-2.5 px-6 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors"
      >
        Take Assessment
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import careerService, { type CareerRecommendation, type SalaryRange } from '@/services/career.service'

const loading = ref(false)
const error = ref('')
const recommendation = ref<CareerRecommendation | null>(null)

function formatSalary(range: SalaryRange | undefined): string {
  if (!range) return ''
  const fmt = (n: number) => n >= 1000 ? `${Math.round(n / 1000)}k` : `${n}`
  return `$${fmt(range.min)}–$${fmt(range.max)} ${range.currency}`
}

async function loadRecommendations() {
  // Check if we have fresh data from questionnaire submission via router state
  const stateData = (history.state as Record<string, unknown>)?.recommendation
  if (stateData) {
    try {
      recommendation.value = JSON.parse(stateData as string)
      return
    } catch {
      // fall through to API
    }
  }

  loading.value = true
  error.value = ''
  try {
    const res = await careerService.getRecommendations()
    const list = res.data.data.recommendations
    if (list?.length) {
      recommendation.value = list[0]
    }
  } catch (e: unknown) {
    const err = e as { response?: { data?: { message?: string } } }
    error.value = err.response?.data?.message ?? 'Failed to load recommendations.'
  } finally {
    loading.value = false
  }
}

onMounted(loadRecommendations)
</script>

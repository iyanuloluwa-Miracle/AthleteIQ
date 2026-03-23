<template>
  <div class="space-y-6">
    <!-- Back -->
    <router-link
      to="/app/pathways"
      class="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4">
        <polyline points="15 18 9 12 15 6"/>
      </svg>
      Back to Pathways
    </router-link>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>

    <!-- Error -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
      <p class="text-red-700">{{ error }}</p>
    </div>

    <template v-else-if="pathway">
      <!-- Hero -->
      <div class="bg-white border border-slate-200 rounded-2xl p-6">
        <div class="flex items-start gap-5">
          <div
            class="shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
            :style="{ backgroundColor: pathway.colour + '20', color: pathway.colour }"
          >
            {{ pathway.icon }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <span class="text-xs font-medium text-slate-400 uppercase tracking-wider">{{ pathway.category }}</span>
                <h1 class="text-2xl font-bold text-slate-800 mt-0.5">{{ pathway.title }}</h1>
              </div>
              <router-link
                :to="`/app/roadmap/${pathway.slug}`"
                class="shrink-0 py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Start Roadmap
              </router-link>
            </div>
            <p class="text-slate-600 mt-2 text-sm leading-relaxed">{{ pathway.description }}</p>

            <!-- Meta -->
            <div class="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
              <span v-if="pathway.salaryRange" class="flex items-center gap-1.5">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4 text-slate-400">
                  <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
                {{ formatSalary(pathway.salaryRange) }}
              </span>
              <span class="flex items-center gap-1.5">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4 text-slate-400">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
                {{ pathway.jobOutlook }}
              </span>
              <span v-for="env in pathway.workEnvironment" :key="env" class="flex items-center gap-1.5">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4 text-slate-400">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
                {{ env }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left column -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Career progression -->
          <section class="bg-white border border-slate-200 rounded-xl p-5">
            <h2 class="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wide">Career Progression</h2>
            <div class="relative">
              <div class="absolute left-4 top-4 bottom-4 w-0.5 bg-slate-100" />
              <div class="space-y-4">
                <div
                  v-for="(step, i) in pathway.careerProgressionSteps"
                  :key="i"
                  class="relative flex gap-4 pl-10"
                >
                  <div class="absolute left-0 top-1 w-8 h-8 rounded-full bg-white border-2 border-primary-200 flex items-center justify-center text-xs font-bold text-primary-600 shrink-0">
                    {{ i + 1 }}
                  </div>
                  <div class="flex-1 pb-4">
                    <div class="flex items-center justify-between gap-2 flex-wrap">
                      <h3 class="text-sm font-semibold text-slate-800">{{ step.title }}</h3>
                      <span class="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{{ step.yearsExperience }}</span>
                    </div>
                    <p class="text-xs text-slate-400 font-medium uppercase tracking-wide mt-0.5">{{ step.level }}</p>
                    <p class="text-sm text-slate-600 mt-1">{{ step.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Success stories -->
          <section v-if="pathway.successStories?.length" class="bg-white border border-slate-200 rounded-xl p-5">
            <h2 class="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wide">Success Stories</h2>
            <div class="space-y-4">
              <div
                v-for="story in pathway.successStories"
                :key="story.name"
                class="border border-slate-100 rounded-lg p-4"
              >
                <p class="text-sm text-slate-600 italic">"{{ story.quote }}"</p>
                <div class="mt-2 flex items-center gap-2">
                  <div class="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center text-xs font-bold text-primary-600">
                    {{ story.name[0] }}
                  </div>
                  <div>
                    <p class="text-xs font-semibold text-slate-700">{{ story.name }}</p>
                    <p class="text-xs text-slate-400">{{ story.sport }} → {{ story.career }}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- Right column -->
        <div class="space-y-4">
          <!-- Key skills -->
          <section class="bg-white border border-slate-200 rounded-xl p-5">
            <h2 class="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">Key Skills</h2>
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="skill in pathway.keySkills"
                :key="skill"
                class="text-xs px-2.5 py-1 rounded-full"
                :style="{ backgroundColor: pathway.colour + '15', color: pathway.colour }"
              >{{ skill }}</span>
            </div>
          </section>

          <!-- Education -->
          <section class="bg-white border border-slate-200 rounded-xl p-5">
            <h2 class="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">Education</h2>
            <ul class="space-y-1.5">
              <li
                v-for="req in pathway.educationRequirements"
                :key="req"
                class="flex gap-2 text-sm text-slate-600"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4 shrink-0 mt-0.5 text-primary-400">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {{ req }}
              </li>
            </ul>
          </section>

          <!-- Certifications -->
          <section v-if="pathway.certifications?.length" class="bg-white border border-slate-200 rounded-xl p-5">
            <h2 class="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">Certifications</h2>
            <ul class="space-y-1.5">
              <li
                v-for="cert in pathway.certifications"
                :key="cert"
                class="flex gap-2 text-sm text-slate-600"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4 shrink-0 mt-0.5 text-amber-400">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                {{ cert }}
              </li>
            </ul>
          </section>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import careerService, { type CareerPathway, type SalaryRange } from '@/services/career.service'

const route = useRoute()
const loading = ref(false)
const error = ref('')
const pathway = ref<CareerPathway | null>(null)

function formatSalary(range: SalaryRange | undefined): string {
  if (!range) return ''
  const fmt = (n: number) => n >= 1000 ? `${Math.round(n / 1000)}k` : `${n}`
  return `$${fmt(range.min)}–$${fmt(range.max)} ${range.currency}`
}

onMounted(async () => {
  loading.value = true
  try {
    const slug = route.params.slug as string
    const res = await careerService.getPathway(slug)
    pathway.value = res.data.data.pathway
  } catch (e: unknown) {
    const err = e as { response?: { data?: { message?: string } } }
    error.value = err.response?.data?.message ?? 'Failed to load pathway.'
  } finally {
    loading.value = false
  }
})
</script>

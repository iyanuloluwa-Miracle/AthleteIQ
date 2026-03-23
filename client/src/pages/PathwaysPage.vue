<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <h2 class="text-2xl font-bold text-slate-800">Career Pathways</h2>
        <p class="text-slate-500 mt-1">Explore {{ pathways.length }} career pathways available to student athletes.</p>
      </div>
      <router-link
        to="/app/questionnaire"
        class="shrink-0 py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors"
      >
        Take Assessment
      </router-link>
    </div>

    <!-- Search & filter -->
    <div class="flex flex-col sm:flex-row gap-3">
      <div class="relative flex-1">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          v-model="search"
          type="text"
          placeholder="Search pathways..."
          class="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 bg-white"
        />
      </div>
      <select
        v-model="categoryFilter"
        class="py-2.5 pl-3 pr-8 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 bg-white"
      >
        <option value="">All categories</option>
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>

    <!-- Error -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
      <p class="text-red-700">{{ error }}</p>
    </div>

    <!-- Grid -->
    <div v-else-if="filtered.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <router-link
        v-for="pathway in filtered"
        :key="pathway.slug"
        :to="`/app/pathways/${pathway.slug}`"
        class="group bg-white border border-slate-200 rounded-xl p-5 hover:border-primary-300 hover:shadow-md transition-all"
      >
        <!-- Icon -->
        <div
          class="w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-4"
          :style="{ backgroundColor: pathway.colour + '20', color: pathway.colour }"
        >
          {{ pathway.icon }}
        </div>

        <h3 class="font-semibold text-slate-800 group-hover:text-primary-700 transition-colors leading-snug">
          {{ pathway.title }}
        </h3>

        <p class="text-xs text-slate-500 mt-1 line-clamp-2">{{ pathway.description }}</p>

        <div class="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-500">
          <span v-if="pathway.salaryRange" class="flex items-center gap-1">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-3.5 h-3.5">
              <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
            {{ formatSalary(pathway.salaryRange) }}
          </span>
          <span class="flex items-center gap-1">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-3.5 h-3.5">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
            {{ pathway.jobOutlook }}
          </span>
        </div>

        <div class="mt-3 flex flex-wrap gap-1.5">
          <span
            v-for="env in pathway.workEnvironment?.slice(0, 2)"
            :key="env"
            class="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full"
          >{{ env }}</span>
          <span
            v-if="(pathway.workEnvironment?.length ?? 0) > 2"
            class="text-xs bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full"
          >+{{ pathway.workEnvironment.length - 2 }}</span>
        </div>
      </router-link>
    </div>

    <!-- Empty search -->
    <div v-else class="text-center py-16 text-slate-500">
      <p class="font-medium">No pathways match your search.</p>
      <button class="mt-2 text-sm text-primary-600 hover:underline" @click="search = ''; categoryFilter = ''">Clear filters</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import careerService, { type CareerPathway, type SalaryRange } from '@/services/career.service'

const loading = ref(false)
const error = ref('')
const pathways = ref<CareerPathway[]>([])
const search = ref('')
const categoryFilter = ref('')

const categories = computed(() => [...new Set(pathways.value.map(p => p.category))].sort())

const filtered = computed(() => {
  let list = pathways.value
  if (search.value) {
    const q = search.value.toLowerCase()
    list = list.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    )
  }
  if (categoryFilter.value) {
    list = list.filter(p => p.category === categoryFilter.value)
  }
  return list
})

function formatSalary(range: SalaryRange | undefined): string {
  if (!range) return ''
  const fmt = (n: number) => n >= 1000 ? `${Math.round(n / 1000)}k` : `${n}`
  return `$${fmt(range.min)}–$${fmt(range.max)}`
}

onMounted(async () => {
  loading.value = true
  try {
    const res = await careerService.getPathways()
    pathways.value = res.data.data.pathways.filter(p => p.isActive)
  } catch (e: unknown) {
    const err = e as { response?: { data?: { message?: string } } }
    error.value = err.response?.data?.message ?? 'Failed to load pathways.'
  } finally {
    loading.value = false
  }
})
</script>

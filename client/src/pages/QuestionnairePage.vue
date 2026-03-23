<template>
  <div class="max-w-2xl mx-auto">
    <!-- Progress bar -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-semibold text-slate-700">Step {{ currentStep }} of {{ totalSteps }}</span>
        <span class="text-sm text-slate-400">{{ stepTitles[currentStep - 1] }}</span>
      </div>
      <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          class="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
          :style="{ width: `${(currentStep / totalSteps) * 100}%` }"
        />
      </div>
    </div>

    <BaseCard>
      <!-- Step 1: Athletic Background -->
      <div v-if="currentStep === 1" class="flex flex-col gap-5">
        <div>
          <h2 class="text-xl font-bold text-slate-800">Athletic Background</h2>
          <p class="text-sm text-slate-500 mt-1">Tell us about your sport and experience level.</p>
        </div>

        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1.5">Primary Sport <span class="text-red-500">*</span></label>
          <input
            v-model="form.primary_sport"
            type="text"
            placeholder="e.g. Football, Basketball, Athletics…"
            class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <p v-if="errors.primary_sport" class="mt-1 text-xs text-red-500">{{ errors.primary_sport }}</p>
        </div>

        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-2">Academic Level <span class="text-red-500">*</span></label>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <button
              v-for="opt in academicLevels" :key="opt"
              type="button"
              :class="['px-3 py-2 rounded-xl border text-sm font-medium transition-all', form.academic_level === opt ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-slate-200 text-slate-600 hover:border-slate-300']"
              @click="form.academic_level = opt"
            >{{ opt }}</button>
          </div>
          <p v-if="errors.academic_level" class="mt-1 text-xs text-red-500">{{ errors.academic_level }}</p>
        </div>

        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-2">Years of Participation <span class="text-red-500">*</span></label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="opt in participationYears" :key="opt"
              type="button"
              :class="['px-4 py-2 rounded-xl border text-sm font-medium transition-all', form.participation_years === opt ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-slate-200 text-slate-600 hover:border-slate-300']"
              @click="form.participation_years = opt"
            >{{ opt }} years</button>
          </div>
          <p v-if="errors.participation_years" class="mt-1 text-xs text-red-500">{{ errors.participation_years }}</p>
        </div>

        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-2">Participation Level <span class="text-red-500">*</span></label>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <button
              v-for="opt in participationLevels" :key="opt"
              type="button"
              :class="['px-3 py-2 rounded-xl border text-sm font-medium transition-all', form.participation_level === opt ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-slate-200 text-slate-600 hover:border-slate-300']"
              @click="form.participation_level = opt"
            >{{ opt }}</button>
          </div>
          <p v-if="errors.participation_level" class="mt-1 text-xs text-red-500">{{ errors.participation_level }}</p>
        </div>
      </div>

      <!-- Step 2: Skills Assessment -->
      <div v-else-if="currentStep === 2" class="flex flex-col gap-6">
        <div>
          <h2 class="text-xl font-bold text-slate-800">Skills & Abilities</h2>
          <p class="text-sm text-slate-500 mt-1">Rate yourself honestly — this helps us match you accurately.</p>
        </div>

        <div v-for="skill in skillFields" :key="skill.key" class="flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <label class="text-sm font-semibold text-slate-700">{{ skill.label }}</label>
            <span class="text-sm font-bold text-primary-600">{{ (form as any)[skill.key] }}/5</span>
          </div>
          <p class="text-xs text-slate-400 -mt-1">{{ skill.hint }}</p>
          <div class="flex gap-2">
            <button
              v-for="n in 5" :key="n"
              type="button"
              :class="['flex-1 py-2.5 rounded-xl border text-sm font-bold transition-all', (form as any)[skill.key] >= n ? 'border-primary-500 bg-primary-500 text-white' : 'border-slate-200 text-slate-500 hover:border-primary-300']"
              @click="(form as any)[skill.key] = n"
            >{{ n }}</button>
          </div>
        </div>
      </div>

      <!-- Step 3: Career Aspirations -->
      <div v-else-if="currentStep === 3" class="flex flex-col gap-5">
        <div>
          <h2 class="text-xl font-bold text-slate-800">Career Aspirations</h2>
          <p class="text-sm text-slate-500 mt-1">What drives you and what kind of work do you want to do?</p>
        </div>

        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-2">Primary Motivation <span class="text-red-500">*</span></label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              v-for="opt in motivations" :key="opt.value"
              type="button"
              :class="['flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all', form.motivation === opt.value ? 'border-primary-500 bg-primary-50' : 'border-slate-200 hover:border-slate-300']"
              @click="form.motivation = opt.value"
            >
              <span class="text-xl shrink-0">{{ opt.icon }}</span>
              <span :class="['text-sm font-medium', form.motivation === opt.value ? 'text-primary-700' : 'text-slate-600']">{{ opt.label }}</span>
            </button>
          </div>
          <p v-if="errors.motivation" class="mt-1 text-xs text-red-500">{{ errors.motivation }}</p>
        </div>

        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-2">What matters most in your career? <span class="text-red-500">*</span></label>
          <div class="flex flex-col gap-2">
            <button
              v-for="opt in careerImportance" :key="opt"
              type="button"
              :class="['px-4 py-2.5 rounded-xl border text-sm font-medium text-left transition-all', form.career_importance === opt ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-slate-200 text-slate-600 hover:border-slate-300']"
              @click="form.career_importance = opt"
            >{{ opt }}</button>
          </div>
          <p v-if="errors.career_importance" class="mt-1 text-xs text-red-500">{{ errors.career_importance }}</p>
        </div>

        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-2">Preferred Work Environment <span class="text-red-500">*</span></label>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <button
              v-for="opt in workEnvironments" :key="opt.value"
              type="button"
              :class="['flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border text-center transition-all', form.work_environment === opt.value ? 'border-primary-500 bg-primary-50' : 'border-slate-200 hover:border-slate-300']"
              @click="form.work_environment = opt.value"
            >
              <span class="text-lg">{{ opt.icon }}</span>
              <span :class="['text-xs font-semibold', form.work_environment === opt.value ? 'text-primary-700' : 'text-slate-600']">{{ opt.label }}</span>
            </button>
          </div>
          <p v-if="errors.work_environment" class="mt-1 text-xs text-red-500">{{ errors.work_environment }}</p>
        </div>
      </div>

      <!-- Step 4: Challenges & Interests -->
      <div v-else-if="currentStep === 4" class="flex flex-col gap-5">
        <div>
          <h2 class="text-xl font-bold text-slate-800">Context & Interests</h2>
          <p class="text-sm text-slate-500 mt-1">Help us understand your situation and specific interests.</p>
        </div>

        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-2">Biggest Challenge <span class="text-red-500">*</span></label>
          <div class="flex flex-col gap-2">
            <button
              v-for="opt in biggestChallenges" :key="opt"
              type="button"
              :class="['px-4 py-2.5 rounded-xl border text-sm font-medium text-left transition-all', form.biggest_challenge === opt ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-slate-200 text-slate-600 hover:border-slate-300']"
              @click="form.biggest_challenge = opt"
            >{{ opt }}</button>
          </div>
          <p v-if="errors.biggest_challenge" class="mt-1 text-xs text-red-500">{{ errors.biggest_challenge }}</p>
        </div>

        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-2">Injury History <span class="text-red-500">*</span></label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              v-for="opt in injuryOptions" :key="opt"
              type="button"
              :class="['px-4 py-2.5 rounded-xl border text-sm font-medium text-left transition-all', form.injury_history === opt ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-slate-200 text-slate-600 hover:border-slate-300']"
              @click="form.injury_history = opt"
            >{{ opt }}</button>
          </div>
          <p v-if="errors.injury_history" class="mt-1 text-xs text-red-500">{{ errors.injury_history }}</p>
        </div>

        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1.5">
            Career Interests <span class="text-red-500">*</span>
            <span class="text-xs font-normal text-slate-400 ml-1">(select 1–3)</span>
          </label>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="opt in careerInterestOptions" :key="opt"
              type="button"
              :disabled="!form.career_interests.includes(opt) && form.career_interests.length >= 3"
              :class="['px-3 py-2 rounded-xl border text-sm font-medium text-left transition-all disabled:opacity-40 disabled:cursor-not-allowed', form.career_interests.includes(opt) ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-slate-200 text-slate-600 hover:border-slate-300']"
              @click="toggleInterest(opt)"
            >{{ opt }}</button>
          </div>
          <p v-if="errors.career_interests" class="mt-1 text-xs text-red-500">{{ errors.career_interests }}</p>
        </div>
      </div>

      <!-- Step 5: Review & Submit -->
      <div v-else-if="currentStep === 5" class="flex flex-col gap-5">
        <div>
          <h2 class="text-xl font-bold text-slate-800">Review Your Answers</h2>
          <p class="text-sm text-slate-500 mt-1">Everything look right? Submit to get your personalised recommendations.</p>
        </div>

        <div class="divide-y divide-slate-100 rounded-xl border border-slate-200 overflow-hidden">
          <div v-for="item in reviewItems" :key="item.label" class="flex items-start justify-between gap-4 px-4 py-3">
            <span class="text-xs font-semibold text-slate-500 w-36 shrink-0">{{ item.label }}</span>
            <span class="text-sm text-slate-800 text-right">{{ item.value }}</span>
          </div>
        </div>

        <BaseAlert v-if="submitError" type="error" :show="!!submitError">{{ submitError }}</BaseAlert>
      </div>

      <!-- Navigation -->
      <div class="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
        <BaseButton
          v-if="currentStep > 1"
          variant="secondary"
          @click="currentStep--"
        >
          ← Back
        </BaseButton>
        <div v-else />

        <BaseButton
          v-if="currentStep < totalSteps"
          @click="nextStep"
        >
          Continue →
        </BaseButton>
        <BaseButton
          v-else
          :loading="submitting"
          @click="handleSubmit"
        >
          Get My Recommendations →
        </BaseButton>
      </div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import questionnaireService from '@/services/questionnaire.service'
import BaseCard from '@/components/BaseCard.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseAlert from '@/components/BaseAlert.vue'

const router = useRouter()

const totalSteps = 5
const currentStep = ref(1)
const submitting = ref(false)
const submitError = ref('')

const stepTitles = [
  'Athletic Background',
  'Skills & Abilities',
  'Career Aspirations',
  'Context & Interests',
  'Review & Submit'
]

// ── Form state ─────────────────────────────────────────────────────────────
const form = reactive({
  primary_sport: '',
  academic_level: '',
  participation_years: '',
  participation_level: '',
  fitness_level: 3,
  technical_skill: 3,
  leadership: 3,
  data_comfort: 3,
  motivation: '',
  career_importance: '',
  work_environment: '',
  biggest_challenge: '',
  injury_history: '',
  career_interests: [] as string[]
})

const errors = reactive<Record<string, string>>({})

// ── Options ────────────────────────────────────────────────────────────────
const academicLevels = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Postgraduate', 'Professional']
const participationYears = ['< 1', '1-2', '3-5', '> 5']
const participationLevels = ['Not active', 'Recreational', 'Club', 'Regional', 'National', 'Elite']

const skillFields = [
  { key: 'fitness_level', label: 'Fitness Level', hint: '1 = Very low, 5 = Elite athlete fitness' },
  { key: 'technical_skill', label: 'Technical Skill', hint: '1 = Beginner, 5 = Advanced/Elite technique' },
  { key: 'leadership', label: 'Leadership', hint: '1 = Prefer to follow, 5 = Natural leader & mentor' },
  { key: 'data_comfort', label: 'Data & Analytics Comfort', hint: '1 = Avoid data, 5 = Love working with numbers' }
]

const motivations = [
  { value: 'Coaching', label: 'Coaching others', icon: '🏋️' },
  { value: 'Health', label: 'Health & wellbeing', icon: '💚' },
  { value: 'Competition', label: 'High performance', icon: '🥇' },
  { value: 'Academic', label: 'Research & science', icon: '🔬' },
  { value: 'Fame', label: 'Media & visibility', icon: '🎙️' }
]

const careerImportance = [
  'Financial security',
  'Passion & purpose',
  'Work-life balance',
  'Career progression',
  'Social impact'
]

const workEnvironments = [
  { value: 'Field', label: 'Field', icon: '⚽' },
  { value: 'Office', label: 'Office', icon: '💼' },
  { value: 'Lab', label: 'Lab', icon: '🔬' },
  { value: 'Media', label: 'Media', icon: '🎬' },
  { value: 'Mixed', label: 'Mixed', icon: '🔄' }
]

const biggestChallenges = [
  'Lack of experience',
  'Academic pressure',
  'Financial constraints',
  'Injury & health',
  'Networking gaps',
  'Unclear goals'
]

const injuryOptions = [
  'No injuries',
  'Minor injuries',
  'Significant injuries',
  'Career-limiting injury'
]

const careerInterestOptions = [
  'Coaching & Mentoring',
  'Sports Management',
  'Data & Analytics',
  'Health & Science',
  'Media & Communication',
  'Fitness & Training',
  'Education & Teaching',
  'Nutrition',
  'Psychology',
  'Law & Governance'
]

// ── Helpers ────────────────────────────────────────────────────────────────
function toggleInterest(opt: string) {
  const idx = form.career_interests.indexOf(opt)
  if (idx > -1) {
    form.career_interests.splice(idx, 1)
  } else if (form.career_interests.length < 3) {
    form.career_interests.push(opt)
  }
}

// ── Validation ─────────────────────────────────────────────────────────────
function validateStep(step: number): boolean {
  Object.keys(errors).forEach(k => delete errors[k])

  if (step === 1) {
    if (!form.primary_sport.trim() || form.primary_sport.trim().length < 2) errors.primary_sport = 'Please enter your primary sport'
    if (!form.academic_level) errors.academic_level = 'Please select your academic level'
    if (!form.participation_years) errors.participation_years = 'Please select years of participation'
    if (!form.participation_level) errors.participation_level = 'Please select your participation level'
  }

  if (step === 3) {
    if (!form.motivation) errors.motivation = 'Please select your motivation'
    if (!form.career_importance) errors.career_importance = 'Please select what matters most'
    if (!form.work_environment) errors.work_environment = 'Please select a work environment'
  }

  if (step === 4) {
    if (!form.biggest_challenge) errors.biggest_challenge = 'Please select your biggest challenge'
    if (!form.injury_history) errors.injury_history = 'Please select your injury history'
    if (form.career_interests.length === 0) errors.career_interests = 'Please select at least one career interest'
  }

  return Object.keys(errors).length === 0
}

function nextStep() {
  if (validateStep(currentStep.value)) {
    currentStep.value++
  }
}

// ── Review summary ─────────────────────────────────────────────────────────
const reviewItems = computed(() => [
  { label: 'Sport', value: form.primary_sport },
  { label: 'Academic Level', value: form.academic_level },
  { label: 'Years Active', value: `${form.participation_years} years` },
  { label: 'Level', value: form.participation_level },
  { label: 'Fitness', value: `${form.fitness_level}/5` },
  { label: 'Technical Skill', value: `${form.technical_skill}/5` },
  { label: 'Leadership', value: `${form.leadership}/5` },
  { label: 'Data Comfort', value: `${form.data_comfort}/5` },
  { label: 'Motivation', value: form.motivation },
  { label: 'Career Priority', value: form.career_importance },
  { label: 'Work Environment', value: form.work_environment },
  { label: 'Biggest Challenge', value: form.biggest_challenge },
  { label: 'Injury History', value: form.injury_history },
  { label: 'Interests', value: form.career_interests.join(', ') }
])

// ── Submit ─────────────────────────────────────────────────────────────────
async function handleSubmit() {
  submitting.value = true
  submitError.value = ''
  try {
    const { data } = await questionnaireService.submit({ ...form })
    router.push({ name: 'Results', state: { recommendation: JSON.stringify(data.data.recommendation) } })
  } catch (err: unknown) {
    const e = err as { response?: { data?: { message?: string } }; message?: string }
    submitError.value = e.response?.data?.message ?? e.message ?? 'Submission failed. Please try again.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="flex flex-col gap-6 flex-1">
    <div>
      <h1 class="text-2xl font-bold text-slate-800">Welcome back</h1>
      <p class="text-sm text-slate-500 mt-1">Sign in to your AthleteIQ account</p>
    </div>

    <BaseAlert v-if="error" type="error" :show="!!error" dismissible @dismiss="error = ''">
      {{ error }}
    </BaseAlert>

    <form @submit.prevent="handleLogin" class="flex flex-col gap-4" novalidate>
      <BaseInput
        v-model="form.email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        autocomplete="email"
        :error="errors.email"
        required
        @blur="validateField('email')"
      />
      <div class="relative">
        <BaseInput
          v-model="form.password"
          label="Password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Your password"
          autocomplete="current-password"
          :error="errors.password"
          required
          @blur="validateField('password')"
        />
        <button
          type="button"
          class="absolute right-3 bottom-2.5 text-slate-400 hover:text-slate-600 transition-colors"
          :aria-label="showPassword ? 'Hide password' : 'Show password'"
          @click="showPassword = !showPassword"
        >
          <svg v-if="showPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
      </div>

      <BaseButton type="submit" :loading="loading" :block="true" class="mt-2">
        Sign in
      </BaseButton>
    </form>

    <p class="text-center text-sm text-slate-500 mt-auto">
      Don't have an account?
      <router-link to="/auth/register" class="text-primary-600 font-medium hover:underline">Create one</router-link>
    </p>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { isEmail, required } from '@/utils/validators'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseAlert from '@/components/BaseAlert.vue'

const { login } = useAuth()
const loading = ref(false)
const error = ref('')
const showPassword = ref(false)

const form = reactive({ email: '', password: '' })
const errors = reactive({ email: '', password: '' })

function validateField(field: 'email' | 'password') {
  if (field === 'email') {
    if (!required(form.email)) errors.email = 'Email is required'
    else if (!isEmail(form.email)) errors.email = 'Enter a valid email'
    else errors.email = ''
  }
  if (field === 'password') {
    errors.password = required(form.password) ? '' : 'Password is required'
  }
}

function validateAll(): boolean {
  validateField('email')
  validateField('password')
  return !errors.email && !errors.password
}

async function handleLogin() {
  if (!validateAll()) return
  loading.value = true
  error.value = ''
  try {
    await login(form)
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data?: { message?: string } } }
    error.value = axiosErr.response?.data?.message ?? 'Invalid email or password'
  } finally {
    loading.value = false
  }
}
</script>

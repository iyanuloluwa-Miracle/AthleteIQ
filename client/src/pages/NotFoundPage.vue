<template>
  <div class="min-h-screen flex items-center justify-center p-8 bg-slate-50">
    <div class="text-center max-w-md">
      <p class="text-8xl font-extrabold text-primary-600/20 leading-none mb-4">404</p>
      <h1 class="text-2xl font-bold text-slate-800 mb-3">Page not found</h1>
      <p class="text-slate-500 mb-8">Sorry, we couldn't find the page you're looking for.</p>
      <BaseButton @click="router.push('/')">Go to Dashboard</BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import BaseButton from '@/components/BaseButton.vue'
const router = useRouter()
</script>

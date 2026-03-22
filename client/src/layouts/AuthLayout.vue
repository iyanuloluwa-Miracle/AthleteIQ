<template>
  <div class="auth-layout min-h-screen flex flex-col lg:flex-row">
    <!-- Left branding panel (desktop only) -->
    <div class="branding-panel hidden lg:flex lg:w-[44%] xl:w-[40%] flex-col p-8 bg-white">
      <!-- Logo -->
      <router-link to="/" class="flex items-center no-underline group">
        <img src="/athleteiqLogo.svg" alt="AthleteIQ" class="h-9 w-auto" />
      </router-link>

      <!-- Hero image area -->
      <div ref="heroRef" class="hero-visual flex-1 mt-8 rounded-2xl overflow-hidden relative min-h-72">
        <!-- Background image -->
        <img
          :src="heroImage"
          :alt="isLoginPage ? 'Login visual' : 'Sign up visual'"
          class="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    </div>

    <!-- Right form panel -->
    <div class="form-panel flex-1 bg-[#f5f0e8] flex flex-col min-h-screen lg:min-h-0">
      <!-- Mobile logo header -->
      <div class="flex lg:hidden items-center gap-2.5 px-6 py-5 bg-white border-b border-[#e8e1d8]">
        <router-link to="/" class="flex items-center no-underline">
          <img src="/athleteiqLogo.svg" alt="AthleteIQ" class="h-7 w-auto" />
        </router-link>
      </div>

      <!-- Form container -->
      <div class="flex-1 flex items-center justify-center px-6 py-10 sm:px-10">
        <div class="w-full max-w-md">
          <router-view v-slot="{ Component }">
            <Transition name="auth-slide" mode="out-in">
              <component :is="Component" />
            </Transition>
          </router-view>
        </div>
      </div>

      <!-- Security badge (mobile) -->
      <div class="flex lg:hidden items-center justify-center gap-2 pb-6 text-xs text-slate-400">
        <svg viewBox="0 0 20 20" fill="currentColor" class="w-3.5 h-3.5">
          <path fill-rule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1zm3 8V5.5a3 3 0 1 0-6 0V9h6z" clip-rule="evenodd"/>
        </svg>
        <span>256-bit SSL encrypted</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { gsap } from 'gsap'

const route = useRoute()

const isLoginPage = computed(() => route.name === 'Login' || route.path.includes('/login'))
const heroImage = computed(() => isLoginPage.value ? '/login_image.webp' : '/signup_image.webp')

const heroRef = ref<HTMLElement | null>(null)

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  gsap.from(heroRef.value as Element, { opacity: 0, y: 30, duration: 0.8, ease: 'power3.out' })
})
</script>

<style scoped>
/* Hero visual */
.hero-visual {
  position: relative;
  isolation: isolate;
}



/* Auth transition */
.auth-slide-enter-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.auth-slide-leave-active {
  transition: all 0.2s ease;
}
.auth-slide-enter-from {
  opacity: 0;
  transform: translateX(24px);
}
.auth-slide-leave-to {
  opacity: 0;
  transform: translateX(-24px);
}

/* Form panel subtle texture */
.form-panel {
  background: #f5f0e8;
  background-image:
    radial-gradient(circle at 20% 80%, rgba(234, 88, 12, 0.03) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(234, 88, 12, 0.02) 0%, transparent 50%);
}
</style>

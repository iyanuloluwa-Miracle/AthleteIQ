<template>
  <div class="min-h-screen flex flex-col lg:flex-row">
    <!-- Left branding panel (desktop only) -->
    <div class="hidden lg:flex lg:w-[44%] xl:w-[40%] flex-col p-8 bg-white">
      <!-- Logo -->
      <div class="flex items-center gap-2.5">
        <span class="text-primary-600 flex">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-7 h-7">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
        </span>
        <span class="text-xl font-bold text-slate-800 tracking-tight">AthleteIQ</span>
      </div>

      <!-- Hero image area -->
      <div class="flex-1 mt-8 rounded-2xl overflow-hidden relative bg-gradient-to-br from-primary-950 via-primary-800 to-primary-500 min-h-72">
        <!-- Decorative orbs -->
        <div class="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/5"></div>
        <div class="absolute top-1/3 -left-14 w-52 h-52 rounded-full bg-white/5"></div>
        <div class="absolute -bottom-10 right-10 w-36 h-36 rounded-full bg-white/5"></div>

        <!-- Subtle sport graphic -->
        <div class="absolute top-8 right-8 opacity-10">
          <svg viewBox="0 0 96 96" fill="none" class="w-28 h-28 text-white">
            <circle cx="48" cy="48" r="44" stroke="currentColor" stroke-width="2"/>
            <circle cx="48" cy="48" r="30" stroke="currentColor" stroke-width="1.5"/>
            <circle cx="48" cy="48" r="16" stroke="currentColor" stroke-width="1.5"/>
            <path d="M4 48h88M48 4v88" stroke="currentColor" stroke-width="1.5"/>
          </svg>
        </div>

        <!-- Stats row -->
        <div class="absolute top-8 left-8 flex gap-8">
          <div>
            <p class="text-2xl font-bold text-white">10k+</p>
            <p class="text-xs text-primary-300 mt-0.5">Athletes</p>
          </div>
          <div>
            <p class="text-2xl font-bold text-white">98%</p>
            <p class="text-xs text-primary-300 mt-0.5">Satisfaction</p>
          </div>
          <div>
            <p class="text-2xl font-bold text-white">500k+</p>
            <p class="text-xs text-primary-300 mt-0.5">Careers matched</p>
          </div>
        </div>

        <!-- Bottom overlay text -->
        <div class="absolute bottom-0 inset-x-0 p-8 bg-gradient-to-t from-primary-950/90 via-primary-950/40 to-transparent">
          <h2 class="text-3xl font-bold text-white leading-snug">
            Begin Your<br/>Journey
          </h2>
          <p class="text-primary-200 text-sm mt-2 leading-relaxed opacity-90">
            Discover your next career path<br/>beyond the game.
          </p>
        </div>
      </div>

      <!-- Bottom tagline -->
      <div class="mt-6 flex items-center gap-2 text-slate-400 text-sm">
        <svg viewBox="0 0 16 16" fill="currentColor" class="w-3 h-3 text-primary-400 shrink-0">
          <path d="M8 0L9.8 5.6H16L11 9.1L12.8 14.7L8 11.2L3.2 14.7L5 9.1L0 5.6H6.2L8 0Z"/>
        </svg>
        <span>Cultivating champions, one step at a time.</span>
      </div>
    </div>

    <!-- Right form panel -->
    <div class="flex-1 bg-[#f5f0e8] flex flex-col min-h-screen lg:min-h-0">
      <!-- Mobile logo header -->
      <div class="flex lg:hidden items-center gap-2.5 px-6 py-5 bg-white border-b border-[#e8e1d8]">
        <span class="text-primary-600 flex">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-6 h-6">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
        </span>
        <span class="text-lg font-bold text-slate-800 tracking-tight">AthleteIQ</span>
      </div>

      <!-- Form container -->
      <div class="flex-1 flex items-center justify-center px-6 py-10 sm:px-10">
        <div class="w-full max-w-md">
          <router-view v-slot="{ Component }">
            <Transition name="fade" mode="out-in">
              <component :is="Component" />
            </Transition>
          </router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

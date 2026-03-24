<template>
  <div class="bg-white border border-slate-200 rounded-xl p-3.5 sm:p-5 flex items-start gap-3 sm:gap-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 min-w-0">
    <div
      class="w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0"
      :style="{ background: iconBg }"
    >
      <slot name="icon" />
    </div>
    <div class="flex-1 min-w-0">
      <p class="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wide leading-none truncate">{{ label }}</p>
      <p class="text-xl sm:text-2xl font-black text-slate-800 leading-tight mt-1 sm:mt-1.5">{{ value }}</p>
      <p v-if="change !== undefined" class="flex items-center gap-1.5 text-xs mt-1.5 sm:mt-2">
        <span
          :class="[
            'inline-flex items-center gap-0.5 font-semibold px-1.5 py-0.5 rounded-full',
            change >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          ]"
        >
          {{ change >= 0 ? '↑' : '↓' }} {{ Math.abs(change) }}%
        </span>
        <span class="text-slate-400 hidden sm:inline">vs last month</span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
  change?: number
  iconBg?: string
}>()
</script>

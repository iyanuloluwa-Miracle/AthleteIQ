import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Toast } from '@/types'

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<Toast[]>([])

  function add({ type = 'info' as Toast['type'], title = '', message, duration = 4000 }: {
    type?: Toast['type']
    title?: string
    message: string
    duration?: number
  }): number {
    const id = Date.now() + Math.random()
    toasts.value.push({ id, type, title, message })
    if (duration > 0) setTimeout(() => remove(id), duration)
    return id
  }

  function remove(id: number): void {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  const success = (message: string, title = '') => add({ type: 'success', title, message })
  const error   = (message: string, title = '') => add({ type: 'error',   title, message })
  const info    = (message: string, title = '') => add({ type: 'info',    title, message })
  const warning = (message: string, title = '') => add({ type: 'warning', title, message })

  return { toasts, add, remove, success, error, info, warning }
})

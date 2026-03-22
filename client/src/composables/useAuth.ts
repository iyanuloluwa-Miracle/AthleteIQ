import { useAuthStore } from '@/stores/authStore'
import { useToast } from '@/composables/useToast'
import { useRouter } from 'vue-router'
import { computed } from 'vue'

export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()
  const toast = useToast()

  async function login(credentials: { email: string; password: string }) {
    const result = await authStore.login(credentials)
    toast.success('Welcome back! You are now signed in.')

    // Route admin users to admin dashboard, everyone else to the standard dashboard
    if (result.user.role === 'admin') {
      await router.push({ name: 'AdminDashboard' })
    } else {
      await router.push({ name: 'Dashboard' })
    }

    return result
  }

  async function register(userData: { name: string; email: string; password: string }) {
    const result = await authStore.register(userData)
    toast.success('Account created successfully! Please sign in.')
    await router.push({ name: 'Login' })
    return result
  }

  async function logout() {
    authStore.logout()
    toast.info('You have been signed out.')
    await router.push({ name: 'Login' })
  }

  return {
    login,
    register,
    logout,
    isAuthenticated: computed(() => authStore.isAuthenticated),
    isAdmin: computed(() => authStore.user?.role === 'admin'),
    user: computed(() => authStore.user)
  }
}

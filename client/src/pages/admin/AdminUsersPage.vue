<template>
  <div>
    <!-- Page Header -->
    <div class="flex items-center justify-between mb-8">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-500 flex items-center justify-center shadow-lg shadow-primary-500/20">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" class="w-5 h-5">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>
        <div>
          <h1 class="text-2xl font-bold text-slate-800">User Management</h1>
          <p class="text-sm text-slate-500">
            <span v-if="pagination">{{ pagination.total }} users total</span>
            <span v-else>Loading…</span>
          </p>
        </div>
      </div>

      <router-link
        to="/admin"
        class="text-sm text-primary-600 font-semibold hover:text-primary-700 transition-colors flex items-center gap-1"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
          <path fill-rule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10z" clip-rule="evenodd"/>
        </svg>
        Back to Dashboard
      </router-link>
    </div>

    <!-- Error State -->
    <BaseAlert v-if="error" type="error" :show="!!error" dismissible @dismiss="error = null">
      {{ error }}
    </BaseAlert>

    <!-- Loading State -->
    <div v-if="loading && users.length === 0" class="flex items-center justify-center py-20">
      <AppSpinner size="lg" />
    </div>

    <!-- Users Table Card -->
    <BaseCard v-else>
      <div class="overflow-x-auto -mx-6 -my-6">
        <table class="w-full">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200">
              <th class="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">User</th>
              <th class="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Role</th>
              <th class="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Joined</th>
              <th class="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="u in users"
              :key="u._id"
              class="hover:bg-slate-50/50 transition-colors"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <UserAvatar :name="u.name" size="sm" />
                  <div class="min-w-0">
                    <p class="text-sm font-medium text-slate-800 truncate">{{ u.name }}</p>
                    <p class="text-xs text-slate-400 truncate">{{ u.email }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span
                  :class="roleBadgeClass(u.role)"
                  class="text-[11px] px-2.5 py-0.5 rounded-full font-medium whitespace-nowrap"
                >
                  {{ formatRole(u.role) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-slate-500">{{ formatDate(u.createdAt) }}</span>
              </td>
              <td class="px-6 py-4 text-right">
                <BaseButton
                  v-if="u.role !== 'admin'"
                  variant="danger"
                  size="sm"
                  :loading="deleting === u._id"
                  :disabled="!!deleting"
                  @click="confirmDelete(u)"
                >
                  <svg viewBox="0 0 20 20" fill="currentColor" class="w-3.5 h-3.5">
                    <path fill-rule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.519.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5z" clip-rule="evenodd"/>
                  </svg>
                  Delete
                </BaseButton>
                <span v-else class="text-xs text-slate-400 italic">Protected</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Footer -->
      <template v-if="pagination && pagination.pages > 1" #footer>
        <div class="flex items-center justify-between w-full">
          <p class="text-sm text-slate-500">
            Page {{ pagination.page }} of {{ pagination.pages }}
          </p>
          <div class="flex gap-2">
            <BaseButton
              variant="secondary"
              size="sm"
              :disabled="pagination.page <= 1 || loading"
              @click="changePage(pagination.page - 1)"
            >
              ← Previous
            </BaseButton>
            <BaseButton
              variant="secondary"
              size="sm"
              :disabled="pagination.page >= pagination.pages || loading"
              @click="changePage(pagination.page + 1)"
            >
              Next →
            </BaseButton>
          </div>
        </div>
      </template>
    </BaseCard>

    <!-- Delete Confirmation Modal -->
    <BaseModal v-model="showDeleteModal" title="Delete User">
      <p class="text-sm text-slate-600">
        Are you sure you want to delete
        <strong class="text-slate-800">{{ userToDelete?.name }}</strong>?
        This action cannot be undone.
      </p>
      <template #footer>
        <BaseButton variant="secondary" @click="showDeleteModal = false">Cancel</BaseButton>
        <BaseButton variant="danger" :loading="!!deleting" @click="handleDelete">Delete User</BaseButton>
      </template>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAdminStore } from '@/stores/adminStore'
import { useToast } from '@/composables/useToast'
import BaseCard from '@/components/BaseCard.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseModal from '@/components/BaseModal.vue'
import BaseAlert from '@/components/BaseAlert.vue'
import AppSpinner from '@/components/AppSpinner.vue'
import UserAvatar from '@/components/UserAvatar.vue'
import type { User } from '@/types'

const adminStore = useAdminStore()
const toast = useToast()
const { users, pagination, loading, error } = storeToRefs(adminStore)

const showDeleteModal = ref(false)
const userToDelete = ref<User | null>(null)
const deleting = ref<string | null>(null)

function formatRole(role: string): string {
  const labels: Record<string, string> = {
    student: 'Student',
    career_advisor: 'Advisor',
    admin: 'Admin'
  }
  return labels[role] ?? role
}

function roleBadgeClass(role: string): string {
  const map: Record<string, string> = {
    student: 'bg-emerald-50 text-emerald-700',
    career_advisor: 'bg-blue-50 text-blue-700',
    admin: 'bg-amber-50 text-amber-700'
  }
  return map[role] ?? 'bg-slate-100 text-slate-600'
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

function confirmDelete(user: User) {
  userToDelete.value = user
  showDeleteModal.value = true
}

async function handleDelete() {
  if (!userToDelete.value) return
  deleting.value = userToDelete.value._id
  try {
    await adminStore.deleteUser(userToDelete.value._id)
    toast.success(`User "${userToDelete.value.name}" has been deleted.`)
    showDeleteModal.value = false
  } catch {
    toast.error('Failed to delete user. Please try again.')
  } finally {
    deleting.value = null
    userToDelete.value = null
  }
}

async function changePage(page: number) {
  try {
    await adminStore.fetchUsers(page)
  } catch {
    // Error is already in the store
  }
}

onMounted(async () => {
  try {
    await adminStore.fetchUsers()
  } catch {
    // Error is already in the store
  }
})
</script>

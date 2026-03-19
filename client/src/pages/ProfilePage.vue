<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-slate-800">Profile</h1>
      <p class="mt-1 text-sm text-slate-500">Manage your personal information and account settings.</p>
    </div>

    <div v-if="loading && !profile" class="flex justify-center py-16">
      <AppSpinner size="lg" />
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 items-start">
      <!-- Avatar card -->
      <BaseCard>
        <div class="flex flex-col items-center text-center gap-4 pb-6 border-b border-slate-100 mb-4">
          <UserAvatar :name="form.name || user?.name || ''" size="xl" />
          <div>
            <h2 class="text-lg font-semibold text-slate-800">{{ profile?.name ?? user?.name ?? 'Athlete' }}</h2>
            <p class="text-sm text-slate-500 mt-0.5">{{ profile?.email ?? user?.email ?? '' }}</p>
            <span class="inline-block mt-2 text-xs bg-primary-50 text-primary-700 px-3 py-0.5 rounded-full font-semibold capitalize">
              {{ profile?.role ?? 'Athlete' }}
            </span>
          </div>
        </div>
        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-sm text-slate-500">Member since</span>
            <span class="text-sm font-medium text-slate-700">{{ memberSince }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-slate-500">Account type</span>
            <span class="text-sm font-medium text-slate-700 capitalize">{{ profile?.role ?? 'Athlete' }}</span>
          </div>
        </div>
      </BaseCard>

      <!-- Form section -->
      <div class="flex flex-col gap-6">
        <BaseCard title="Personal Information" subtitle="Update your display name and details.">
          <form @submit.prevent="handleSave" class="flex flex-col gap-4" novalidate>
            <BaseAlert v-if="saveError" type="error" :show="!!saveError" dismissible @dismiss="saveError = ''">
              {{ saveError }}
            </BaseAlert>
            <BaseAlert v-if="saveSuccess" type="success" :show="saveSuccess" dismissible @dismiss="saveSuccess = false">
              Profile updated successfully!
            </BaseAlert>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <BaseInput
                v-model="form.name"
                label="Full name"
                placeholder="Your name"
                :error="errors.name"
                required
                @blur="validateName"
              />
              <BaseInput
                :model-value="profile?.email ?? user?.email ?? ''"
                label="Email address"
                type="email"
                :disabled="true"
                hint="Email cannot be changed"
              />
            </div>

            <div class="flex justify-end gap-3 pt-2">
              <BaseButton variant="secondary" type="button" @click="resetForm">
                Discard
              </BaseButton>
              <BaseButton type="submit" :loading="saving">
                Save changes
              </BaseButton>
            </div>
          </form>
        </BaseCard>

        <!-- Danger zone -->
        <BaseCard title="Danger Zone">
          <p class="text-sm text-slate-500 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <BaseButton variant="danger" @click="showDeleteModal = true">
            Delete account
          </BaseButton>
        </BaseCard>
      </div>
    </div>

    <!-- Delete confirmation modal -->
    <BaseModal v-model="showDeleteModal" title="Delete Account" :persistent="true">
      <div class="flex flex-col gap-4">
        <BaseAlert type="error" :show="true">
          This action is permanent and cannot be undone. All your data will be deleted.
        </BaseAlert>
        <p class="text-sm text-slate-600">
          Type <strong class="font-semibold">DELETE</strong> to confirm:
        </p>
        <BaseInput v-model="deleteConfirm" placeholder="DELETE" />
      </div>
      <template #footer>
        <BaseButton variant="secondary" @click="showDeleteModal = false">Cancel</BaseButton>
        <BaseButton variant="danger" :disabled="deleteConfirm !== 'DELETE'" @click="handleDelete">
          Delete permanently
        </BaseButton>
      </template>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/userStore'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from '@/composables/useToast'
import { formatDate } from '@/utils/formatDate'
import { required } from '@/utils/validators'
import BaseCard from '@/components/BaseCard.vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseAlert from '@/components/BaseAlert.vue'
import BaseModal from '@/components/BaseModal.vue'
import UserAvatar from '@/components/UserAvatar.vue'
import AppSpinner from '@/components/AppSpinner.vue'

const userStore = useUserStore()
const authStore = useAuthStore()
const toast = useToast()

const { profile, loading } = storeToRefs(userStore)
const { user } = storeToRefs(authStore)

const form = reactive({ name: '' })
const errors = reactive({ name: '' })
const saving = ref(false)
const saveError = ref('')
const saveSuccess = ref(false)
const showDeleteModal = ref(false)
const deleteConfirm = ref('')

const memberSince = computed(() => formatDate(profile.value?.createdAt ?? null))

onMounted(async () => {
  await userStore.fetchProfile().catch(() => {})
  resetForm()
})

function resetForm() {
  form.name = profile.value?.name ?? user.value?.name ?? ''
  errors.name = ''
  saveError.value = ''
  saveSuccess.value = false
}

function validateName() {
  errors.name = required(form.name) ? '' : 'Name is required'
}

async function handleSave() {
  validateName()
  if (errors.name) return
  saving.value = true
  saveError.value = ''
  saveSuccess.value = false
  try {
    await userStore.updateProfile({ name: form.name })
    saveSuccess.value = true
    toast.success('Profile updated!')
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data?: { message?: string } } }
    saveError.value = axiosErr.response?.data?.message ?? 'Failed to save changes'
  } finally {
    saving.value = false
  }
}

function handleDelete() {
  authStore.logout()
  toast.info('Account deleted. Goodbye!')
  showDeleteModal.value = false
}
</script>

<template>
  <div class="dashboard-container p-4">
    <h1>Welcome to the Herrmann Family Tree</h1>
    <p>This is the dashboard. Manage your family members and their relationships.</p>

    <div class="grid mt-4">
      <div class="col-12 md:col-6 lg:col-3">
        <div class="surface-card shadow-2 p-3 border-round">
          <div class="flex justify-content-between mb-3">
            <div>
              <span class="block text-500 font-medium mb-3">Family Members</span>
              <div class="text-900 font-medium text-xl">View & Manage</div>
            </div>
            <div class="flex align-items-center justify-content-center bg-blue-100 border-round" style="width:2.5rem;height:2.5rem">
              <i class="pi pi-users text-blue-500 text-xl"></i>
            </div>
          </div>
          <Button label="Go to Persons" icon="pi pi-arrow-right" @click="goToPersons" class="p-button-sm" />
        </div>
      </div>
      <!-- Add more cards for other features like relationships, tree view etc. -->
    </div>

    <div class="mt-5">
      <Button label="Logout" icon="pi pi-sign-out" @click="handleLogout" class="p-button-danger" />
    </div>
    <p v-if="authStore.token" class="text-xs mt-4">Token: {{ authStore.token.substring(0, 30) }}...</p>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import Button from 'primevue/button';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};

const goToPersons = () => {
  router.push({ name: 'PersonsList' });
};
</script>

<style scoped>
.dashboard-container {
  text-align: center;
}
.text-xs {
  font-size: 0.75rem;
  color: var(--text-color-secondary);
}
</style>

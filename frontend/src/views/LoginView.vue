<template>
  <div class="login-container flex align-items-center justify-content-center">
    <div class="card p-fluid">
      <h5 class="text-center">Login - Herrmann Family Tree</h5>
      <div class="field">
        <label for="password">Password</label>
        <Password id="password" v-model="password" :feedback="false" toggleMask @keyup.enter="handleLogin" />
      </div>
      <Button label="Login" icon="pi pi-sign-in" @click="handleLogin" :loading="loading" />
      <small v-if="errorMessage" class="p-error text-center mt-2">{{ errorMessage }}</small>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Button from 'primevue/button';
import Password from 'primevue/password';
import { useAuthStore } from '@/stores/auth'; // Adjusted path

const password = ref('');
const errorMessage = ref('');
const loading = ref(false);
const router = useRouter();
const authStore = useAuthStore();

const handleLogin = async () => {
  loading.value = true;
  errorMessage.value = '';
  try {
    // Assuming backend is running on http://localhost:3000
    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password: password.value }),
    });

    const data = await response.json();

    if (response.ok) {
      authStore.login(data.token);
      router.push('/dashboard');
    } else {
      errorMessage.value = data.message || 'Login failed.';
    }
  } catch (error) {
    console.error('Login error:', error);
    errorMessage.value = 'An error occurred. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background-color: var(--surface-ground);
}
.card {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}
.p-error {
  display: block; /* Make sure error message takes full width for centering */
}
</style>

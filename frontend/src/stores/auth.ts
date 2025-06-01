// src/stores/auth.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(localStorage.getItem('isAuthenticated') === 'true');
  const token = ref(localStorage.getItem('token') || '');

  function login(newToken: string) {
    isAuthenticated.value = true;
    token.value = newToken;
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('token', newToken);
  }

  function logout() {
    isAuthenticated.value = false;
    token.value = '';
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('token');
  }

  return { isAuthenticated, token, login, logout };
});

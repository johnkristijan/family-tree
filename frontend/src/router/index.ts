import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import DashboardView from '../views/DashboardView.vue';
import PersonsListView from '../views/PersonsListView.vue'; // New
import PersonFormView from '../views/PersonFormView.vue'; // New
import { useAuthStore } from '../stores/auth';

const routes = [
  { path: '/', redirect: '/dashboard' }, // Default to dashboard if logged in, else login
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    beforeEnter: (to, from, next) => {
      const authStore = useAuthStore();
      if (authStore.isAuthenticated) {
        next('/dashboard');
      } else {
        next();
      }
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  },
  {
    path: '/persons',
    name: 'PersonsList',
    component: PersonsListView,
    meta: { requiresAuth: true }
  },
  {
    path: '/persons/new',
    name: 'PersonCreate',
    component: PersonFormView,
    meta: { requiresAuth: true }
  },
  {
    path: '/persons/edit/:id',
    name: 'PersonEdit',
    component: PersonFormView,
    meta: { requiresAuth: true },
    props: true // Pass route params as props
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  // Ensure Pinia store is initialized before router guards, especially on first load.
  // This might require main.ts to initialize Pinia before router.
  // For now, assume authStore can be instantiated here.
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export default router;

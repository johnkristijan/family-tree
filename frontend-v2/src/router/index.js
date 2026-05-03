import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import PersonsView from '../views/PersonsView.vue'
import PersonDetailView from '../views/PersonDetailView.vue'
import FamilyTreeView from '../views/FamilyTreeView.vue'
import CalendarView from '../views/CalendarView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/calendar',
    name: 'Calendar',
    component: CalendarView
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView
  },
  {
    path: '/persons',
    name: 'Persons',
    component: PersonsView
  },
  {
    path: '/persons/:id',
    name: 'PersonDetail',
    component: PersonDetailView
  },
  {
    path: '/persons/:id/family-tree',
    name: 'FamilyTree',
    component: FamilyTreeView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
<template>
  <div class="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 py-12 px-4">
    <div class="max-w-6xl mx-auto">
      
      <!-- Hero Section -->
      <div class="text-center mb-16">
        <div class="text-6xl mb-6">🌳</div>
        <h1 class="text-6xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
          Herrmann.no Family
        </h1>
        <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Discover, document, and celebrate your family's unique story. Build connections across generations and preserve your heritage for future generations.
        </p>
        
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link 
            to="/persons"
            class="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            👥 View Family Members
          </router-link>
          <button 
            @click="showPersonForm = true"
            class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            ➕ Add New Member
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        <span class="ml-3 text-gray-600">Loading family data...</span>
      </div>

      <!-- Family Statistics -->
      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div class="bg-white rounded-xl shadow-lg p-8 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
          <div class="text-emerald-500 text-4xl mb-4">👨‍👩‍👧‍👦</div>
          <h3 class="text-2xl font-bold text-gray-800 mb-2">{{ personsCount || 0 }}</h3>
          <p class="text-gray-600">Family Members</p>
        </div>
        <div class="bg-white rounded-xl shadow-lg p-8 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
          <div class="text-blue-500 text-4xl mb-4">🤝</div>
          <h3 class="text-2xl font-bold text-gray-800 mb-2">{{ relationshipsCount || 0 }}</h3>
          <p class="text-gray-600">Relationships</p>
        </div>
        <div class="bg-white rounded-xl shadow-lg p-8 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
          <div class="text-purple-500 text-4xl mb-4">🏛️</div>
          <h3 class="text-2xl font-bold text-gray-800 mb-2">{{ generationsCount || 0 }}</h3>
          <p class="text-gray-600">Generations</p>
        </div>
      </div>

      <!-- Recent Family Members -->
      <div v-if="recentPersons.length > 0" class="mb-16">
        <h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">Recently Added</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="person in recentPersons"
            :key="person.id"
            class="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            @click="goToPersonDetail(person.id)"
          >
            <div class="flex items-center mb-4">
              <div class="bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold mr-4">
                {{ getInitials(person.first_name, person.last_name) }}
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">
                  {{ person.first_name }} {{ person.last_name }}
                </h3>
                <p class="text-sm text-gray-600">
                  {{ person.profession || 'Family Member' }}
                </p>
              </div>
            </div>
            <p v-if="person.bio" class="text-gray-700 text-sm line-clamp-2">
              {{ person.bio }}
            </p>
            <div class="mt-4 flex justify-between items-center text-xs text-gray-500">
              <span v-if="person.birth_date">Born {{ formatDate(person.birth_date) }}</span>
              <span class="text-emerald-600 hover:text-emerald-700">View Details →</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Features Section -->
      <div class="mb-16">
        <h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">What You Can Do</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300 text-center">
            <div class="text-emerald-500 text-4xl mb-4">👤</div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">Add Members</h3>
            <p class="text-gray-600 text-sm">Document family members with detailed information, photos, and biographies</p>
          </div>
          <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300 text-center">
            <div class="text-blue-500 text-4xl mb-4">🔗</div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">Connect Relations</h3>
            <p class="text-gray-600 text-sm">Link family members through marriages, parent-child relationships, and more</p>
          </div>
          <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300 text-center">
            <div class="text-purple-500 text-4xl mb-4">🔍</div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">Search & Explore</h3>
            <p class="text-gray-600 text-sm">Easily find family members by name, profession, location, or biography</p>
          </div>
          <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300 text-center">
            <div class="text-orange-500 text-4xl mb-4">📚</div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">Preserve Stories</h3>
            <p class="text-gray-600 text-sm">Keep family stories, memories, and important dates for future generations</p>
          </div>
        </div>
      </div>

      <!-- Getting Started -->
      <div v-if="personsCount === 0" class="bg-white rounded-xl shadow-lg p-8 border border-gray-200 text-center">
        <div class="text-6xl mb-6">�</div>
        <h2 class="text-3xl font-bold text-gray-900 mb-4">Start Your Family Tree</h2>
        <p class="text-gray-600 mb-8 max-w-2xl mx-auto">
          Begin your family's digital legacy today. Add your first family member and watch your tree grow with memories, connections, and stories.
        </p>
        <button 
          @click="showPersonForm = true"
          class="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
        >
          🌿 Plant Your First Branch
        </button>
      </div>
    </div>
    
    <!-- Person Form Modal -->
    <PersonForm 
      :is-open="showPersonForm"
      @close="showPersonForm = false"
      @submit="handlePersonSubmit"
    />
  </div>
</template>

<script>
import { usePersonsStore } from '../stores/persons'
import { useRelationshipsStore } from '../stores/relationships'
import { storeToRefs } from 'pinia'
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import PersonForm from '../components/PersonForm.vue'
import { useToast } from '../composables/useToast'

export default {
  name: 'HomeView',
  components: {
    PersonForm
  },
  setup() {
    const router = useRouter()
    const personsStore = usePersonsStore()
    const relationshipsStore = useRelationshipsStore()
    const { persons, loading, personsCount } = storeToRefs(personsStore)
    const { relationships } = storeToRefs(relationshipsStore)
    const { fetchPersons, createPerson } = personsStore
    const { showSuccess, showError } = useToast()
    
    const showPersonForm = ref(false)

    // Computed properties for statistics
    const relationshipsCount = computed(() => relationships.value.length)
    
    const generationsCount = computed(() => {
      if (persons.value.length === 0) return 0
      // Simple heuristic: count unique birth decades as a rough generation count
      const birthDecades = new Set()
      persons.value.forEach(person => {
        if (person.birth_date) {
          const year = new Date(person.birth_date).getFullYear()
          const decade = Math.floor(year / 10) * 10
          birthDecades.add(decade)
        }
      })
      return Math.max(birthDecades.size, 1)
    })

    const recentPersons = computed(() => {
      // Show the 3 most recently added persons (assuming higher ID = more recent)
      return [...persons.value]
        .sort((a, b) => b.id - a.id)
        .slice(0, 3)
    })

    function formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }

    function getInitials(firstName, lastName) {
      const first = firstName ? firstName.charAt(0).toUpperCase() : ''
      const last = lastName ? lastName.charAt(0).toUpperCase() : ''
      return first + last
    }

    function goToPersonDetail(personId) {
      router.push(`/persons/${personId}`)
    }

    async function handlePersonSubmit(personData) {
      try {
        await createPerson(personData)
        showPersonForm.value = false
        showSuccess('Family member added successfully!')
      } catch (error) {
        console.error('Failed to create person:', error)
        showError('Failed to add family member. Please try again.')
      }
    }

    onMounted(() => {
      fetchPersons()
    })

    return {
      persons,
      loading,
      personsCount,
      relationshipsCount,
      generationsCount,
      recentPersons,
      showPersonForm,
      formatDate,
      getInitials,
      goToPersonDetail,
      handlePersonSubmit
    }
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 2;
}
</style>


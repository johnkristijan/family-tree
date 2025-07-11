<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Family Members</h1>
        <p class="mt-2 text-gray-600">Manage your family tree members</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span class="ml-4 text-gray-600">Loading family members...</span>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
        <div class="flex">
          <div class="text-red-400">
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Error loading family members</h3>
            <p class="text-sm text-red-700 mt-1">{{ error }}</p>
            <button @click="fetchPersons" class="mt-2 text-sm text-red-600 hover:text-red-500 font-medium">
              Try again
            </button>
          </div>
        </div>
      </div>

      <!-- Success State -->
      <div v-else>
        <div class="mb-6 bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Total Family Members</p>
              <p class="text-2xl font-bold text-gray-900">{{ personsCount }}</p>
            </div>
            <button 
              @click="showPersonForm = true"
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
            >
              Add New Member
            </button>
          </div>
        </div>

        <!-- Search Bar -->
        <div class="mb-6 bg-white rounded-lg shadow p-6">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search family members by name, profession, location, or biography..."
              class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div v-if="searchQuery" class="absolute inset-y-0 right-0 pr-3 flex items-center">
              <button
                @click="searchQuery = ''"
                class="text-gray-400 hover:text-gray-600"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <div v-if="searchQuery" class="mt-3 text-sm text-gray-600">
            Found {{ filteredPersons.length }} of {{ personsCount }} family members
          </div>
        </div>

        <!-- Persons Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="person in filteredPersons"
            :key="person.id"
            class="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6 border border-gray-200 cursor-pointer"
            @click="goToPersonDetail(person.id)"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                  {{ person.first_name }} {{ person.last_name }}
                  <span v-if="person.maiden_name" class="text-sm text-gray-500 font-normal">
                    ({{ person.maiden_name }})
                  </span>
                </h3>
                
                <div class="space-y-1 text-sm text-gray-600">
                  <p v-if="person.birth_date">
                    <span class="font-medium">Born:</span> {{ formatDate(person.birth_date) }}
                  </p>
                  <p v-if="person.death_date">
                    <span class="font-medium">Died:</span> {{ formatDate(person.death_date) }}
                  </p>
                  <p v-if="person.gender">
                    <span class="font-medium">Gender:</span> {{ person.gender }}
                  </p>
                  <p v-if="person.profession">
                    <span class="font-medium">Profession:</span> {{ person.profession }}
                  </p>
                  <p v-if="person.location">
                    <span class="font-medium">Location:</span> {{ person.location }}
                  </p>
                </div>

                <p v-if="person.bio" class="mt-3 text-sm text-gray-700 line-clamp-3">
                  {{ person.bio }}
                </p>
              </div>
              
              <div class="ml-4 flex-shrink-0">
                <div class="flex items-center space-x-2">
                  <button 
                    @click.stop="editPerson(person)"
                    class="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button 
                    @click.stop="deletePerson(person.id)"
                    class="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Click to view indicator -->
            <div class="mt-4 pt-4 border-t border-gray-100">
              <div class="flex items-center text-xs text-gray-500">
                <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Click to view details
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="persons.length === 0" class="text-center py-12">
          <div class="text-gray-400 text-6xl mb-4">👥</div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No family members yet</h3>
          <p class="text-gray-600 mb-4">Start building your family tree by adding your first family member.</p>
          <button 
            @click="showPersonForm = true"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
          >
            Add First Member
          </button>
        </div>

        <!-- No Search Results -->
        <div v-else-if="filteredPersons.length === 0 && searchQuery" class="text-center py-12">
          <div class="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No family members found</h3>
          <p class="text-gray-600 mb-4">Try adjusting your search terms or add a new family member.</p>
          <div class="flex justify-center space-x-4">
            <button 
              @click="searchQuery = ''"
              class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors"
            >
              Clear Search
            </button>
            <button 
              @click="showPersonForm = true"
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
            >
              Add New Member
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Person Form Modal -->
    <PersonForm 
      :is-open="showPersonForm"
      :person="editingPerson"
      @close="closePersonForm"
      @submit="handlePersonSubmit"
    />
  </div>
</template>

<script>
import { usePersonsStore } from '../stores/persons'
import { storeToRefs } from 'pinia'
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import PersonForm from '../components/PersonForm.vue'
import { useToast } from '../composables/useToast'

export default {
  name: 'PersonsView',
  components: {
    PersonForm
  },
  setup() {
    const router = useRouter()
    const personsStore = usePersonsStore()
    const { persons, loading, error, personsCount } = storeToRefs(personsStore)
    const { fetchPersons, createPerson, updatePerson, deletePerson: deletePersonFromStore } = personsStore
    const { showSuccess, showError, showConfirm } = useToast()
    
    const showPersonForm = ref(false)
    const editingPerson = ref(null)
    const searchQuery = ref('')

    onMounted(() => {
      fetchPersons()
    })

    function formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    function goToPersonDetail(personId) {
      router.push(`/persons/${personId}`)
    }

    function editPerson(person) {
      editingPerson.value = person
      showPersonForm.value = true
    }

    function closePersonForm() {
      showPersonForm.value = false
      editingPerson.value = null
    }

    async function handlePersonSubmit(personData) {
      try {
        if (personData.id) {
          // Edit existing person
          await updatePerson(personData.id, personData)
          showSuccess('Person updated successfully!')
        } else {
          // Create new person
          await createPerson(personData)
          showSuccess('Person created successfully!')
        }
        closePersonForm()
      } catch (error) {
        throw error // Let the PersonForm handle the error display
      }
    }

    async function deletePerson(personId) {
      const isConfirmed = await showConfirm('Are you sure you want to delete this person?')
      if (isConfirmed) {
        try {
          await deletePersonFromStore(personId)
          showSuccess('Person deleted successfully!')
        } catch (error) {
          showError('Failed to delete person: ' + error.message)
        }
      }
    }

    // Computed property for filtered persons based on search query
    const filteredPersons = computed(() => {
      if (!searchQuery.value.trim()) {
        return persons.value
      }
      
      const query = searchQuery.value.toLowerCase().trim()
      return persons.value.filter(person => {
        const fullName = `${person.first_name} ${person.last_name}`.toLowerCase()
        const maidenName = person.maiden_name?.toLowerCase() || ''
        const profession = person.profession?.toLowerCase() || ''
        const location = person.location?.toLowerCase() || ''
        const bio = person.bio?.toLowerCase() || ''
        
        return fullName.includes(query) ||
               maidenName.includes(query) ||
               profession.includes(query) ||
               location.includes(query) ||
               bio.includes(query)
      })
    })

    return {
      persons,
      loading,
      error,
      personsCount,
      showPersonForm,
      editingPerson,
      searchQuery,
      filteredPersons,
      fetchPersons,
      formatDate,
      goToPersonDetail,
      editPerson,
      closePersonForm,
      handlePersonSubmit,
      deletePerson
    }
  }
}
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 3;
}
</style>
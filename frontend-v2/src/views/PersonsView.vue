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
            <button @click="fetchPersons" class="mt-2 text-sm text-red-600 hover:text-red-500 font-medium cursor-pointer">
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
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors cursor-pointer"
            >
              Add New Member
            </button>
          </div>
        </div>

        <!-- Search and Filter Bar -->
        <div class="mb-6 bg-white rounded-lg shadow p-6">
          <!-- Search Input -->
          <div class="relative mb-4">
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
                class="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Filters and Sort Section -->
          <div class="border-t border-gray-200 pt-4">
            <div class="flex flex-wrap items-center gap-4 filter-section">
              <!-- Gender Filter -->
              <div class="flex items-center space-x-2">
                <label class="text-sm font-medium text-gray-700">Gender:</label>
                <select
                  v-model="filters.gender"
                  class="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                >
                  <option value="">All</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <!-- Age Filter -->
              <div class="flex items-center space-x-2">
                <label class="text-sm font-medium text-gray-700">Age:</label>
                <input
                  v-model="filters.ageMin"
                  type="number"
                  placeholder="Min"
                  class="w-16 text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <span class="text-sm text-gray-500">-</span>
                <input
                  v-model="filters.ageMax"
                  type="number"
                  placeholder="Max"
                  class="w-16 text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <!-- Birth Year Filter -->
              <div class="flex items-center space-x-2">
                <label class="text-sm font-medium text-gray-700">Birth Year:</label>
                <select
                  v-model="filters.birthYearType"
                  class="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                >
                  <option value="">All</option>
                  <option value="before">Before</option>
                  <option value="after">After</option>
                  <option value="between">Between</option>
                </select>
                <input
                  v-if="filters.birthYearType === 'before' || filters.birthYearType === 'after'"
                  v-model="filters.birthYear"
                  type="number"
                  placeholder="Year"
                  class="w-20 text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <template v-if="filters.birthYearType === 'between'">
                  <input
                    v-model="filters.birthYearStart"
                    type="number"
                    placeholder="Start"
                    class="w-20 text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span class="text-sm text-gray-500">-</span>
                  <input
                    v-model="filters.birthYearEnd"
                    type="number"
                    placeholder="End"
                    class="w-20 text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </template>
              </div>

              <!-- Sort Options -->
              <div class="flex items-center space-x-2">
                <label class="text-sm font-medium text-gray-700">Sort by:</label>
                <select
                  v-model="sortBy"
                  class="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                >
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="birth-asc">Birth Date (Oldest First)</option>
                  <option value="birth-desc">Birth Date (Newest First)</option>
                  <option value="id-asc">ID (Low to High)</option>
                  <option value="id-desc">ID (High to Low)</option>
                  <option value="relationships-asc">Relationships (Few to Many)</option>
                  <option value="relationships-desc">Relationships (Many to Few)</option>
                </select>
              </div>

              <!-- Clear Filters Button -->
              <button
                @click="clearFilters"
                class="text-sm text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          </div>

          <!-- Results Summary -->
          <div class="mt-3 text-sm text-gray-600">
            Showing {{ filteredAndSortedPersons.length }} of {{ personsCount }} family members
            <span v-if="hasActiveFilters" class="text-blue-600">(filtered)</span>
          </div>
        </div>

        <!-- Persons Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="person in filteredAndSortedPersons"
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
                  <p class="text-xs text-gray-500 mt-2">
                    <span class="font-medium">ID:</span> {{ person.id }}
                  </p>
                  <p class="text-xs text-gray-500">
                    <span class="font-medium">Relationships:</span> {{ person.relationships_count || 0 }}
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
                    class="text-blue-600 hover:text-blue-800 text-sm font-medium cursor-pointer"
                  >
                    Edit
                  </button>
                  <button 
                    @click.stop="deletePerson(person.id)"
                    class="text-red-600 hover:text-red-800 text-sm font-medium cursor-pointer"
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
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors cursor-pointer"
          >
            Add First Member
          </button>
        </div>

        <!-- No Search Results -->
        <div v-else-if="filteredAndSortedPersons.length === 0 && (searchQuery || hasActiveFilters)" class="text-center py-12">
          <div class="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No family members found</h3>
          <p class="text-gray-600 mb-4">Try adjusting your search terms or filters, or add a new family member.</p>
          <div class="flex justify-center space-x-4">
            <button 
              @click="clearAllFilters"
              class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors cursor-pointer"
            >
              Clear All Filters
            </button>
            <button 
              @click="showPersonForm = true"
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors cursor-pointer"
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
    const sortBy = ref('name-asc')
    
    // Filter reactive objects
    const filters = ref({
      gender: '',
      ageMin: '',
      ageMax: '',
      birthYearType: '',
      birthYear: '',
      birthYearStart: '',
      birthYearEnd: ''
    })

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
               location.includes(query)
            //    bio.includes(query)
      })
    })

    // Helper function to calculate age
    function calculateAge(birthDate, deathDate) {
      if (!birthDate) return null
      
      const birth = new Date(birthDate)
      const end = deathDate ? new Date(deathDate) : new Date()
      return Math.floor((end - birth) / (365.25 * 24 * 60 * 60 * 1000))
    }

    // Helper function to get birth year
    function getBirthYear(birthDate) {
      if (!birthDate) return null
      return new Date(birthDate).getFullYear()
    }

    // Computed property for filtered and sorted persons
    const filteredAndSortedPersons = computed(() => {
      let result = filteredPersons.value

      // Apply filters
      if (filters.value.gender) {
        result = result.filter(person => 
          person.gender?.toLowerCase() === filters.value.gender.toLowerCase()
        )
      }

      // Age filter
      if (filters.value.ageMin || filters.value.ageMax) {
        result = result.filter(person => {
          const age = calculateAge(person.birth_date, person.death_date)
          if (age === null) return false
          
          const minAge = filters.value.ageMin ? parseInt(filters.value.ageMin) : 0
          const maxAge = filters.value.ageMax ? parseInt(filters.value.ageMax) : Infinity
          
          return age >= minAge && age <= maxAge
        })
      }

      // Birth year filter
      if (filters.value.birthYearType && filters.value.birthYear) {
        result = result.filter(person => {
          const birthYear = getBirthYear(person.birth_date)
          if (birthYear === null) return false
          
          const filterYear = parseInt(filters.value.birthYear)
          
          switch (filters.value.birthYearType) {
            case 'before':
              return birthYear < filterYear
            case 'after':
              return birthYear > filterYear
            default:
              return true
          }
        })
      }

      // Birth year between filter
      if (filters.value.birthYearType === 'between' && filters.value.birthYearStart && filters.value.birthYearEnd) {
        result = result.filter(person => {
          const birthYear = getBirthYear(person.birth_date)
          if (birthYear === null) return false
          
          const startYear = parseInt(filters.value.birthYearStart)
          const endYear = parseInt(filters.value.birthYearEnd)
          
          return birthYear >= startYear && birthYear <= endYear
        })
      }

      // Apply sorting
      result.sort((a, b) => {
        switch (sortBy.value) {
          case 'name-asc':
            return `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`)
          case 'name-desc':
            return `${b.first_name} ${b.last_name}`.localeCompare(`${a.first_name} ${a.last_name}`)
          case 'birth-asc':
            if (!a.birth_date && !b.birth_date) return 0
            if (!a.birth_date) return 1
            if (!b.birth_date) return -1
            return new Date(a.birth_date) - new Date(b.birth_date)
          case 'birth-desc':
            if (!a.birth_date && !b.birth_date) return 0
            if (!a.birth_date) return 1
            if (!b.birth_date) return -1
            return new Date(b.birth_date) - new Date(a.birth_date)
          case 'id-asc':
            return a.id - b.id
          case 'id-desc':
            return b.id - a.id
          case 'relationships-asc':
            return (a.relationships_count || 0) - (b.relationships_count || 0)
          case 'relationships-desc':
            return (b.relationships_count || 0) - (a.relationships_count || 0)
          default:
            return 0
        }
      })

      return result
    })

    // Computed property to check if any filters are active
    const hasActiveFilters = computed(() => {
      return !!(
        filters.value.gender ||
        filters.value.ageMin ||
        filters.value.ageMax ||
        filters.value.birthYearType ||
        filters.value.birthYear ||
        filters.value.birthYearStart ||
        filters.value.birthYearEnd
      )
    })

    // Function to clear all filters
    function clearFilters() {
      filters.value = {
        gender: '',
        ageMin: '',
        ageMax: '',
        birthYearType: '',
        birthYear: '',
        birthYearStart: '',
        birthYearEnd: ''
      }
    }

    // Function to clear all filters and search
    function clearAllFilters() {
      clearFilters()
      searchQuery.value = ''
    }

    return {
      persons,
      loading,
      error,
      personsCount,
      showPersonForm,
      editingPerson,
      searchQuery,
      sortBy,
      filters,
      filteredPersons,
      filteredAndSortedPersons,
      hasActiveFilters,
      fetchPersons,
      formatDate,
      goToPersonDetail,
      editPerson,
      closePersonForm,
      handlePersonSubmit,
      deletePerson,
      clearFilters,
      clearAllFilters
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

/* Responsive filter layout */
@media (max-width: 768px) {
  .filter-section {
    flex-direction: column;
    gap: 1rem;
  }
  
  .filter-section > div {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-section select,
  .filter-section input {
    width: 100%;
  }
}
</style>
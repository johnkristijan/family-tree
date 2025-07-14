<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Back Button -->
      <div class="mb-6">
        <router-link 
          to="/persons"
          class="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Family Members
        </router-link>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span class="ml-4 text-gray-600">Loading person details...</span>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
        <div class="flex">
          <div class="text-red-400">
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Error loading person details</h3>
            <p class="text-sm text-red-700 mt-1">{{ error }}</p>
          </div>
        </div>
      </div>

      <!-- Person Details -->
      <div v-else-if="person" class="space-y-6">
        
        <!-- Main Info Card -->
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          <div class="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
            <div class="flex items-center">
              <!-- Profile Picture or Initials -->
              <div class="relative">
                <div v-if="person.main_photo" class="w-20 h-20 rounded-full overflow-hidden mr-6">
                  <img 
                    :src="getProfilePictureUrl(person.main_photo)" 
                    :alt="`${person.first_name} ${person.last_name}`"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div v-else class="w-20 h-20 bg-white rounded-full flex items-center justify-center text-2xl font-bold text-blue-600 mr-6">
                  {{ getInitials(person.first_name, person.last_name) }}
                </div>
              </div>
              <div>
                <h1 class="text-3xl font-bold text-white">
                  {{ person.first_name }} {{ person.last_name }}
                </h1>
                <p v-if="person.maiden_name" class="text-blue-100 text-lg">
                  Maiden name: {{ person.maiden_name }}
                </p>
                <p v-if="person.profession" class="text-blue-100">
                  {{ person.profession }}
                </p>
                <p class="text-blue-100 mt-2">
                  {{ getAgeString(person.birth_date, person.death_date) }}
                </p>
              </div>
            </div>
          </div>

          <div class="px-6 py-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <!-- Personal Information -->
              <div class="space-y-4">
                <h2 class="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Personal Information
                </h2>
                
                <div class="space-y-3">
                  <div v-if="person.birth_date" class="flex items-center">
                    <svg class="h-5 w-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p class="text-sm text-gray-500">Date of Birth</p>
                      <p class="font-medium text-gray-900">{{ formatDate(person.birth_date) }}</p>
                    </div>
                  </div>
                  
                  <div v-if="person.death_date" class="flex items-center">
                    <svg class="h-5 w-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p class="text-sm text-gray-500">Date of Death</p>
                      <p class="font-medium text-gray-900">{{ formatDate(person.death_date) }}</p>
                    </div>
                  </div>
                  
                  <div v-if="person.gender" class="flex items-center">
                    <svg class="h-5 w-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <div>
                      <p class="text-sm text-gray-500">Gender</p>
                      <p class="font-medium text-gray-900">{{ person.gender }}</p>
                    </div>
                  </div>
                  
                  <div v-if="person.profession" class="flex items-center">
                    <svg class="h-5 w-5 text-purple-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                    </svg>
                    <div>
                      <p class="text-sm text-gray-500">Profession</p>
                      <p class="font-medium text-gray-900">{{ person.profession }}</p>
                    </div>
                  </div>
                  
                  <div v-if="person.location" class="flex items-center">
                    <svg class="h-5 w-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p class="text-sm text-gray-500">Location</p>
                      <p class="font-medium text-gray-900">{{ person.location }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Quick Actions -->
              <div class="space-y-4">
                <h2 class="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Quick Actions
                </h2>
                
                <div class="space-y-3">
                  <button 
                    @click="showEditForm = true"
                    class="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                  >
                    <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Details
                  </button>
                  
                  <button 
                    @click="$router.push(`/persons/${person.id}/family-tree`)"
                    class="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                  >
                    <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7m0 0V5a2 2 0 012-2h6l2 2h6a2 2 0 012 2v2M3 7h18M5 9h14" />
                    </svg>
                    View Family Tree
                  </button>
                  
                  <button 
                    @click="showPhotoUpload = true"
                    class="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                  >
                    <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {{ person.main_photo ? 'Change Photo' : 'Add Photo' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Biography Section -->
        <div v-if="person.bio" class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <svg class="h-5 w-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Biography
          </h2>
          <div class="prose prose-gray max-w-none">
            <p class="text-gray-700 leading-relaxed">{{ person.bio }}</p>
          </div>
        </div>

        <!-- Relationships Section -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-gray-900 flex items-center">
              <svg class="h-5 w-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Family Relationships
            </h2>
            <button 
              @click="showAddRelationship = true"
              class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors"
            >
              Add Relationship
            </button>
          </div>
          
          <!-- Loading relationships -->
          <div v-if="relationshipsLoading" class="text-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p class="text-gray-500 mt-2">Loading relationships...</p>
          </div>
          
          <!-- No relationships -->
          <div v-else-if="personRelationships.length === 0" class="text-center py-8 text-gray-500">
            <svg class="h-16 w-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p>No relationships added yet</p>
            <p class="text-sm mt-2">Click "Add Relationship" to connect family members</p>
          </div>
          
          <!-- Relationships list -->
          <div v-else class="space-y-3">
            <div 
              v-for="relationship in personRelationships" 
              :key="relationship.id"
              class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <router-link 
                :to="`/persons/${getRelatedPersonId(relationship)}`"
                class="flex items-center flex-1 cursor-pointer"
              >
                <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold mr-3">
                  {{ getPersonInitials(relationship) }}
                </div>
                <div>
                  <p class="font-medium text-gray-900 hover:text-blue-600 transition-colors">
                    {{ getRelatedPersonName(relationship) }}
                  </p>
                  <p class="text-sm text-gray-600">
                    {{ formatRelationshipType(relationship.relationship_type) }}
                    <span v-if="relationship.start_date" class="text-gray-500">
                      (since {{ formatDate(relationship.start_date) }})
                    </span>
                  </p>
                </div>
              </router-link>
              <button 
                @click="deleteRelationship(relationship.id)"
                class="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50 transition-colors ml-2"
                title="Delete relationship"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
    
    <!-- Add Relationship Modal -->
    <AddRelationship 
      :is-open="showAddRelationship"
      :current-person-id="parseInt(route.params.id)"
      @close="showAddRelationship = false"
      @submit="handleAddRelationship"
    />
    
    <!-- Edit Person Modal -->
    <PersonForm 
      :is-open="showEditForm"
      :person="person"
      @close="showEditForm = false"
      @submit="handleEditPerson"
    />
    
    <!-- Photo Upload Modal -->
    <div v-if="showPhotoUpload" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
            {{ person.main_photo ? 'Change Profile Photo' : 'Add Profile Photo' }}
          </h3>
          
          <!-- Current Photo Preview -->
          <div v-if="person.main_photo" class="mb-4">
            <p class="text-sm text-gray-600 mb-2">Current photo:</p>
            <div class="flex items-center justify-center">
              <img 
                :src="getProfilePictureUrl(person.main_photo)" 
                alt="Current profile"
                class="max-w-full h-32 rounded-lg object-cover"
              />
            </div>
          </div>
          
          <!-- File Upload -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Select new photo
            </label>
            <input
              type="file"
              ref="fileInput"
              @change="handleFileSelect"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
            />
            <p class="mt-1 text-xs text-gray-500">
              Supported formats: JPEG, PNG, GIF, WebP (max 5MB)
            </p>
          </div>
          
          <!-- Preview of selected file -->
          <div v-if="selectedFilePreview" class="mb-4">
            <p class="text-sm text-gray-600 mb-2">Preview:</p>
            <div class="flex items-center justify-center">
              <img 
                :src="selectedFilePreview" 
                alt="Preview"
                class="max-w-full h-32 rounded-lg object-cover"
              />
            </div>
          </div>
          
          <!-- Upload Progress -->
          <div v-if="uploadProgress > 0 && uploadProgress < 100" class="mb-4">
            <div class="bg-gray-200 rounded-full h-2.5">
              <div 
                class="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                :style="`width: ${uploadProgress}%`"
              ></div>
            </div>
            <p class="text-sm text-gray-600 mt-1">Uploading... {{ uploadProgress }}%</p>
          </div>
          
          <!-- Actions -->
          <div class="flex justify-between mt-6">
            <div>
              <button
                v-if="person.main_photo"
                @click="confirmRemovePhoto"
                :disabled="uploading"
                class="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
              >
                Remove Photo
              </button>
            </div>
            <div class="flex gap-2">
              <button
                @click="closePhotoModal"
                :disabled="uploading"
                class="px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                @click="uploadPhoto"
                :disabled="!selectedFile || uploading"
                class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {{ uploading ? 'Uploading...' : 'Upload Photo' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useRelationshipsStore } from '../stores/relationships'
import { usePersonsStore } from '../stores/persons'
import { storeToRefs } from 'pinia'
import apiService from '../services/api'
import AddRelationship from '../components/AddRelationship.vue'
import PersonForm from '../components/PersonForm.vue'
import { useToast } from '../composables/useToast'

export default {
  name: 'PersonDetailView',
  components: {
    AddRelationship,
    PersonForm
  },
  setup() {
    const route = useRoute()
    const person = ref(null)
    const loading = ref(true)
    const error = ref(null)
    const showAddRelationship = ref(false)
    const showEditForm = ref(false)
    const showPhotoUpload = ref(false)
    const selectedFile = ref(null)
    const selectedFilePreview = ref(null)
    const uploading = ref(false)
    const uploadProgress = ref(0)
    const fileInput = ref(null)
    const { showSuccess, showError, showConfirm } = useToast()
    
    const relationshipsStore = useRelationshipsStore()
    const personsStore = usePersonsStore()
    const { loading: relationshipsLoading } = storeToRefs(relationshipsStore)
    const personRelationships = ref([])

    async function fetchPerson() {
      const personId = route.params.id
      loading.value = true
      error.value = null

      try {
        const data = await apiService.getPerson(personId)
        person.value = data
        await fetchRelationships(personId)
      } catch (err) {
        error.value = err.message
        console.error('Failed to fetch person:', err)
      } finally {
        loading.value = false
      }
    }

    async function fetchRelationships(personId) {
      try {
        const relationships = await relationshipsStore.fetchPersonRelationships(parseInt(personId))
        personRelationships.value = relationships
      } catch (err) {
        console.error('Failed to fetch relationships:', err)
      }
    }

    async function handleAddRelationship(relationshipData) {
      try {
        await relationshipsStore.createRelationship(parseInt(route.params.id), relationshipData)
        await fetchRelationships(route.params.id)
        showSuccess('Relationship added successfully!')
      } catch (err) {
        showError('Failed to add relationship: ' + err.message)
      }
    }

    async function deleteRelationship(relationshipId) {
      const isConfirmed = await showConfirm('Are you sure you want to delete this relationship?')
      if (isConfirmed) {
        try {
          await relationshipsStore.deleteRelationship(relationshipId)
          await fetchRelationships(route.params.id)
          showSuccess('Relationship deleted successfully!')
        } catch (err) {
          showError('Failed to delete relationship: ' + err.message)
        }
      }
    }

    async function handleEditPerson(personData) {
      try {
        await personsStore.updatePerson(personData.id, personData)
        // Refresh the person data
        await fetchPerson()
        showEditForm.value = false
        showSuccess('Person updated successfully!')
      } catch (err) {
        showError('Failed to update person: ' + err.message)
      }
    }

    function formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    function getInitials(firstName, lastName) {
      const first = firstName ? firstName.charAt(0).toUpperCase() : ''
      const last = lastName ? lastName.charAt(0).toUpperCase() : ''
      return first + last
    }

    function getAgeString(birthDate, deathDate) {
      if (!birthDate) return ''
      
      const birth = new Date(birthDate)
      const end = deathDate ? new Date(deathDate) : new Date()
      const age = Math.floor((end - birth) / (365.25 * 24 * 60 * 60 * 1000))
      
      if (deathDate) {
        return `Lived ${age} years (${birth.getFullYear()} - ${end.getFullYear()})`
      } else {
        return `Age ${age} years`
      }
    }

    function getRelatedPersonId(relationship) {
      const currentPersonId = parseInt(route.params.id)
      if (relationship.person1_id === currentPersonId) {
        return relationship.person2_id
      } else {
        return relationship.person1_id
      }
    }

    function getRelatedPersonName(relationship) {
      const currentPersonId = parseInt(route.params.id)
      if (relationship.person1_id === currentPersonId) {
        return `${relationship.person2_first_name} ${relationship.person2_last_name}`
      } else {
        return `${relationship.person1_first_name} ${relationship.person1_last_name}`
      }
    }

    function getPersonInitials(relationship) {
      const currentPersonId = parseInt(route.params.id)
      if (relationship.person1_id === currentPersonId) {
        return getInitials(relationship.person2_first_name, relationship.person2_last_name)
      } else {
        return getInitials(relationship.person1_first_name, relationship.person1_last_name)
      }
    }

    function formatRelationshipType(type) {
      return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    }

    function getProfilePictureUrl(url) {
      if (!url) return null
      // If it's a relative URL (uploaded photo), prepend the API URL
      if (url.startsWith('/uploads/')) {
        return `http://localhost:3000${url}`
      }
      // Otherwise return as is (external URL)
      return url
    }

    function handleFileSelect(event) {
      const file = event.target.files[0]
      if (!file) {
        selectedFile.value = null
        selectedFilePreview.value = null
        return
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        showError('File size must be less than 5MB')
        event.target.value = ''
        return
      }

      selectedFile.value = file
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        selectedFilePreview.value = e.target.result
      }
      reader.readAsDataURL(file)
    }

    async function uploadPhoto() {
      if (!selectedFile.value) return

      uploading.value = true
      uploadProgress.value = 0

      const formData = new FormData()
      formData.append('photo', selectedFile.value)

      try {
        const response = await fetch(`http://localhost:3000/api/persons/${route.params.id}/photo`, {
          method: 'POST',
          body: formData,
          // Track upload progress
          onUploadProgress: (progressEvent) => {
            uploadProgress.value = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          }
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Failed to upload photo')
        }

        const data = await response.json()
        
        // Update the person's main photo
        person.value.main_photo = data.main_photo
        
        showSuccess('Photo uploaded successfully!')
        closePhotoModal()
      } catch (err) {
        showError('Failed to upload photo: ' + err.message)
      } finally {
        uploading.value = false
        uploadProgress.value = 0
      }
    }

    async function confirmRemovePhoto() {
      const isConfirmed = await showConfirm('Are you sure you want to remove the profile photo?')
      if (isConfirmed) {
        await removePhoto()
      }
    }

    async function removePhoto() {
      try {
        const response = await fetch(`http://localhost:3000/api/persons/${route.params.id}/photo`, {
          method: 'DELETE'
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Failed to remove photo')
        }

        // Update the person's main photo
        person.value.main_photo = null
        
        showSuccess('Photo removed successfully!')
        closePhotoModal()
      } catch (err) {
        showError('Failed to remove photo: ' + err.message)
      }
    }

    function closePhotoModal() {
      showPhotoUpload.value = false
      selectedFile.value = null
      selectedFilePreview.value = null
      if (fileInput.value) {
        fileInput.value.value = ''
      }
    }

    onMounted(() => {
      fetchPerson()
    })

    // Watch for route parameter changes to reload data when navigating between persons
    watch(
      () => route.params.id,
      (newId, oldId) => {
        if (newId !== oldId) {
          fetchPerson()
        }
      }
    )

    return {
      route,
      person,
      loading,
      error,
      showAddRelationship,
      showEditForm,
      personRelationships,
      relationshipsLoading,
      showPhotoUpload,
      selectedFile,
      selectedFilePreview,
      uploading,
      uploadProgress,
      fileInput,
      formatDate,
      getInitials,
      getAgeString,
      getRelatedPersonId,
      getRelatedPersonName,
      getPersonInitials,
      formatRelationshipType,
      getProfilePictureUrl,
      handleAddRelationship,
      handleEditPerson,
      deleteRelationship,
      handleFileSelect,
      uploadPhoto,
      confirmRemovePhoto,
      closePhotoModal
    }
  }
}
</script>
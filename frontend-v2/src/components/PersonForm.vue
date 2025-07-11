<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" v-if="isOpen">
    <div class="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
      <div class="mt-3">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-gray-900">
            {{ isEditing ? 'Edit Person' : 'Add New Person' }}
          </h2>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="submitForm" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- First Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                First Name <span class="text-red-500">*</span>
              </label>
              <input 
                v-model="form.first_name"
                type="text" 
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter first name"
              />
            </div>

            <!-- Last Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input 
                v-model="form.last_name"
                type="text" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter last name"
              />
            </div>

            <!-- Maiden Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Maiden Name
              </label>
              <input 
                v-model="form.maiden_name"
                type="text" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter maiden name"
              />
            </div>

            <!-- Gender -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select 
                v-model="form.gender"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <!-- Birth Date -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Birth Date
              </label>
              <input 
                v-model="form.birth_date"
                type="date" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <!-- Death Date -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Death Date
              </label>
              <input 
                v-model="form.death_date"
                type="date" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <!-- Profession -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Profession
            </label>
            <input 
              v-model="form.profession"
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter profession or occupation"
            />
          </div>

          <!-- Location -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input 
              v-model="form.location"
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter location or address"
            />
          </div>

          <!-- Main Photo URL -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Main Photo URL
            </label>
            <input 
              v-model="form.main_photo"
              type="url" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://example.com/main-photo.jpg"
            />
          </div>

          <!-- Biography -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Biography
            </label>
            <textarea 
              v-model="form.bio"
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter biography or life story..."
            ></textarea>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-3">
            <p class="text-red-800 text-sm">{{ error }}</p>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end space-x-3 pt-4">
            <button 
              type="button" 
              @click="closeModal"
              class="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              :disabled="loading"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition-colors flex items-center"
            >
              <div v-if="loading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {{ isEditing ? 'Update Person' : 'Add Person' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'

export default {
  name: 'PersonForm',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    person: {
      type: Object,
      default: null
    }
  },
  emits: ['close', 'submit'],
  setup(props, { emit }) {
    const loading = ref(false)
    const error = ref('')
    
    const form = ref({
      first_name: '',
      last_name: '',
      maiden_name: '',
      gender: '',
      birth_date: '',
      death_date: '',
      profession: '',
      main_photo: '',
      location: '',
      bio: ''
    })

    const isEditing = ref(false)

    // Watch for person changes to populate form
    watch(() => props.person, (newPerson) => {
      if (newPerson) {
        isEditing.value = true
        form.value = {
          first_name: newPerson.first_name || '',
          last_name: newPerson.last_name || '',
          maiden_name: newPerson.maiden_name || '',
          gender: newPerson.gender || '',
          birth_date: newPerson.birth_date || '',
          death_date: newPerson.death_date || '',
          profession: newPerson.profession || '',
          main_photo: newPerson.main_photo || '',
          location: newPerson.location || '',
          bio: newPerson.bio || ''
        }
      } else {
        isEditing.value = false
        resetForm()
      }
    }, { immediate: true })

    function resetForm() {
      form.value = {
        first_name: '',
        last_name: '',
        maiden_name: '',
        gender: '',
        birth_date: '',
        death_date: '',
        profession: '',
        main_photo: '',
        location: '',
        bio: ''
      }
      error.value = ''
    }

    function closeModal() {
      resetForm()
      emit('close')
    }

    async function submitForm() {
      if (!form.value.first_name.trim()) {
        error.value = 'First name is required'
        return
      }

      loading.value = true
      error.value = ''

      try {
        await emit('submit', { 
          ...form.value,
          id: props.person?.id 
        })
        closeModal()
      } catch (err) {
        error.value = err.message || 'An error occurred'
      } finally {
        loading.value = false
      }
    }

    return {
      form,
      loading,
      error,
      isEditing,
      closeModal,
      submitForm
    }
  }
}
</script>
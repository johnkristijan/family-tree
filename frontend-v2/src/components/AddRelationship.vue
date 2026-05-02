<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" v-if="isOpen">
    <div class="relative top-20 mx-auto p-5 border w-11/12 max-w-md shadow-lg rounded-md bg-white">
      <div class="mt-3">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-xl font-semibold text-gray-900">
              Add Relationship
            </h2>
            <p class="text-sm text-gray-600 mt-1">
              Adding relationship for: <span class="font-medium text-gray-900">{{ currentPersonName }}</span>
            </p>
          </div>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 cursor-pointer">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="submitForm" class="space-y-4">
          <!-- Related Person -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Related Person <span class="text-red-500">*</span>
            </label>
            <select 
              v-model="form.relatedPersonId"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select person</option>
              <option 
                v-for="person in availablePersons" 
                :key="person.id" 
                :value="person.id"
              >
                {{ person.first_name }} {{ person.last_name }}{{ person.birth_date ? ` (${person.birth_date})` : '' }}
              </option>
            </select>
          </div>

          <!-- Relationship Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Relationship Type <span class="text-red-500">*</span>
            </label>
            <select 
              v-model="form.relationshipType"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select relationship</option>
              <option value="parent_of">Parent of</option>
              <option value="child_of">Child of</option>
              <option value="spouse_of">Spouse of</option>
              <option value="sibling_of">Sibling of</option>
              <option value="grandparent_of">Grandparent of</option>
              <option value="grandchild_of">Grandchild of</option>
              <option value="aunt_uncle_of">Aunt/Uncle of</option>
              <option value="niece_nephew_of">Niece/Nephew of</option>
              <option value="cousin_of">Cousin of</option>
              <option value="friend_of">Friend of</option>
              <option value="other">Other</option>
            </select>
          </div>

          <!-- Start Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input 
              v-model="form.startDate"
              type="date" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <!-- End Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input 
              v-model="form.endDate"
              type="date" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
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
              class="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit"
              :disabled="loading"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition-colors flex items-center cursor-pointer"
            >
              <div v-if="loading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Add Relationship
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { usePersonsStore } from '../stores/persons'
import { storeToRefs } from 'pinia'

export default {
  name: 'AddRelationship',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    currentPersonId: {
      type: Number,
      required: true
    }
  },
  emits: ['close', 'submit'],
  setup(props, { emit }) {
    const personsStore = usePersonsStore()
    const { persons } = storeToRefs(personsStore)
    
    const loading = ref(false)
    const error = ref('')
    
    const form = ref({
      relatedPersonId: '',
      relationshipType: '',
      startDate: '',
      endDate: ''
    })

    const availablePersons = computed(() => {
      return persons.value
        .filter(person => person.id !== props.currentPersonId)
        .sort((a, b) => {
          const nameA = `${a.first_name} ${a.last_name}`.toLowerCase()
          const nameB = `${b.first_name} ${b.last_name}`.toLowerCase()
          return nameA.localeCompare(nameB)
        })
    })

    const currentPersonName = computed(() => {
      const currentPerson = persons.value.find(person => person.id === props.currentPersonId)
      return currentPerson ? `${currentPerson.first_name} ${currentPerson.last_name}` : ''
    })

    // Watch for modal open/close to reset form
    watch(() => props.isOpen, (isOpen) => {
      if (isOpen) {
        resetForm()
        // Ensure persons are loaded
        if (persons.value.length === 0) {
          personsStore.fetchPersons()
        }
      }
    })

    function resetForm() {
      form.value = {
        relatedPersonId: '',
        relationshipType: '',
        startDate: '',
        endDate: ''
      }
      error.value = ''
    }

    function closeModal() {
      resetForm()
      emit('close')
    }

    async function submitForm() {
      if (!form.value.relatedPersonId || !form.value.relationshipType) {
        error.value = 'Please select both a person and relationship type'
        return
      }

      loading.value = true
      error.value = ''

      try {
        await emit('submit', {
          relatedPersonId: parseInt(form.value.relatedPersonId),
          relationshipType: form.value.relationshipType,
          startDate: form.value.startDate || null,
          endDate: form.value.endDate || null
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
      availablePersons,
      currentPersonName,
      closeModal,
      submitForm
    }
  }
}
</script>
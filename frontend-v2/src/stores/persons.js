import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import apiService from '../services/api'

export const usePersonsStore = defineStore('persons', () => {
  const persons = ref([])
  const loading = ref(false)
  const error = ref(null)

  const personsCount = computed(() => persons.value.length)
  
  const getPersonById = computed(() => {
    return (id) => persons.value.find(person => person.id === id)
  })

  async function fetchPersons() {
    loading.value = true
    error.value = null
    
    try {
      const data = await apiService.getPersons()
      persons.value = data
    } catch (err) {
      error.value = err.message
      console.error('Failed to fetch persons:', err)
    } finally {
      loading.value = false
    }
  }

  async function createPerson(personPayload) { // Expects { personData, photoToUpload }
    loading.value = true
    error.value = null
    let { personData, photoToUpload } = personPayload;
    
    try {
      // Step 1: Create the person entry
      const newPersonEntry = await apiService.createPerson(personData);

      // Step 2: If photo needs to be uploaded, upload it
      if (photoToUpload && newPersonEntry && newPersonEntry.id) {
        try {
          const uploadResponse = await apiService.uploadPersonPhoto(newPersonEntry.id, photoToUpload);
          // Update the newPersonEntry with the photo URL from upload response
          newPersonEntry.main_photo = uploadResponse.main_photo;
        } catch (uploadError) {
          // Handle photo upload error specifically if needed,
          // e.g., by logging it or setting a partial success state.
          // For now, we'll let the main error handler catch it if it's critical.
          console.error('Photo upload failed after person creation:', uploadError);
          // Potentially, you might want to inform the user that person was created but photo upload failed.
          // Or, decide if this is a critical failure and re-throw or rollback.
          // For simplicity, we proceed, and the person will exist without the photo.
        }
      }

      persons.value.push(newPersonEntry);
      return newPersonEntry;
    } catch (err) {
      error.value = err.message;
      console.error('Failed to create person or upload photo:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updatePerson(id, personPayload) { // Expects { personData, photoToUpload }
    loading.value = true
    error.value = null
    let { personData, photoToUpload } = personPayload;
    
    try {
      let finalPersonData = { ...personData };

      // Step 1: If a new photo is provided, upload it first
      if (photoToUpload && id) {
        try {
          const uploadResponse = await apiService.uploadPersonPhoto(id, photoToUpload);
          // Update the personData to be sent for PUT request with the new photo URL
          finalPersonData.main_photo = uploadResponse.main_photo;
        } catch (uploadError) {
          console.error(`Photo upload failed for person ${id}:`, uploadError);
          // Decide on error handling: proceed with updating other data, or throw?
          // For now, we'll throw to indicate the operation wasn't fully successful.
          throw new Error(`Photo upload failed: ${uploadError.message}. Other details were not updated.`);
        }
      }

      // Step 2: Update the person details (including new photo_url if uploaded)
      await apiService.updatePerson(id, finalPersonData);

      const index = persons.value.findIndex(p => p.id === id);
      if (index !== -1) {
        // Update the local store with the final person data
        persons.value[index] = { ...persons.value[index], ...finalPersonData };
      }
      // Return the potentially modified finalPersonData for consistency,
      // though updatePerson API currently returns a success message, not the full object.
      // For a more robust solution, the backend PUT /persons/:id could return the updated person object.
      return { ...persons.value[index] };
    } catch (err) {
      error.value = err.message;
      console.error('Failed to update person or upload photo:', err);
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deletePerson(id) {
    loading.value = true
    error.value = null
    
    try {
      await apiService.deletePerson(id)
      persons.value = persons.value.filter(p => p.id !== id)
    } catch (err) {
      error.value = err.message
      console.error('Failed to delete person:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    persons,
    loading,
    error,
    personsCount,
    getPersonById,
    fetchPersons,
    createPerson,
    updatePerson,
    deletePerson,
    clearError
  }
})
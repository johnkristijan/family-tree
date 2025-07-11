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

  async function createPerson(personData) {
    loading.value = true
    error.value = null
    
    try {
      const newPerson = await apiService.createPerson(personData)
      persons.value.push(newPerson)
      return newPerson
    } catch (err) {
      error.value = err.message
      console.error('Failed to create person:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updatePerson(id, personData) {
    loading.value = true
    error.value = null
    
    try {
      const updatedPerson = await apiService.updatePerson(id, personData)
      const index = persons.value.findIndex(p => p.id === id)
      if (index !== -1) {
        persons.value[index] = { ...persons.value[index], ...personData }
      }
      return updatedPerson
    } catch (err) {
      error.value = err.message
      console.error('Failed to update person:', err)
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
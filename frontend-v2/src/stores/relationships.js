import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import apiService from '../services/api'

export const useRelationshipsStore = defineStore('relationships', () => {
  const relationships = ref([])
  const loading = ref(false)
  const error = ref(null)

  const relationshipsByPersonId = computed(() => {
    return (personId) => relationships.value.filter(rel => 
      rel.person1_id === personId || rel.person2_id === personId
    )
  })

  async function fetchPersonRelationships(personId) {
    loading.value = true
    error.value = null
    
    try {
      const data = await apiService.getPersonRelationships(personId)
      // Store relationships for this person
      relationships.value = relationships.value.filter(rel => 
        rel.person1_id !== personId && rel.person2_id !== personId
      )
      relationships.value.push(...data)
      return data
    } catch (err) {
      error.value = err.message
      console.error('Failed to fetch relationships:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createRelationship(personId, relationshipData) {
    loading.value = true
    error.value = null

    try {
      const newRelationship = await apiService.createRelationship(personId, relationshipData)
      relationships.value.push(newRelationship)
      return newRelationship
    } catch (err) {
      error.value = err.message
      console.error('Failed to create relationship:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createRelationshipWithNewPerson(personId, payload) {
    loading.value = true
    error.value = null

    try {
      const result = await apiService.createRelationshipWithNewPerson(personId, payload)
      if (result?.relationship) {
        relationships.value.push(result.relationship)
      }
      return result
    } catch (err) {
      error.value = err.message
      console.error('Failed to create relationship with new person:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteRelationship(relationshipId) {
    loading.value = true
    error.value = null
    
    try {
      await apiService.deleteRelationship(relationshipId)
      relationships.value = relationships.value.filter(rel => rel.id !== relationshipId)
    } catch (err) {
      error.value = err.message
      console.error('Failed to delete relationship:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  function clearRelationships() {
    relationships.value = []
  }

  return {
    relationships,
    loading,
    error,
    relationshipsByPersonId,
    fetchPersonRelationships,
    createRelationship,
    createRelationshipWithNewPerson,
    deleteRelationship,
    clearError,
    clearRelationships
  }
})
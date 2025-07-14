<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Back Button -->
      <div class="mb-6">
        <router-link 
          :to="`/persons/${route.params.id}`"
          class="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Person Details
        </router-link>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span class="ml-4 text-gray-600">Loading family tree...</span>
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
            <h3 class="text-sm font-medium text-red-800">Error loading family tree</h3>
            <p class="text-sm text-red-700 mt-1">{{ error }}</p>
          </div>
        </div>
      </div>

      <!-- Family Tree -->
      <div v-else-if="person" class="space-y-8">
        
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">
            {{ person.first_name }} {{ person.last_name }}'s Family Tree
          </h1>
          <p class="text-gray-600">Immediate family relationships</p>
        </div>

        <!-- Family Tree Chart -->
        <div class="bg-white rounded-lg shadow-lg p-8 overflow-x-auto">
          <div class="family-tree-container">
            
            <!-- Parents Row -->
            <div class="tree-row parents-row" v-if="parents.length > 0">
              <div class="tree-level">
                <div class="tree-generation-label">
                  <span class="text-sm font-medium text-gray-500">Parents</span>
                </div>
                <div class="tree-members parents-container">
                  <div 
                    v-for="parent in parents" 
                    :key="parent.id"
                    class="tree-member parent-member"
                    @click="navigateToPerson(parent.id)"
                  >
                    <div class="member-card">
                      <div v-if="parent.main_photo" class="member-avatar member-avatar-image">
                        <img 
                          :src="getProfilePictureUrl(parent.main_photo)" 
                          :alt="`${parent.first_name} ${parent.last_name}`"
                          class="avatar-image"
                        />
                      </div>
                      <div v-else class="member-avatar">
                        {{ getInitials(parent.first_name, parent.last_name) }}
                      </div>
                      <div class="member-info">
                        <h3 class="member-name">{{ parent.first_name }} {{ parent.last_name }}</h3>
                        <p class="member-details">{{ formatRelationshipType(parent.relationship_type) }}</p>
                        <p class="member-age">{{ getAgeString(parent.birth_date, parent.death_date) }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Current Person Row -->
            <div class="tree-row current-person-row">
              <div class="tree-level">
                <div class="tree-generation-label">
                  <span class="text-sm font-medium text-gray-500">Current Person</span>
                </div>
                <div class="tree-members current-person-container">
                  <div class="tree-member current-person">
                    <div class="member-card current-person-card">
                      <div v-if="person.main_photo" class="member-avatar current-person-avatar member-avatar-image">
                        <img 
                          :src="getProfilePictureUrl(person.main_photo)" 
                          :alt="`${person.first_name} ${person.last_name}`"
                          class="avatar-image"
                        />
                      </div>
                      <div v-else class="member-avatar current-person-avatar">
                        {{ getInitials(person.first_name, person.last_name) }}
                      </div>
                      <div class="member-info">
                        <h3 class="member-name">{{ person.first_name }} {{ person.last_name }}</h3>
                        <p class="member-details">{{ person.profession || 'No profession listed' }}</p>
                        <p class="member-age">{{ getAgeString(person.birth_date, person.death_date) }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Siblings Row -->
            <div class="tree-row siblings-row" v-if="siblings.length > 0">
              <div class="tree-level">
                <div class="tree-generation-label">
                  <span class="text-sm font-medium text-gray-500">Siblings</span>
                </div>
                <div class="tree-members siblings-container">
                  <div 
                    v-for="sibling in siblings" 
                    :key="sibling.id"
                    class="tree-member sibling-member"
                    @click="navigateToPerson(sibling.id)"
                  >
                    <div class="member-card">
                      <div v-if="sibling.main_photo" class="member-avatar member-avatar-image">
                        <img 
                          :src="getProfilePictureUrl(sibling.main_photo)" 
                          :alt="`${sibling.first_name} ${sibling.last_name}`"
                          class="avatar-image"
                        />
                      </div>
                      <div v-else class="member-avatar">
                        {{ getInitials(sibling.first_name, sibling.last_name) }}
                      </div>
                      <div class="member-info">
                        <h3 class="member-name">{{ sibling.first_name }} {{ sibling.last_name }}</h3>
                        <p class="member-details">{{ formatRelationshipType(sibling.relationship_type) }}</p>
                        <p class="member-age">{{ getAgeString(sibling.birth_date, sibling.death_date) }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Children Row -->
            <div class="tree-row children-row" v-if="children.length > 0">
              <div class="tree-level">
                <div class="tree-generation-label">
                  <span class="text-sm font-medium text-gray-500">Children</span>
                </div>
                <div class="tree-members children-container">
                  <div 
                    v-for="child in children" 
                    :key="child.id"
                    class="tree-member child-member"
                    @click="navigateToPerson(child.id)"
                  >
                    <div class="member-card">
                      <div v-if="child.main_photo" class="member-avatar member-avatar-image">
                        <img 
                          :src="getProfilePictureUrl(child.main_photo)" 
                          :alt="`${child.first_name} ${child.last_name}`"
                          class="avatar-image"
                        />
                      </div>
                      <div v-else class="member-avatar">
                        {{ getInitials(child.first_name, child.last_name) }}
                      </div>
                      <div class="member-info">
                        <h3 class="member-name">{{ child.first_name }} {{ child.last_name }}</h3>
                        <p class="member-details">{{ formatRelationshipType(child.relationship_type) }}</p>
                        <p class="member-age">{{ getAgeString(child.birth_date, child.death_date) }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Spouse Row -->
            <div class="tree-row spouse-row" v-if="spouses.length > 0">
              <div class="tree-level">
                <div class="tree-generation-label">
                  <span class="text-sm font-medium text-gray-500">Spouse(s)</span>
                </div>
                <div class="tree-members spouse-container">
                  <div 
                    v-for="spouse in spouses" 
                    :key="spouse.id"
                    class="tree-member spouse-member"
                    @click="navigateToPerson(spouse.id)"
                  >
                    <div class="member-card">
                      <div v-if="spouse.main_photo" class="member-avatar member-avatar-image">
                        <img 
                          :src="getProfilePictureUrl(spouse.main_photo)" 
                          :alt="`${spouse.first_name} ${spouse.last_name}`"
                          class="avatar-image"
                        />
                      </div>
                      <div v-else class="member-avatar">
                        {{ getInitials(spouse.first_name, spouse.last_name) }}
                      </div>
                      <div class="member-info">
                        <h3 class="member-name">{{ spouse.first_name }} {{ spouse.last_name }}</h3>
                        <p class="member-details">{{ formatRelationshipType(spouse.relationship_type) }}</p>
                        <p class="member-age">{{ getAgeString(spouse.birth_date, spouse.death_date) }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-if="!hasAnyRelatives" class="text-center py-12">
              <svg class="h-16 w-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 class="text-lg font-medium text-gray-900 mb-2">No immediate family relationships found</h3>
              <p class="text-gray-500">Add relationships to see the family tree</p>
            </div>

          </div>
        </div>

        <!-- Legend -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Legend</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="flex items-center">
              <div class="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
              <span class="text-sm text-gray-600">Current Person</span>
            </div>
            <div class="flex items-center">
              <div class="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
              <span class="text-sm text-gray-600">Parents</span>
            </div>
            <div class="flex items-center">
              <div class="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
              <span class="text-sm text-gray-600">Siblings</span>
            </div>
            <div class="flex items-center">
              <div class="w-4 h-4 bg-purple-500 rounded-full mr-2"></div>
              <span class="text-sm text-gray-600">Children</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRelationshipsStore } from '../stores/relationships'
import apiService from '../services/api'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

export default {
  name: 'FamilyTreeView',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const person = ref(null)
    const loading = ref(true)
    const error = ref(null)
    const relationships = ref([])
    
    const relationshipsStore = useRelationshipsStore()

    // Computed properties to categorize relationships
    const parents = computed(() => {
      return relationships.value.filter(rel => 
        rel.relationship_type === 'parent_of' || rel.relationship_type === 'child_of'
      ).filter(rel => {
        const currentPersonId = parseInt(route.params.id)
        // If relationship_type is 'parent_of', the current person is the child
        if (rel.relationship_type === 'parent_of' && rel.person2_id === currentPersonId) {
          return true
        }
        // If relationship_type is 'child_of', the current person is the child
        if (rel.relationship_type === 'child_of' && rel.person1_id === currentPersonId) {
          return true
        }
        return false
      }).map(rel => mapRelationshipToPerson(rel, 'parent'))
    })

    const children = computed(() => {
      return relationships.value.filter(rel => 
        rel.relationship_type === 'parent_of' || rel.relationship_type === 'child_of'
      ).filter(rel => {
        const currentPersonId = parseInt(route.params.id)
        // If relationship_type is 'parent_of', the current person is the parent
        if (rel.relationship_type === 'parent_of' && rel.person1_id === currentPersonId) {
          return true
        }
        // If relationship_type is 'child_of', the current person is the parent
        if (rel.relationship_type === 'child_of' && rel.person2_id === currentPersonId) {
          return true
        }
        return false
      }).map(rel => mapRelationshipToPerson(rel, 'child'))
    })

    const siblings = computed(() => {
      return relationships.value.filter(rel => 
        rel.relationship_type === 'sibling_of'
      ).map(rel => mapRelationshipToPerson(rel, 'sibling'))
    })

    const spouses = computed(() => {
      return relationships.value.filter(rel => 
        rel.relationship_type === 'spouse_of'
      ).map(rel => mapRelationshipToPerson(rel, 'spouse'))
    })

    const hasAnyRelatives = computed(() => {
      return parents.value.length > 0 || children.value.length > 0 || 
             siblings.value.length > 0 || spouses.value.length > 0
    })

    function mapRelationshipToPerson(relationship, type) {
      const currentPersonId = parseInt(route.params.id)
      const isCurrentPersonFirst = relationship.person1_id === currentPersonId
      
      return {
        id: isCurrentPersonFirst ? relationship.person2_id : relationship.person1_id,
        first_name: isCurrentPersonFirst ? relationship.person2_first_name : relationship.person1_first_name,
        last_name: isCurrentPersonFirst ? relationship.person2_last_name : relationship.person1_last_name,
        birth_date: isCurrentPersonFirst ? relationship.person2_birth_date : relationship.person1_birth_date,
        death_date: isCurrentPersonFirst ? relationship.person2_death_date : relationship.person1_death_date,
        main_photo: isCurrentPersonFirst ? relationship.person2_main_photo : relationship.person1_main_photo,
        relationship_type: type,
        start_date: relationship.start_date,
        end_date: relationship.end_date
      }
    }

    async function fetchData() {
      const personId = route.params.id
      loading.value = true
      error.value = null

      try {
        // Fetch person details
        const personData = await apiService.getPerson(personId)
        person.value = personData

        // Fetch relationships
        const relationshipsData = await relationshipsStore.fetchPersonRelationships(parseInt(personId))
        relationships.value = relationshipsData
      } catch (err) {
        error.value = err.message
        console.error('Failed to fetch family tree data:', err)
      } finally {
        loading.value = false
      }
    }

    function getInitials(firstName, lastName) {
      const first = firstName ? firstName.charAt(0).toUpperCase() : ''
      const last = lastName ? lastName.charAt(0).toUpperCase() : ''
      return first + last
    }

    function getAgeString(birthDate, deathDate) {
      if (!birthDate) return 'Age unknown'
      
      const birth = new Date(birthDate)
      const end = deathDate ? new Date(deathDate) : new Date()
      const age = Math.floor((end - birth) / (365.25 * 24 * 60 * 60 * 1000))
      
      if (deathDate) {
        return `${age} years (${birth.getFullYear()} - ${end.getFullYear()})`
      } else {
        return `${age} years old`
      }
    }

    function formatRelationshipType(type) {
      const typeMap = {
        'parent': 'Parent',
        'child': 'Child',
        'sibling': 'Sibling',
        'spouse': 'Spouse'
      }
      return typeMap[type] || type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    }

    function navigateToPerson(personId) {
      router.push(`/persons/${personId}`)
    }

    function getProfilePictureUrl(url) {
      if (!url) return null
      
      // If it's a relative URL (uploaded photo), prepend the API URL
      if (url.startsWith('/uploads/')) {
        return `${API_BASE_URL}${url}`
      }
      // Otherwise return as is (external URL)
      return url
    }

    onMounted(() => {
      fetchData()
    })

    return {
      route,
      person,
      loading,
      error,
      parents,
      children,
      siblings,
      spouses,
      hasAnyRelatives,
      getInitials,
      getAgeString,
      formatRelationshipType,
      navigateToPerson,
      getProfilePictureUrl
    }
  }
}
</script>

<style scoped>
.family-tree-container {
  min-height: 400px;
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.tree-row {
  display: flex;
  justify-content: center;
  width: 100%;
}

.tree-level {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.tree-generation-label {
  text-align: center;
  padding: 0.5rem 1rem;
  background-color: #f3f4f6;
  border-radius: 1rem;
  border: 2px solid #e5e7eb;
}

.tree-members {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
  align-items: center;
}

.tree-member {
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.tree-member:hover {
  transform: translateY(-2px);
}

.member-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 2px solid #e5e7eb;
  text-align: center;
  min-width: 200px;
  transition: all 0.2s ease-in-out;
}

.member-card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  border-color: #3b82f6;
}

.current-person-card {
  border-color: #3b82f6;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
}

.parent-member .member-card {
  border-color: #10b981;
}

.parent-member .member-card:hover {
  border-color: #059669;
}

.sibling-member .member-card {
  border-color: #f59e0b;
}

.sibling-member .member-card:hover {
  border-color: #d97706;
}

.child-member .member-card {
  border-color: #8b5cf6;
}

.child-member .member-card:hover {
  border-color: #7c3aed;
}

.spouse-member .member-card {
  border-color: #ef4444;
}

.spouse-member .member-card:hover {
  border-color: #dc2626;
}

.member-avatar {
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.25rem;
  color: #6b7280;
  margin: 0 auto 1rem;
  border: 3px solid #e5e7eb;
}

.current-person-avatar {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border-color: #3b82f6;
}

.parent-member .member-avatar {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border-color: #10b981;
}

.sibling-member .member-avatar {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  border-color: #f59e0b;
}

.child-member .member-avatar {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
  border-color: #8b5cf6;
}

.spouse-member .member-avatar {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  border-color: #ef4444;
}

.member-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.member-name {
  font-weight: 600;
  color: #1f2937;
  font-size: 1.125rem;
}

.member-details {
  color: #6b7280;
  font-size: 0.875rem;
}

.member-age {
  color: #9ca3af;
  font-size: 0.875rem;
}

.member-avatar-image {
  overflow: hidden;
  padding: 0;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.current-person-avatar.member-avatar-image {
  border-color: #3b82f6;
}

.parent-member .member-avatar-image {
  border-color: #10b981;
}

.sibling-member .member-avatar-image {
  border-color: #f59e0b;
}

.child-member .member-avatar-image {
  border-color: #8b5cf6;
}

.spouse-member .member-avatar-image {
  border-color: #ef4444;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .family-tree-container {
    gap: 2rem;
  }
  
  .tree-members {
    gap: 1rem;
  }
  
  .member-card {
    min-width: 160px;
    padding: 1rem;
  }
  
  .member-avatar {
    width: 3rem;
    height: 3rem;
    font-size: 1rem;
  }
}
</style>

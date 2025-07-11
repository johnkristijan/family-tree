const API_BASE_URL = 'http://localhost:3000/api'

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Auth endpoints
  async login(password) {
    return this.request('/login', {
      method: 'POST',
      body: JSON.stringify({ password })
    })
  }

  // Person endpoints
  async getPersons() {
    return this.request('/persons')
  }

  async getPerson(id) {
    return this.request(`/persons/${id}`)
  }

  async createPerson(personData) {
    return this.request('/persons', {
      method: 'POST',
      body: JSON.stringify(personData)
    })
  }

  async updatePerson(id, personData) {
    return this.request(`/persons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(personData)
    })
  }

  async deletePerson(id) {
    return this.request(`/persons/${id}`, {
      method: 'DELETE'
    })
  }

  // Relationship endpoints
  async getPersonRelationships(personId) {
    return this.request(`/persons/${personId}/relationships`)
  }

  async createRelationship(personId, relationshipData) {
    return this.request(`/persons/${personId}/relationships`, {
      method: 'POST',
      body: JSON.stringify(relationshipData)
    })
  }

  async deleteRelationship(relationshipId) {
    return this.request(`/relationships/${relationshipId}`, {
      method: 'DELETE'
    })
  }
}

export default new ApiService()
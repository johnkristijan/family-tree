const API_BASE_URL = 'http://localhost:3000/api'

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`
    const config = {
      headers: {
        // Default to application/json, but allow override (e.g., for FormData)
        'Content-Type': options.body instanceof FormData ? undefined : 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // If Content-Type is explicitly set to undefined (for FormData), delete it
    // so the browser can set it automatically with the boundary.
    if (config.headers['Content-Type'] === undefined) {
      delete config.headers['Content-Type'];
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        // Attempt to parse error response body if available
        let errorBody;
        try {
          errorBody = await response.json();
        } catch (e) {
          // Ignore if error response is not JSON
        }
        const errorMessage = errorBody?.message || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }
      
      // Handle cases where response might be empty (e.g., 204 No Content)
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        return await response.json();
      } else {
        return await response.text(); // Or handle as appropriate
      }
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
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
  async uploadPersonPhoto(personId, photoFile) {
    const formData = new FormData();
    formData.append('photo', photoFile);

    // Note: When using FormData with fetch,
    // don't explicitly set the 'Content-Type' header.
    // The browser will automatically set it to 'multipart/form-data'
    // with the correct boundary.
    return this.request(`/persons/${personId}/upload-photo`, {
      method: 'POST',
      body: formData,
      headers: {
        // Remove Content-Type: application/json for FormData
        'Content-Type': undefined
      }
    });
  }

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
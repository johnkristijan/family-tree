<template>
  <div class="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 py-12 px-4">
    <div class="max-w-6xl mx-auto">
      
      <!-- Hero Section -->
      <div class="text-center mb-16">
        <div class="text-6xl mb-6">📖</div>
        <h1 class="text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
          About Family Tree
        </h1>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          A modern, intuitive family tree application designed to help you preserve your family's legacy and create meaningful connections across generations.
        </p>
      </div>

      <!-- Mission Section -->
      <div class="bg-white rounded-xl shadow-lg p-8 mb-16 border border-gray-200">
        <div class="text-center">
          <div class="text-emerald-500 text-4xl mb-4">🌟</div>
          <h2 class="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p class="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
            To provide families with a powerful, easy-to-use platform for documenting, organizing, and sharing their ancestral stories. 
            We believe every family has a unique story worth preserving, and technology should make that preservation both simple and meaningful.
          </p>
        </div>
      </div>

      <!-- Features Grid -->
      <div class="mb-16">
        <h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">Key Features</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <div class="text-emerald-500 text-4xl mb-4">👥</div>
            <h3 class="text-xl font-semibold text-gray-800 mb-3">Family Management</h3>
            <p class="text-gray-600">
              Add, edit, and organize family members with detailed profiles including photos, biographies, and important dates.
            </p>
          </div>
          
          <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <div class="text-blue-500 text-4xl mb-4">🔗</div>
            <h3 class="text-xl font-semibold text-gray-800 mb-3">Relationship Mapping</h3>
            <p class="text-gray-600">
              Connect family members through marriages, parent-child relationships, and other family bonds.
            </p>
          </div>
          
          <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <div class="text-purple-500 text-4xl mb-4">🔍</div>
            <h3 class="text-xl font-semibold text-gray-800 mb-3">Smart Search</h3>
            <p class="text-gray-600">
              Powerful search functionality to quickly find family members by name, profession, location, or biography.
            </p>
          </div>
          
          <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <div class="text-orange-500 text-4xl mb-4">📱</div>
            <h3 class="text-xl font-semibold text-gray-800 mb-3">Responsive Design</h3>
            <p class="text-gray-600">
              Works seamlessly across all devices - desktop, tablet, and mobile for managing your family tree anywhere.
            </p>
          </div>
          
          <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <div class="text-red-500 text-4xl mb-4">🛡️</div>
            <h3 class="text-xl font-semibold text-gray-800 mb-3">Data Security</h3>
            <p class="text-gray-600">
              Your family information is stored securely with modern encryption and privacy protection measures.
            </p>
          </div>
          
          <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <div class="text-indigo-500 text-4xl mb-4">⚡</div>
            <h3 class="text-xl font-semibold text-gray-800 mb-3">Fast Performance</h3>
            <p class="text-gray-600">
              Built with modern web technologies for lightning-fast performance and smooth user experience.
            </p>
          </div>
        </div>
      </div>

      <!-- Technology Stack -->
      <div class="bg-white rounded-xl shadow-lg p-8 mb-16 border border-gray-200">
        <div class="text-center mb-8">
          <div class="text-blue-500 text-4xl mb-4">⚙️</div>
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Built With Modern Technology</h2>
          <p class="text-gray-600 max-w-2xl mx-auto">
            Our family tree application leverages cutting-edge web technologies to provide a robust, scalable, and maintainable platform.
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <div class="text-green-500 text-3xl mb-2">🖼️</div>
            <h4 class="font-semibold text-gray-800">Vue 3</h4>
            <p class="text-sm text-gray-600">Progressive JavaScript framework with Composition API</p>
          </div>
          
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <div class="text-purple-500 text-3xl mb-2">⚡</div>
            <h4 class="font-semibold text-gray-800">Vite</h4>
            <p class="text-sm text-gray-600">Lightning-fast build tool and development server</p>
          </div>
          
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <div class="text-blue-500 text-3xl mb-2">🧭</div>
            <h4 class="font-semibold text-gray-800">Vue Router</h4>
            <p class="text-sm text-gray-600">Official router for client-side navigation</p>
          </div>
          
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <div class="text-yellow-500 text-3xl mb-2">🍍</div>
            <h4 class="font-semibold text-gray-800">Pinia</h4>
            <p class="text-sm text-gray-600">Intuitive state management library</p>
          </div>
        </div>
        
        <div class="mt-8 text-center">
          <div class="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full">
            <span class="mr-2">💡</span>
            <span class="text-sm font-medium">Pure JavaScript - No TypeScript complexity</span>
          </div>
        </div>
      </div>

      <!-- Development Approach -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        <div class="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <div class="text-emerald-500 text-4xl mb-4">🎯</div>
          <h3 class="text-2xl font-bold text-gray-900 mb-4">User-Centered Design</h3>
          <p class="text-gray-600 mb-4">
            Every feature is designed with the user experience in mind. We focus on intuitive interfaces, 
            clear navigation, and helpful feedback to make managing your family tree effortless.
          </p>
          <ul class="text-gray-600 space-y-2">
            <li class="flex items-center">
              <span class="text-emerald-500 mr-2">✓</span>
              Intuitive user interface
            </li>
            <li class="flex items-center">
              <span class="text-emerald-500 mr-2">✓</span>
              Responsive design
            </li>
            <li class="flex items-center">
              <span class="text-emerald-500 mr-2">✓</span>
              Accessibility focused
            </li>
          </ul>
        </div>
        
        <div class="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <div class="text-blue-500 text-4xl mb-4">🔧</div>
          <h3 class="text-2xl font-bold text-gray-900 mb-4">Modern Architecture</h3>
          <p class="text-gray-600 mb-4">
            Built using modern web development practices including component-based architecture, 
            reactive state management, and efficient data handling for optimal performance.
          </p>
          <ul class="text-gray-600 space-y-2">
            <li class="flex items-center">
              <span class="text-blue-500 mr-2">✓</span>
              Component-based structure
            </li>
            <li class="flex items-center">
              <span class="text-blue-500 mr-2">✓</span>
              Reactive state management
            </li>
            <li class="flex items-center">
              <span class="text-blue-500 mr-2">✓</span>
              Modular code organization
            </li>
          </ul>
        </div>
      </div>

      <!-- Version Info -->
      <div class="bg-white rounded-xl shadow-lg p-8 border border-gray-200 text-center">
        <div class="text-purple-500 text-4xl mb-4">📊</div>
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Application Information</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="p-4 bg-gray-50 rounded-lg">
            <div class="text-lg font-semibold text-gray-800">Version</div>
            <div class="text-2xl font-bold text-emerald-600">2.0</div>
          </div>
          <div class="p-4 bg-gray-50 rounded-lg">
            <div class="text-lg font-semibold text-gray-800">Last Updated</div>
            <div class="text-2xl font-bold text-blue-600">July 2025</div>
          </div>
          <div class="p-4 bg-gray-50 rounded-lg">
            <div class="text-lg font-semibold text-gray-800">Status</div>
            <div class="text-2xl font-bold text-purple-600">Active</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'AboutView',
  setup() {
    const appVersion = ref('2.0')
    const lastUpdated = ref('July 2025')
    const features = ref([
      {
        icon: '👥',
        title: 'Family Management',
        description: 'Add, edit, and organize family members with detailed profiles including photos, biographies, and important dates.',
        color: 'emerald'
      },
      {
        icon: '🔗',
        title: 'Relationship Mapping',
        description: 'Connect family members through marriages, parent-child relationships, and other family bonds.',
        color: 'blue'
      },
      {
        icon: '🔍',
        title: 'Smart Search',
        description: 'Powerful search functionality to quickly find family members by name, profession, location, or biography.',
        color: 'purple'
      },
      {
        icon: '📱',
        title: 'Responsive Design',
        description: 'Works seamlessly across all devices - desktop, tablet, and mobile for managing your family tree anywhere.',
        color: 'orange'
      },
      {
        icon: '🛡️',
        title: 'Data Security',
        description: 'Your family information is stored securely with modern encryption and privacy protection measures.',
        color: 'red'
      },
      {
        icon: '⚡',
        title: 'Fast Performance',
        description: 'Built with modern web technologies for lightning-fast performance and smooth user experience.',
        color: 'indigo'
      }
    ])

    const technologies = ref([
      {
        name: 'Vue 3',
        description: 'Progressive JavaScript framework with Composition API',
        icon: '🖼️',
        color: 'green'
      },
      {
        name: 'Vite',
        description: 'Lightning-fast build tool and development server',
        icon: '⚡',
        color: 'purple'
      },
      {
        name: 'Vue Router',
        description: 'Official router for client-side navigation',
        icon: '🧭',
        color: 'blue'
      },
      {
        name: 'Pinia',
        description: 'Intuitive state management library',
        icon: '🍍',
        color: 'yellow'
      }
    ])

    onMounted(() => {
      // Any initialization logic can go here
      console.log('About page loaded')
    })

    return {
      appVersion,
      lastUpdated,
      features,
      technologies
    }
  }
}
</script>

<style scoped>
/* Custom animations and transitions */
.fade-in {
  animation: fadeIn 0.6s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Hover effects for cards */
.hover-lift:hover {
  transform: translateY(-2px);
  transition: transform 0.3s ease;
}

/* Gradient text background clip support */
.bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
}

/* Custom scrollbar for better UX */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Responsive typography */
@media (max-width: 768px) {
  .text-6xl {
    font-size: 3rem;
  }
  
  .text-5xl {
    font-size: 2.5rem;
  }
  
  .text-3xl {
    font-size: 1.875rem;
  }
}

/* Focus styles for accessibility */
button:focus,
a:focus {
  outline: 2px solid #10b981;
  outline-offset: 2px;
}

/* Print styles */
@media print {
  .min-h-screen {
    min-height: auto;
  }
  
  .shadow-lg,
  .shadow-xl {
    box-shadow: none !important;
    border: 1px solid #e5e7eb;
  }
  
  .bg-gradient-to-br {
    background: white !important;
  }
}
</style>
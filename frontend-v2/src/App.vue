<template>
  <div id="app" class="min-h-screen">
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex space-x-8">
            <router-link 
              to="/" 
              class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200"
              :class="$route.path === '/' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            >
              Home
            </router-link>
            <router-link
              to="/persons"
              class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200"
              :class="$route.path === '/persons' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            >
              Family Members
            </router-link>
            <router-link
              to="/calendar"
              class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200"
              :class="$route.path === '/calendar' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            >
              Calendar
            </router-link>
            <router-link
              to="/about"
              class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200"
              :class="$route.path === '/about' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            >
              About
            </router-link>
          </div>
        </div>
      </div>
    </nav>
    <main class="flex-1">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>


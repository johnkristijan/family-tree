&lt;template&gt;
  &lt;div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"&gt;
    &lt;div class="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl"&gt;
      &lt;div class="flex items-center mb-4"&gt;
        &lt;div class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3"&gt;
          &lt;svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"&gt;
            &lt;path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"&gt;&lt;/path&gt;
          &lt;/svg&gt;
        &lt;/div&gt;
        &lt;h3 class="text-lg font-semibold text-gray-900"&gt;{{ title }}&lt;/h3&gt;
      &lt;/div&gt;
      
      &lt;p class="text-gray-600 mb-6"&gt;{{ message }}&lt;/p&gt;
      
      &lt;div class="flex gap-3 justify-end"&gt;
        &lt;button
          @click="handleCancel"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors cursor-pointer"
        &gt;
          {{ cancelText }}
        &lt;/button&gt;
        &lt;button
          @click="handleConfirm"
          class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors cursor-pointer"
        &gt;
          {{ confirmText }}
        &lt;/button&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/template&gt;

&lt;script setup&gt;
import { defineProps, defineEmits } from 'vue'

defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Confirm Action'
  },
  message: {
    type: String,
    required: true
  },
  confirmText: {
    type: String,
    default: 'Confirm'
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  }
})

const emit = defineEmits(['confirm', 'cancel'])

function handleConfirm() {
  emit('confirm')
}

function handleCancel() {
  emit('cancel')
}
&lt;/script&gt;

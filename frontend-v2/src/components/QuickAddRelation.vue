<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-start justify-center bg-gray-900/60 px-4 pt-16 pb-8 overflow-y-auto"
    @click.self="close"
    @keydown.esc="close"
  >
    <div class="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">

      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h2 class="text-lg font-semibold text-gray-900">{{ title }}</h2>
          <p class="text-sm text-gray-500 mt-0.5">
            for <span class="font-medium text-gray-700">{{ currentPersonName }}</span>
          </p>
        </div>
        <button
          type="button"
          @click="close"
          class="text-gray-400 hover:text-gray-600 cursor-pointer p-1 -m-1"
          aria-label="Close"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Tabs -->
      <div class="flex border-b border-gray-200 bg-gray-50">
        <button
          type="button"
          @click="setTab('existing')"
          :class="tabClass('existing')"
        >
          <svg class="w-4 h-4 inline-block mr-1.5 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          Link existing
        </button>
        <button
          type="button"
          @click="setTab('new')"
          :class="tabClass('new')"
        >
          <svg class="w-4 h-4 inline-block mr-1.5 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Add new person
        </button>
      </div>

      <!-- Body -->
      <div class="px-6 py-5">
        <!-- LINK EXISTING -->
        <div v-show="tab === 'existing'">
          <div class="relative mb-3">
            <svg class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              ref="searchInput"
              v-model="search"
              type="text"
              :placeholder="`Search ${availablePersons.length} people…`"
              class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div class="border border-gray-200 rounded-md max-h-72 overflow-y-auto divide-y divide-gray-100">
            <button
              v-for="p in filteredPersons"
              :key="p.id"
              type="button"
              @click="selectExisting(p)"
              :class="[
                'w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-blue-50 transition-colors cursor-pointer',
                selectedExistingId === p.id ? 'bg-blue-50' : ''
              ]"
            >
              <span class="flex-shrink-0 w-9 h-9 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-600">
                <img v-if="p.main_photo" :src="photoUrl(p.main_photo)" class="w-full h-full object-cover" :alt="p.first_name" />
                <span v-else>{{ initials(p) }}</span>
              </span>
              <span class="flex-1 min-w-0">
                <span class="block font-medium text-gray-900 truncate">
                  {{ p.first_name }} {{ p.last_name || '' }}
                </span>
                <span class="block text-xs text-gray-500">
                  {{ subline(p) }}
                </span>
              </span>
              <span v-if="selectedExistingId === p.id" class="text-blue-600">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
              </span>
            </button>

            <div v-if="!filteredPersons.length" class="px-4 py-6 text-center text-sm text-gray-500">
              <template v-if="search">No matches for "<span class="font-medium">{{ search }}</span>". Try the "Add new person" tab.</template>
              <template v-else>No people available to link. Use "Add new person".</template>
            </div>
          </div>
        </div>

        <!-- ADD NEW -->
        <form v-show="tab === 'new'" @submit.prevent="submit" class="space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <div class="col-span-2 sm:col-span-1">
              <label class="block text-xs font-medium text-gray-600 mb-1">First name <span class="text-red-500">*</span></label>
              <input
                v-model="newPerson.first_name"
                type="text"
                required
                autocomplete="off"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div class="col-span-2 sm:col-span-1">
              <label class="block text-xs font-medium text-gray-600 mb-1">Last name</label>
              <input
                v-model="newPerson.last_name"
                type="text"
                autocomplete="off"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">Gender</label>
              <select
                v-model="newPerson.gender"
                class="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">—</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">Birth year</label>
              <input
                v-model="newPerson.birthYear"
                type="number"
                min="1500"
                :max="currentYear"
                placeholder="e.g. 1985"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <p class="text-xs text-gray-500">
            You can add more details (full birth date, photo, bio, etc.) after creating.
          </p>
        </form>

        <!-- Error -->
        <div v-if="error" class="mt-3 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          <p class="text-sm text-red-800">{{ error }}</p>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-2">
        <button
          type="button"
          @click="close"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="button"
          @click="submit"
          :disabled="!canSubmit || loading"
          :class="[
            'px-4 py-2 text-sm font-medium rounded-md flex items-center cursor-pointer',
            (!canSubmit || loading)
              ? 'bg-blue-300 text-white cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          ]"
        >
          <span v-if="loading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
          {{ submitLabel }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, nextTick } from 'vue'
import { usePersonsStore } from '../stores/persons'
import { useRelationshipsStore } from '../stores/relationships'
import { storeToRefs } from 'pinia'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

// Map UI section -> relationship_type stored with current person as person1_id (URL param)
const SECTION_TO_TYPE = {
  parent: 'child_of',     // current is child of new person
  sibling: 'sibling_of',
  child: 'parent_of',     // current is parent of new person
  spouse: 'spouse_of'
}

const SECTION_TITLE = {
  parent: 'Add Parent',
  sibling: 'Add Sibling',
  child: 'Add Child',
  spouse: 'Add Spouse'
}

export default {
  name: 'QuickAddRelation',
  props: {
    isOpen: { type: Boolean, default: false },
    currentPersonId: { type: Number, required: true },
    currentPersonName: { type: String, default: '' },
    section: {
      type: String,
      required: true,
      validator: v => ['parent', 'sibling', 'child', 'spouse'].includes(v)
    },
    excludePersonIds: { type: Array, default: () => [] }
  },
  emits: ['close', 'created'],
  setup(props, { emit }) {
    const personsStore = usePersonsStore()
    const relationshipsStore = useRelationshipsStore()
    const { persons } = storeToRefs(personsStore)

    const tab = ref('existing')
    const search = ref('')
    const selectedExistingId = ref(null)
    const loading = ref(false)
    const error = ref('')
    const searchInput = ref(null)

    const newPerson = ref({
      first_name: '',
      last_name: '',
      gender: '',
      birthYear: ''
    })

    const currentYear = new Date().getFullYear()

    const title = computed(() => SECTION_TITLE[props.section] || 'Add Relation')
    const submitLabel = computed(() => {
      if (tab.value === 'existing') return selectedExistingId.value ? `Link as ${props.section}` : 'Select a person'
      return `Create & link as ${props.section}`
    })

    const availablePersons = computed(() => {
      const exclude = new Set([props.currentPersonId, ...props.excludePersonIds])
      return persons.value.filter(p => !exclude.has(p.id))
    })

    const filteredPersons = computed(() => {
      const q = search.value.trim().toLowerCase()
      const list = availablePersons.value
      if (!q) {
        return [...list]
          .sort((a, b) => `${a.last_name || ''} ${a.first_name}`.localeCompare(`${b.last_name || ''} ${b.first_name}`))
          .slice(0, 50)
      }
      return list.filter(p => {
        const hay = `${p.first_name || ''} ${p.last_name || ''} ${p.maiden_name || ''}`.toLowerCase()
        return hay.includes(q)
      }).slice(0, 50)
    })

    const canSubmit = computed(() => {
      if (tab.value === 'existing') return selectedExistingId.value != null
      return !!(newPerson.value.first_name && newPerson.value.first_name.trim())
    })

    function tabClass(t) {
      const base = 'flex-1 px-4 py-3 text-sm font-medium transition-colors cursor-pointer'
      return [
        base,
        tab.value === t
          ? 'bg-white text-blue-700 border-b-2 border-blue-600 -mb-px'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
      ]
    }

    function setTab(t) {
      tab.value = t
      error.value = ''
      if (t === 'existing') {
        nextTick(() => searchInput.value?.focus())
      }
    }

    function initials(p) {
      const f = (p.first_name || '').charAt(0).toUpperCase()
      const l = (p.last_name || '').charAt(0).toUpperCase()
      return (f + l) || '?'
    }

    function subline(p) {
      const parts = []
      if (p.birth_date) parts.push(new Date(p.birth_date).getFullYear().toString())
      if (p.location) parts.push(p.location)
      if (p.profession) parts.push(p.profession)
      return parts.join(' · ') || 'No details'
    }

    function photoUrl(url) {
      if (!url) return null
      if (url.startsWith('/uploads/')) return `${API_BASE_URL}${url}`
      return url
    }

    function selectExisting(p) {
      selectedExistingId.value = p.id
    }

    function reset() {
      tab.value = 'existing'
      search.value = ''
      selectedExistingId.value = null
      newPerson.value = { first_name: '', last_name: '', gender: '', birthYear: '' }
      error.value = ''
      loading.value = false
    }

    function close() {
      reset()
      emit('close')
    }

    async function submit() {
      if (!canSubmit.value || loading.value) return
      const relationshipType = SECTION_TO_TYPE[props.section]
      loading.value = true
      error.value = ''

      try {
        if (tab.value === 'existing') {
          const result = await relationshipsStore.createRelationship(props.currentPersonId, {
            relatedPersonId: selectedExistingId.value,
            relationshipType
          })
          emit('created', { mode: 'existing', relationship: result })
        } else {
          const yearNum = parseInt(newPerson.value.birthYear, 10)
          const personPayload = {
            first_name: newPerson.value.first_name.trim(),
            last_name: newPerson.value.last_name.trim() || null,
            gender: newPerson.value.gender || null,
            birth_date: Number.isFinite(yearNum) ? `${yearNum}-01-01` : null
          }
          const result = await relationshipsStore.createRelationshipWithNewPerson(props.currentPersonId, {
            person: personPayload,
            relationshipType
          })
          // refresh persons list so the new person appears in pickers everywhere
          personsStore.fetchPersons()
          emit('created', { mode: 'new', ...result })
        }
        close()
      } catch (err) {
        error.value = err.message || 'Failed to add relation'
      } finally {
        loading.value = false
      }
    }

    watch(() => props.isOpen, async (open) => {
      if (open) {
        reset()
        if (persons.value.length === 0) {
          personsStore.fetchPersons()
        }
        await nextTick()
        searchInput.value?.focus()
      }
    })

    return {
      tab,
      search,
      searchInput,
      selectedExistingId,
      newPerson,
      loading,
      error,
      title,
      submitLabel,
      availablePersons,
      filteredPersons,
      canSubmit,
      currentYear,
      tabClass,
      setTab,
      selectExisting,
      initials,
      subline,
      photoUrl,
      close,
      submit
    }
  }
}
</script>

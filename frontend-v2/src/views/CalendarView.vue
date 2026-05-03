<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Family Calendar</h1>
        <p class="mt-2 text-gray-600">{{ todayLabel }} — births, anniversaries and milestones</p>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span class="ml-4 text-gray-600">Loading calendar…</span>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
        <p class="text-sm text-red-800">{{ error }}</p>
      </div>

      <!-- Content -->
      <div v-else class="space-y-10">

        <!-- 1. Milestone birthdays this year -->
        <section class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-baseline justify-between mb-4">
            <h2 class="text-xl font-semibold text-gray-900">Milestone birthdays in {{ year }}</h2>
            <span class="text-xs text-gray-500">Round-number ages (10, 20, 30, …)</span>
          </div>
          <div v-if="roundBirthdays.length === 0" class="text-sm text-gray-500">
            No round birthdays this year.
          </div>
          <ul v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <li
              v-for="row in roundBirthdays"
              :key="row.person.id"
              class="rounded-lg border border-gray-200 bg-gray-50 hover:bg-white hover:border-blue-300 transition-colors"
            >
              <router-link :to="`/persons/${row.person.id}`" class="block p-4">
                <div class="flex items-center gap-3">
                  <span class="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden bg-blue-100 text-blue-700 flex items-center justify-center font-semibold">
                    <img v-if="row.person.main_photo" :src="photoUrl(row.person.main_photo)" class="w-full h-full object-cover" :alt="row.person.first_name" />
                    <span v-else>{{ initials(row.person) }}</span>
                  </span>
                  <div class="flex-1 min-w-0">
                    <p class="font-medium text-gray-900 truncate">
                      {{ row.person.first_name }} {{ row.person.last_name || '' }}
                    </p>
                    <p class="text-xs text-gray-500">
                      Turns <strong class="text-blue-700">{{ row.age }}</strong> on {{ formatMonthDay(row.nextBirthday) }}
                      <span v-if="row.alreadyPassed" class="text-gray-400">(earlier this year)</span>
                    </p>
                  </div>
                </div>
              </router-link>
            </li>
          </ul>
        </section>

        <!-- 2. Today -->
        <section class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-1">On this day</h2>
          <p class="text-sm text-gray-500 mb-4">{{ todayLabel }}</p>

          <div v-if="!todayHasEvents" class="text-sm text-gray-500">
            No family events recorded for today.
          </div>
          <div v-else class="space-y-4">
            <div v-if="todayBirths.length">
              <h3 class="text-sm font-semibold text-gray-700 mb-2">🎂 Birthdays</h3>
              <ul class="space-y-1">
                <li v-for="p in todayBirths" :key="`tb-${p.id}`" class="text-sm">
                  <router-link :to="`/persons/${p.id}`" class="text-blue-700 hover:text-blue-900 hover:underline">
                    {{ p.first_name }} {{ p.last_name || '' }}
                  </router-link>
                  <span class="text-gray-500">— turns {{ ageThisYear(p) }}</span>
                </li>
              </ul>
            </div>
            <div v-if="todayDeaths.length">
              <h3 class="text-sm font-semibold text-gray-700 mb-2">🕊 In memoriam</h3>
              <ul class="space-y-1">
                <li v-for="p in todayDeaths" :key="`td-${p.id}`" class="text-sm">
                  <router-link :to="`/persons/${p.id}`" class="text-blue-700 hover:text-blue-900 hover:underline">
                    {{ p.first_name }} {{ p.last_name || '' }}
                  </router-link>
                  <span class="text-gray-500">— passed away in {{ yearOf(p.death_date) }}</span>
                </li>
              </ul>
            </div>
            <div v-if="todayMarriages.length">
              <h3 class="text-sm font-semibold text-gray-700 mb-2">💍 Wedding anniversaries</h3>
              <ul class="space-y-1">
                <li v-for="m in todayMarriages" :key="`tm-${m.id}`" class="text-sm">
                  <router-link :to="`/persons/${m.p1_id}`" class="text-blue-700 hover:text-blue-900 hover:underline">
                    {{ m.p1_first_name }} {{ m.p1_last_name || '' }}
                  </router-link>
                  <span class="text-gray-500"> &amp; </span>
                  <router-link :to="`/persons/${m.p2_id}`" class="text-blue-700 hover:text-blue-900 hover:underline">
                    {{ m.p2_first_name }} {{ m.p2_last_name || '' }}
                  </router-link>
                  <span class="text-gray-500">— {{ yearsSince(m.start_date) }} years ({{ yearOf(m.start_date) }})</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <!-- 3. This week (next 7 days) -->
        <section class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">This week</h2>
          <p v-if="!weekBirthdays.length" class="text-sm text-gray-500">No birthdays in the next seven days.</p>
          <ul v-else class="divide-y divide-gray-100">
            <li v-for="row in weekBirthdays" :key="`w-${row.person.id}`" class="py-2 flex items-center justify-between gap-3">
              <router-link :to="`/persons/${row.person.id}`" class="flex items-center gap-3 flex-1 min-w-0 hover:text-blue-700">
                <span class="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden bg-gray-200 text-gray-700 flex items-center justify-center text-xs font-semibold">
                  <img v-if="row.person.main_photo" :src="photoUrl(row.person.main_photo)" class="w-full h-full object-cover" :alt="row.person.first_name" />
                  <span v-else>{{ initials(row.person) }}</span>
                </span>
                <span class="font-medium truncate">{{ row.person.first_name }} {{ row.person.last_name || '' }}</span>
              </router-link>
              <span class="text-sm text-gray-500 flex-shrink-0">{{ formatMonthDay(row.nextBirthday) }} <span class="text-gray-400">· in {{ row.daysUntil }}d · turns {{ row.age }}</span></span>
            </li>
          </ul>
        </section>

        <!-- 4. Coming up in the next month (8-30 days out) -->
        <section class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Within the next month</h2>
          <p v-if="!monthBirthdays.length" class="text-sm text-gray-500">No further birthdays in the next thirty days.</p>
          <ul v-else class="divide-y divide-gray-100">
            <li v-for="row in monthBirthdays" :key="`m-${row.person.id}`" class="py-2 flex items-center justify-between gap-3">
              <router-link :to="`/persons/${row.person.id}`" class="flex items-center gap-3 flex-1 min-w-0 hover:text-blue-700">
                <span class="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden bg-gray-200 text-gray-700 flex items-center justify-center text-xs font-semibold">
                  <img v-if="row.person.main_photo" :src="photoUrl(row.person.main_photo)" class="w-full h-full object-cover" :alt="row.person.first_name" />
                  <span v-else>{{ initials(row.person) }}</span>
                </span>
                <span class="font-medium truncate">{{ row.person.first_name }} {{ row.person.last_name || '' }}</span>
              </router-link>
              <span class="text-sm text-gray-500 flex-shrink-0">{{ formatMonthDay(row.nextBirthday) }} <span class="text-gray-400">· in {{ row.daysUntil }}d · turns {{ row.age }}</span></span>
            </li>
          </ul>
        </section>

        <!-- 5. Births by month (accordions) -->
        <section class="bg-white rounded-xl shadow-sm border border-gray-200 p-2 sm:p-4">
          <div class="px-4 pt-4 pb-2">
            <h2 class="text-xl font-semibold text-gray-900">Births by month</h2>
            <p class="text-sm text-gray-500">Click a month to expand. {{ monthName(currentMonth) }} is shown by default.</p>
          </div>
          <div class="divide-y divide-gray-100">
            <div v-for="month in birthsByMonth" :key="month.month">
              <button
                type="button"
                class="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors text-left cursor-pointer"
                :class="{ 'bg-blue-50/50': month.month === currentMonth }"
                @click="toggleMonth(month.month)"
                :aria-expanded="!!expandedMonths[month.month]"
              >
                <div class="flex items-center gap-3">
                  <svg
                    class="w-5 h-5 text-gray-400 transition-transform"
                    :class="{ 'rotate-90': expandedMonths[month.month] }"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                  <span class="font-semibold text-gray-900">{{ monthName(month.month) }}</span>
                  <span v-if="month.month === currentMonth" class="text-xs uppercase tracking-wide text-blue-700 bg-blue-100 px-2 py-0.5 rounded">This month</span>
                </div>
                <span class="text-sm text-gray-500">{{ month.births.length }} birth{{ month.births.length === 1 ? '' : 's' }}</span>
              </button>
              <div v-show="expandedMonths[month.month]" class="px-4 pb-4">
                <ul v-if="month.births.length" class="divide-y divide-gray-100">
                  <li v-for="row in month.births" :key="`mb-${row.person.id}`" class="py-2 flex items-center justify-between gap-3">
                    <router-link :to="`/persons/${row.person.id}`" class="flex items-center gap-3 flex-1 min-w-0 hover:text-blue-700">
                      <span class="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden bg-gray-200 text-gray-700 flex items-center justify-center text-xs font-semibold">
                        <img v-if="row.person.main_photo" :src="photoUrl(row.person.main_photo)" class="w-full h-full object-cover" :alt="row.person.first_name" />
                        <span v-else>{{ initials(row.person) }}</span>
                      </span>
                      <span class="font-medium truncate">
                        {{ row.person.first_name }} {{ row.person.last_name || '' }}
                        <span v-if="row.person.death_date" class="text-gray-400 text-xs">†</span>
                      </span>
                    </router-link>
                    <span class="text-sm text-gray-500 flex-shrink-0">{{ row.dayLabel }} · {{ row.birthYear }}</span>
                  </li>
                </ul>
                <p v-else class="text-sm text-gray-500 py-2">No births recorded for {{ monthName(month.month) }}.</p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, reactive } from 'vue'
import apiService from '../services/api'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
const MS_PER_DAY = 24 * 60 * 60 * 1000

export default {
  name: 'CalendarView',
  setup() {
    const loading = ref(true)
    const error = ref(null)
    const persons = ref([])
    const marriages = ref([])

    const now = new Date()
    const year = now.getFullYear()
    const currentMonth = now.getMonth() + 1 // 1-12
    const todayMonth = now.getMonth() + 1
    const todayDay = now.getDate()
    const todayLabel = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

    // Accordion state — current month expanded by default
    const expandedMonths = reactive({})
    expandedMonths[currentMonth] = true

    function toggleMonth(m) {
      expandedMonths[m] = !expandedMonths[m]
    }

    function parseDate(s) {
      if (!s || typeof s !== 'string') return null
      const d = new Date(s)
      if (isNaN(d.getTime())) return null
      return d
    }
    function yearOf(s) {
      const d = parseDate(s)
      return d ? d.getFullYear() : '?'
    }
    function ageThisYear(person) {
      const d = parseDate(person.birth_date)
      if (!d) return '?'
      return year - d.getFullYear()
    }
    function yearsSince(s) {
      const d = parseDate(s)
      if (!d) return '?'
      return year - d.getFullYear()
    }
    function formatMonthDay(date) {
      if (!date) return ''
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
    function monthName(m) {
      const d = new Date(2000, m - 1, 1)
      return d.toLocaleDateString('en-US', { month: 'long' })
    }
    function initials(p) {
      const f = (p.first_name || '').charAt(0).toUpperCase()
      const l = (p.last_name || '').charAt(0).toUpperCase()
      return (f + l) || '?'
    }
    function photoUrl(url) {
      if (!url) return null
      if (url.startsWith('/uploads/')) return `${API_BASE_URL}${url}`
      return url
    }

    // Helpers: compute next occurrence of a month-day from today
    function nextOccurrence(monthIdx /* 0-11 */, day /* 1-31 */) {
      const candidate = new Date(year, monthIdx, day)
      const startOfToday = new Date(year, now.getMonth(), now.getDate())
      if (candidate < startOfToday) {
        return new Date(year + 1, monthIdx, day)
      }
      return candidate
    }
    function daysUntil(date) {
      const startOfToday = new Date(year, now.getMonth(), now.getDate())
      return Math.round((date - startOfToday) / MS_PER_DAY)
    }
    function monthDayMatches(s, m, d) {
      const date = parseDate(s)
      return !!date && date.getMonth() + 1 === m && date.getDate() === d
    }
    // Treat as alive for "upcoming" sections only if death_date is empty AND
    // the person isn't implausibly old. Some old records have no death_date
    // recorded even though the person obviously isn't around anymore.
    const MAX_PLAUSIBLE_AGE = 110
    function isAlive(p) {
      if (p.death_date) return false
      const d = parseDate(p.birth_date)
      if (d && (year - d.getFullYear()) > MAX_PLAUSIBLE_AGE) return false
      return true
    }

    // ----- Computed sections -----

    // Round birthdays this year (10, 20, 30, …, alive only)
    const roundBirthdays = computed(() => {
      const rows = []
      for (const p of persons.value) {
        if (!isAlive(p)) continue
        const d = parseDate(p.birth_date)
        if (!d) continue
        const age = year - d.getFullYear()
        if (age <= 0 || age % 10 !== 0) continue
        const thisYearBirthday = new Date(year, d.getMonth(), d.getDate())
        const startOfToday = new Date(year, now.getMonth(), now.getDate())
        rows.push({
          person: p,
          age,
          nextBirthday: thisYearBirthday,
          alreadyPassed: thisYearBirthday < startOfToday,
        })
      }
      // Upcoming first, then already-passed at the bottom
      rows.sort((a, b) => {
        if (a.alreadyPassed !== b.alreadyPassed) return a.alreadyPassed ? 1 : -1
        return a.nextBirthday - b.nextBirthday
      })
      return rows
    })

    // Today's events
    const todayBirths = computed(() => persons.value
      .filter(p => isAlive(p) && monthDayMatches(p.birth_date, todayMonth, todayDay))
      .sort((a, b) => parseDate(a.birth_date) - parseDate(b.birth_date))
    )
    const todayDeaths = computed(() => persons.value
      .filter(p => monthDayMatches(p.death_date, todayMonth, todayDay))
      .sort((a, b) => parseDate(a.death_date) - parseDate(b.death_date))
    )
    const todayMarriages = computed(() => marriages.value
      .filter(m => monthDayMatches(m.start_date, todayMonth, todayDay))
      .sort((a, b) => parseDate(a.start_date) - parseDate(b.start_date))
    )
    const todayHasEvents = computed(() =>
      todayBirths.value.length > 0 || todayDeaths.value.length > 0 || todayMarriages.value.length > 0
    )

    // Birthdays in next 7 days (excluding today), alive only
    const weekBirthdays = computed(() => {
      const rows = []
      for (const p of persons.value) {
        if (!isAlive(p)) continue
        const d = parseDate(p.birth_date)
        if (!d) continue
        const next = nextOccurrence(d.getMonth(), d.getDate())
        const days = daysUntil(next)
        if (days >= 1 && days <= 7) {
          rows.push({
            person: p,
            nextBirthday: next,
            daysUntil: days,
            age: next.getFullYear() - d.getFullYear(),
          })
        }
      }
      rows.sort((a, b) => a.daysUntil - b.daysUntil)
      return rows
    })

    // Birthdays in days 8-30, alive only
    const monthBirthdays = computed(() => {
      const rows = []
      for (const p of persons.value) {
        if (!isAlive(p)) continue
        const d = parseDate(p.birth_date)
        if (!d) continue
        const next = nextOccurrence(d.getMonth(), d.getDate())
        const days = daysUntil(next)
        if (days >= 8 && days <= 30) {
          rows.push({
            person: p,
            nextBirthday: next,
            daysUntil: days,
            age: next.getFullYear() - d.getFullYear(),
          })
        }
      }
      rows.sort((a, b) => a.daysUntil - b.daysUntil)
      return rows
    })

    // All births grouped by birth month (1-12)
    const birthsByMonth = computed(() => {
      const buckets = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, births: [] }))
      for (const p of persons.value) {
        const d = parseDate(p.birth_date)
        if (!d) continue
        buckets[d.getMonth()].births.push({
          person: p,
          day: d.getDate(),
          dayLabel: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          birthYear: d.getFullYear(),
        })
      }
      for (const b of buckets) b.births.sort((a, b) => a.day - b.day || a.birthYear - b.birthYear)
      return buckets
    })

    async function fetchData() {
      loading.value = true
      error.value = null
      try {
        const data = await apiService.getCalendar()
        persons.value = data.persons || []
        marriages.value = data.marriages || []
      } catch (err) {
        error.value = err.message || 'Failed to load calendar'
      } finally {
        loading.value = false
      }
    }

    onMounted(fetchData)

    return {
      loading,
      error,
      year,
      currentMonth,
      todayLabel,
      expandedMonths,
      toggleMonth,
      roundBirthdays,
      todayBirths,
      todayDeaths,
      todayMarriages,
      todayHasEvents,
      weekBirthdays,
      monthBirthdays,
      birthsByMonth,
      ageThisYear,
      yearOf,
      yearsSince,
      formatMonthDay,
      monthName,
      initials,
      photoUrl,
    }
  }
}
</script>

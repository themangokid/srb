<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { CATEGORIES } from '../constants/index.js'

const props = defineProps({
  search:         { type: String,  default: '' },
  filter:         { type: String,  default: 'all' },
  witnessVisible: { type: Boolean, default: false },
})

const emit = defineEmits(['update:search', 'update:filter', 'toggleWitness', 'openSettings'])

// Scroll-compact header
const compact = ref(false)
function onScroll() { compact.value = window.scrollY > 80 }
onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))

// Search (debounced)
let searchTimer = null
function onSearchInput(e) {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => emit('update:search', e.target.value), 250)
}

// Filter dropdown
const dropdownOpen = ref(false)
const dropdownEl   = ref(null)

function selectFilter(key) {
  dropdownOpen.value = false
  emit('update:filter', key)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function currentLabel() {
  if (props.filter === 'all') return 'Kategorier'
  const cat = CATEGORIES[props.filter]
  if (!cat) return props.filter
  const parts = cat.title.split(': ')
  return (parts[1] || cat.title).substring(0, 28)
}

// Close dropdown on outside click
function onDocClick(e) {
  if (dropdownOpen.value && dropdownEl.value && !dropdownEl.value.contains(e.target)) {
    dropdownOpen.value = false
  }
}
onMounted(() => document.addEventListener('click', onDocClick, true))
onUnmounted(() => document.removeEventListener('click', onDocClick, true))

// Keyboard
function onKeydown(e) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
    e.preventDefault()
    document.querySelector('.search-box')?.focus()
  }
  if (e.key === 'Escape' && dropdownOpen.value) {
    dropdownOpen.value = false
  }
}
onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => document.removeEventListener('keydown', onKeydown))
</script>

<template>
  <header class="app-header" :class="{ compact }">
    <div class="nav-container">
      <a href="../index.html" class="logo-link">
        <img
          src="/img/srb_bold_dampended_red_not_done.png"
          class="header-logo"
          alt="SRB Logo"
          onerror="this.style.display='none'"
        />
      </a>

      <h1 class="main-title">Grundtextskillnader i Reformationsbibeln</h1>

      <div class="search-controls">
        <input
          type="text"
          class="search-box"
          placeholder="Sök vers, text eller påverkan..."
          :value="search"
          @input="onSearchInput"
        />

        <div class="filter-wrap" ref="dropdownEl">
          <button
            class="filter-btn"
            :class="{ active: filter !== 'all', open: dropdownOpen }"
            @click.stop="dropdownOpen = !dropdownOpen"
          >
            <span class="filter-btn-text">{{ currentLabel() }}</span>
            <span class="filter-chevron">▼</span>
          </button>

          <div v-if="dropdownOpen" class="filter-dropdown" @click.stop>
            <div
              class="filter-option"
              :class="{ selected: filter === 'all' }"
              @click="selectFilter('all')"
            >
              Alla kategorier (visa alla)
            </div>
            <div
              v-for="(cat, key) in CATEGORIES"
              :key="key"
              class="filter-option"
              :class="{ selected: filter === key }"
              @click="selectFilter(key)"
            >
              <span>{{ cat.emoji }}</span>
              <span>{{ cat.title.split(': ')[1] || cat.title }}</span>
            </div>
          </div>
        </div>

        <button
          class="witness-toggle-btn"
          :class="{ active: witnessVisible }"
          :aria-pressed="witnessVisible"
          :title="witnessVisible ? 'Dölj handskrifter' : 'Visa handskrifter'"
          @click="emit('toggleWitness')"
        >
          <span>📜</span>
          <span class="wtb-label">{{ witnessVisible ? 'Handskrifter på' : 'Handskrifter av' }}</span>
        </button>
      </div>

      <button
        class="settings-btn"
        aria-label="Öppna inställningar"
        title="Inställningar"
        @click="emit('openSettings')"
      >
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>
</template>

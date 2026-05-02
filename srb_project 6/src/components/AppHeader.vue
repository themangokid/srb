<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { CATEGORIES, HOME_URL } from '../constants/index.js'

const props = defineProps({
  search: { type: String, default: '' },
  filter: { type: String, default: 'all' },
})

const emit = defineEmits(['update:search', 'update:filter', 'openSettings'])

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

// Keyword dropdown
const keywordsOpen = ref(false)
const keywordsEl   = ref(null)

const KEYWORD_GROUPS = [
  {
    label: 'Typ av ändring',
    words: ['utelämnar', 'tillägger', 'hela vers', 'parentes', 'ändrar', 'pronomen'],
  },
  {
    label: 'Borttagna nyckelversar',
    words: ['Mark 16', 'Apg 8:37', '1 Joh 5:7', 'Joh 7:53', 'riket är ditt'],
  },
  {
    label: 'Blodsförsoningen',
    words: ['blod', 'förlossning', 'förlåtelse', 'renat'],
  },
  {
    label: 'Jesu identitet & gudom',
    words: ['Guds Son', 'Kristus', 'Herren', 'Gud'],
  },
  {
    label: 'Omvändelse & helgelse',
    words: ['omvändelse', 'fasta', 'kors', 'bön och fasta'],
  },
  {
    label: 'Maria & jungfrufödsel',
    words: ['förstfödde', 'hustru', 'jungfru'],
  },
]

function selectKeyword(word) {
  keywordsOpen.value = false
  emit('update:search', props.search === word ? '' : word)
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

// Close both dropdowns on outside click
function onDocClick(e) {
  if (dropdownOpen.value && dropdownEl.value && !dropdownEl.value.contains(e.target)) {
    dropdownOpen.value = false
  }
  if (keywordsOpen.value && keywordsEl.value && !keywordsEl.value.contains(e.target)) {
    keywordsOpen.value = false
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
  if (e.key === 'Escape') {
    dropdownOpen.value = false
    keywordsOpen.value = false
  }
}
onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => document.removeEventListener('keydown', onKeydown))
</script>

<template>
  <header class="app-header" :class="{ compact }">
    <div class="nav-container">
      <a :href="HOME_URL" class="logo-link">
        <img
          src="/img/main_srb_v16_lower_text_innershadow.webp"
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

        <div class="keywords-wrap" ref="keywordsEl">
          <button
            class="filter-btn keywords-btn"
            :class="{ open: keywordsOpen }"
            @click.stop="keywordsOpen = !keywordsOpen; dropdownOpen = false"
          >
            <span class="filter-btn-text">Sökord</span>
            <span class="filter-chevron">▼</span>
          </button>

          <div v-if="keywordsOpen" class="filter-dropdown keywords-dropdown" @click.stop>
            <template v-for="group in KEYWORD_GROUPS" :key="group.label">
              <div class="kw-group-label">{{ group.label }}</div>
              <div class="kw-chips">
                <button
                  v-for="word in group.words"
                  :key="word"
                  class="kw-chip"
                  :class="{ active: search === word }"
                  @click="selectKeyword(word)"
                >{{ word }}</button>
              </div>
            </template>
          </div>
        </div>

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

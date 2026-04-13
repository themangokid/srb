<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { allVariants } from './data/verse_data_400_with_witnesses.js'
import { CATEGORIES } from './constants/index.js'
import { useSettings } from './composables/useSettings.js'
import { readUrlParams, pushUrlState } from './composables/useUrlState.js'
import AppHeader from './components/AppHeader.vue'
import WitnessLegend from './components/WitnessLegend.vue'
import CategorySection from './components/CategorySection.vue'
import SummarySection from './components/SummarySection.vue'
import SettingsPanel from './components/SettingsPanel.vue'
import BibleViewer  from './components/BibleViewer.vue'

const { settings, toggle, resetSettings } = useSettings()

// UI state
const searchTerm        = ref('')
const currentFilter     = ref('all')
const witnessColVisible = ref(false)
const settingsPanelOpen = ref(false)

// Apply witness-column body class
watch(witnessColVisible, val => {
  document.body.classList.toggle('witnesses-hidden', !val)
}, { immediate: true })

// Normalize a string: NFC + lower-case + strip soft-hyphens
function norm(s) {
  return (s ?? '').normalize('NFC').toLowerCase().replace(/\u00ad/g, '')
}

// Filtered variants (reactive computed — no manual re-renders needed)
const filteredVariants = computed(() => {
  const term = norm(searchTerm.value.trim())
  const base = currentFilter.value === 'all'
    ? allVariants
    : allVariants.filter(v => v.category === currentFilter.value)
  if (!term) return base
  return base.filter(v =>
    norm(v.verse).includes(term) ||
    norm(v.tr_text).includes(term) ||
    norm(v.un_text).includes(term) ||
    norm(v.impact).includes(term)
  )
})

// Grouped by category (preserves CATEGORIES key order)
const groupedVariants = computed(() => {
  const result = {}
  for (const key of Object.keys(CATEGORIES)) {
    result[key] = filteredVariants.value.filter(v => v.category === key)
  }
  return result
})

const hasResults = computed(() => filteredVariants.value.length > 0)

// URL sync
watch([searchTerm, currentFilter, witnessColVisible], () => {
  pushUrlState({
    category:  currentFilter.value,
    search:    searchTerm.value,
    witnesses: witnessColVisible.value,
    verse:     '',
  })
})

function scrollToVerse(verseStr) {
  if (!verseStr) return
  const needle = verseStr.trim().toLowerCase()
  function attempt(retries) {
    const els = document.querySelectorAll('.card-verse-link, .verse-link, .verse-ref')
    for (const el of els) {
      if (el.textContent.trim().toLowerCase() === needle) {
        const target = el.closest('.variant-card') || el.closest('tr') || el
        target.scrollIntoView({ behavior: 'smooth', block: 'center' })
        target.classList.add('url-highlight')
        setTimeout(() => target.classList.remove('url-highlight'), 2500)
        return
      }
    }
    if (retries > 0) setTimeout(() => attempt(retries - 1), 150)
  }
  requestAnimationFrame(() => attempt(5))
}

onMounted(() => {
  const params = readUrlParams()
  witnessColVisible.value = params.witnesses
  currentFilter.value     = params.category
  searchTerm.value        = params.search
  if (params.verse) setTimeout(() => scrollToVerse(params.verse), 300)
})
</script>

<template>
  <AppHeader
    v-model:search="searchTerm"
    v-model:filter="currentFilter"
    @open-settings="settingsPanelOpen = true"
  />

  <WitnessLegend :visible="witnessColVisible" />

  <main class="main-content">
    <div v-if="!hasResults" class="no-results">
      <i class="fa-solid fa-magnifying-glass"></i>
      Inga resultat hittades för "<strong>{{ searchTerm }}</strong>"
    </div>

    <template v-else>
      <CategorySection
        v-for="key in Object.keys(CATEGORIES)"
        :key="key"
        :category-key="key"
        :category-data="CATEGORIES[key]"
        :variants="groupedVariants[key]"
        :witness-visible="witnessColVisible"
      />
    </template>

    <SummarySection />
  </main>

  <SettingsPanel
    v-model:open="settingsPanelOpen"
    :settings="settings"
    :witness-visible="witnessColVisible"
    @toggle="toggle"
    @reset="resetSettings"
    @toggle-witness="witnessColVisible = !witnessColVisible"
  />

  <BibleViewer />
</template>

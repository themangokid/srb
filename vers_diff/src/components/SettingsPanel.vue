<script setup>
import { SETTINGS_DEFS } from '../composables/useSettings.js'

const props = defineProps({
  open:           { type: Boolean, required: true },
  settings:       { type: Object,  required: true },
  witnessVisible: { type: Boolean, default: false },
  datasetId:      { type: String,  default: 'standard' },
})

const emit = defineEmits(['update:open', 'toggle', 'reset', 'toggleWitness', 'setDataset', 'resetIntro', 'openApparatus'])

const DATASETS = [
  { id: 'complete', title: 'Komplett lista',     count: '1 129 varianter' },
  { id: 'standard', title: 'Utvalda varianter',  count: '400 – med handskrifter' },
  { id: 'full',     title: 'Utökad lista',        count: '~480 varianter' },
]

const PDF_URL = '/SRBgrundtextskillnader.pdf'

const groups = [
  { title: 'Utseende',  ids: ['dark', 'sepia', 'large-font', 'compact-rows'] },
  { title: 'Layout',    ids: ['minimal-header', 'hide-impact'] },
  { title: 'Läshjälp', ids: ['highlight-tr', 'always-witnesses'] },
]


function defFor(id) {
  return SETTINGS_DEFS.find(d => d.id === id)
}

function close() { emit('update:open', false) }

// Close on Escape
import { onMounted, onUnmounted } from 'vue'
function onKeydown(e) {
  if (e.key === 'Escape' && props.open) close()
}
onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => document.removeEventListener('keydown', onKeydown))
</script>

<template>
  <!-- Overlay -->
  <div class="settings-overlay" :class="{ open }" @click="close" />

  <!-- Panel -->
  <aside class="settings-panel" :class="{ open }" role="dialog" aria-modal="true" aria-label="Inställningar">
    <div class="settings-header">
      <h2>⚙️ Inställningar</h2>
      <button class="settings-close-btn" aria-label="Stäng" @click="close">✕</button>
    </div>

    <div class="settings-body">
      <!-- Apparatus viewer -->
      <div class="settings-group">
        <div class="settings-group-title">🔬 Handskriftsapparaten</div>
        <button
          class="apparatus-open-btn"
          @click="emit('openApparatus'); emit('update:open', false)"
        >
          📜 Öppna handskriftsapparaten
          <small>Fullständigt handskriftsstöd för NT-varianter</small>
        </button>
      </div>

      <!-- Dataset selector — most impactful setting, shown first -->
      <div class="settings-group dataset-group">
        <div class="settings-group-title">📖 Datamängd</div>
        <div class="dataset-cards">
          <button
            v-for="ds in DATASETS"
            :key="ds.id"
            class="dataset-card"
            :class="{ active: props.datasetId === ds.id }"
            @click="emit('setDataset', ds.id)"
          >
            <span class="dataset-card-check">{{ props.datasetId === ds.id ? '✔' : '' }}</span>
            <span class="dataset-card-body">
              <strong class="dataset-card-title">{{ ds.title }}</strong>
              <span class="dataset-card-count">{{ ds.count }}</span>
            </span>
          </button>
          <a
            class="dataset-card dataset-card-pdf"
            :href="PDF_URL"
            download
          >
            <span class="dataset-card-check">↓</span>
            <span class="dataset-card-body">
              <strong class="dataset-card-title">Ladda ner PDF</strong>
              <span class="dataset-card-count">Komplett, 900+ varianter</span>
            </span>
          </a>
        </div>
      </div>

      <!-- Witness column toggle — moved here from header -->
      <div class="settings-group">
        <div class="settings-group-title">Handskrifter</div>
        <div class="setting-row">
          <label for="set-witnesses" class="setting-label">
            Visa handskrifter
            <small>Visar manuskript­kolumnen i tabellen</small>
          </label>
          <label class="toggle-switch">
            <input
              type="checkbox"
              id="set-witnesses"
              :checked="witnessVisible"
              @change="emit('toggleWitness')"
            />
            <span class="toggle-track"></span>
          </label>
        </div>
      </div>

      <div v-for="group in groups" :key="group.title" class="settings-group">
        <div class="settings-group-title">{{ group.title }}</div>

        <div
          v-for="id in group.ids"
          :key="id"
          class="setting-row"
        >
          <template v-if="defFor(id)">
            <label :for="`set-${id}`" class="setting-label">
              {{ defFor(id).label }}
              <small>{{ defFor(id).desc }}</small>
            </label>
            <label class="toggle-switch">
              <input
                type="checkbox"
                :id="`set-${id}`"
                :checked="!!settings[id]"
                @change="emit('toggle', id)"
              />
              <span class="toggle-track"></span>
            </label>
          </template>
        </div>
      </div>
    </div>

    <button class="settings-intro-btn" @click="emit('resetIntro'); emit('update:open', false)">
      Visa intro igen
    </button>

    <button class="settings-reset-btn" @click="emit('reset')">
      ↺ Återställ alla inställningar
    </button>
  </aside>
</template>

<script setup>
import { SETTINGS_DEFS } from '../composables/useSettings.js'

const props = defineProps({
  open:           { type: Boolean, required: true },
  settings:       { type: Object,  required: true },
  witnessVisible: { type: Boolean, default: false },
})

const emit = defineEmits(['update:open', 'toggle', 'reset', 'toggleWitness'])

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

    <button class="settings-reset-btn" @click="emit('reset')">
      ↺ Återställ alla inställningar
    </button>
  </aside>
</template>

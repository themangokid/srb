<script setup>
import { ref, computed } from 'vue'
import { generateBibleLink, isRedundantImpact, WITNESS_TYPES, WITNESS_NAMES, TYPE_ORDER } from '../constants/index.js'

const props = defineProps({
  variant: { type: Object, required: true },
})

const witnessExpanded = ref(false)

const bibleUrl = computed(() => generateBibleLink(props.variant.verse))
const impactRedundant = computed(() => isRedundantImpact(props.variant.impact, props.variant.un_text))
const witnessCount    = computed(() => {
  const w = props.variant.witnesses
  return w ? (w.tr?.length || 0) + (w.un?.length || 0) : 0
})

function chipDisplay(w) {
  const full = WITNESS_NAMES[w.s] || w.s
  return full.split(' (~')[0].split(' (')[0]
}

function groupedWitnesses(list) {
  if (!list?.length) return []
  const groups = {}
  list.forEach(w => { (groups[w.t] = groups[w.t] || []).push(w) })
  return TYPE_ORDER.filter(t => groups[t]).map(t => ({ type: t, items: groups[t] }))
}
</script>

<template>
  <div class="variant-card">
    <div class="card-header">
      <template v-if="bibleUrl">
        <a :href="bibleUrl" target="_blank" rel="noopener" class="card-verse-link">{{ variant.verse }}</a>
        <a :href="`${bibleUrl}?parallel=154`" target="_blank" rel="noopener" class="verse-parallel-link" title="Parallell jämförelse (SRB / SFB)">⇌</a>
      </template>
      <span v-else class="card-verse-link">{{ variant.verse }}</span>
    </div>

    <div class="card-content">
      <div class="card-section tr-section">
        <div class="card-section-title">Utdrag (TR)</div>
        <div class="card-section-content">{{ variant.tr_text }}</div>
      </div>

      <div class="card-section un-section">
        <div class="card-section-title">UN-text</div>
        <div class="card-section-content">{{ variant.un_text }}</div>
      </div>

      <div v-if="variant.impact" class="card-section impact-section">
        <div class="card-section-title">Påverkan</div>
        <div class="card-section-content">{{ variant.impact }}</div>
      </div>

      <div v-if="variant.witnesses" class="card-section witness-mob-section" :class="{ 'mob-collapsed': !witnessExpanded }">
        <div class="card-section-title">
          Handskrifter ({{ witnessCount }})
          <span style="display:flex; gap:8px; align-items:center">
            <button class="mob-witness-toggle" @click="witnessExpanded = !witnessExpanded" :aria-expanded="witnessExpanded">
              {{ witnessExpanded ? 'Dölj' : 'Visa' }} <span class="mob-w-arrow">▾</span>
            </button>
          </span>
        </div>

        <div class="mob-witness-content">
          <div class="wm-side">
            <span class="w-side-badge w-label-tr">TR</span>
            <div class="wm-chips">
              <template v-for="group in groupedWitnesses(variant.witnesses.tr)" :key="group.type">
                <span class="w-group-label" :class="WITNESS_TYPES[group.type].cssClass">
                  {{ WITNESS_TYPES[group.type].label }}
                </span>
                <a
                  v-for="w in group.items"
                  :key="w.s"
                  :href="GNT_PATH"
                  target="_blank"
                  rel="noopener"
                  class="w-chip"
                  :class="WITNESS_TYPES[w.t].cssClass"
                  :title="WITNESS_NAMES[w.s] || w.s"
                >{{ chipDisplay(w) }}</a>
              </template>
            </div>
          </div>

          <div class="wm-side" style="margin-top:6px">
            <span class="w-side-badge w-label-un">UN</span>
            <div class="wm-chips">
              <template v-for="group in groupedWitnesses(variant.witnesses.un)" :key="group.type">
                <span class="w-group-label" :class="WITNESS_TYPES[group.type].cssClass">
                  {{ WITNESS_TYPES[group.type].label }}
                </span>
                <a
                  v-for="w in group.items"
                  :key="w.s"
                  :href="GNT_PATH"
                  target="_blank"
                  rel="noopener"
                  class="w-chip"
                  :class="WITNESS_TYPES[w.t].cssClass"
                  :title="WITNESS_NAMES[w.s] || w.s"
                >{{ chipDisplay(w) }}</a>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

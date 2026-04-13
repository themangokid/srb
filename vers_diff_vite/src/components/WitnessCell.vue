<script setup>
import { ref, computed } from 'vue'
import { WITNESS_TYPES, WITNESS_NAMES, TYPE_ORDER, GNT_PATH } from '../constants/index.js'

const props = defineProps({
  witnesses: { type: Object, default: null },
})

const expanded = ref(false)

const presentTypes = computed(() => {
  if (!props.witnesses) return []
  const all = [...(props.witnesses.tr || []), ...(props.witnesses.un || [])]
  const types = new Set(all.map(w => w.t))
  return TYPE_ORDER.filter(t => types.has(t))
})

const trCount = computed(() => props.witnesses?.tr?.length || 0)
const unCount = computed(() => props.witnesses?.un?.length || 0)

function chipDisplay(w) {
  const full = WITNESS_NAMES[w.s] || w.s
  return full.split(' (~')[0].split(' (')[0]
}

function chipTitle(w) {
  const full = WITNESS_NAMES[w.s] || w.s
  const typeLabel = WITNESS_TYPES[w.t]?.label || w.t
  return `${full} · ${typeLabel}`
}

function groupedWitnesses(list) {
  if (!list?.length) return []
  const groups = {}
  list.forEach(w => { (groups[w.t] = groups[w.t] || []).push(w) })
  return TYPE_ORDER.filter(t => groups[t]).map(t => ({ type: t, items: groups[t] }))
}
</script>

<template>
  <td class="witness-col" :class="{ 'wc-empty': !witnesses }">
    <template v-if="witnesses">
      <button
        class="w-toggle-btn"
        :aria-expanded="expanded"
        title="Klicka för att visa/dölja handskrifter"
        @click="expanded = !expanded"
      >
        <span class="w-summary">
          <span
            v-for="t in presentTypes"
            :key="t"
            class="w-dot"
            :class="WITNESS_TYPES[t].cssClass"
            :title="WITNESS_TYPES[t].label"
          ></span>
          <span class="w-counts">
            <span class="w-count-tr" title="TR-vittnen">{{ trCount }}</span>
            <span class="w-count-sep">/</span>
            <span class="w-count-un" title="UN-vittnen">{{ unCount }}</span>
          </span>
        </span>
        <span class="w-arrow" aria-hidden="true">▸</span>
      </button>

      <div v-if="expanded" class="w-expanded" role="region">
        <div class="w-exp-side">
          <span class="w-side-badge w-label-tr">TR stöds av</span>
          <div class="w-exp-chips">
            <template v-if="witnesses.tr?.length">
              <span v-for="group in groupedWitnesses(witnesses.tr)" :key="group.type" class="w-group">
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
                  :title="chipTitle(w)"
                >{{ chipDisplay(w) }}</a>
              </span>
            </template>
            <span v-else class="w-no-data">ingen data</span>
          </div>
        </div>

        <div class="w-exp-side">
          <span class="w-side-badge w-label-un">UN stöds av</span>
          <div class="w-exp-chips">
            <template v-if="witnesses.un?.length">
              <span v-for="group in groupedWitnesses(witnesses.un)" :key="group.type" class="w-group">
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
                  :title="chipTitle(w)"
                >{{ chipDisplay(w) }}</a>
              </span>
            </template>
            <span v-else class="w-no-data">ingen data</span>
          </div>
        </div>

        <a :href="GNT_PATH" target="_blank" rel="noopener" class="w-reg-link">
          📖 Öppna Vittnesregister
        </a>
      </div>
    </template>

    <span v-else class="w-no-data">—</span>
  </td>
</template>

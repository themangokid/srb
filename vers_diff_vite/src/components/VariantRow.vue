<script setup>
import { computed } from 'vue'
import { generateBibleLink, isRedundantImpact } from '../constants/index.js'
import WitnessCell from './WitnessCell.vue'
import { useBibleViewer } from '../composables/useBibleViewer.js'

const props = defineProps({
  variant:        { type: Object,  required: true },
  witnessVisible: { type: Boolean, default: false },
})

const bibleUrl        = computed(() => generateBibleLink(props.variant.verse))
const impactRedundant = computed(() => isRedundantImpact(props.variant.impact, props.variant.un_text))

const { open: openViewer } = useBibleViewer()
</script>

<template>
  <tr>
    <!-- Verse -->
    <td class="col-verse">
      <template v-if="bibleUrl">
        <a
          href="#"
          class="verse-link"
          title="Öppna i YouVersion"
          @click.prevent="openViewer(bibleUrl, variant.verse)"
        >{{ variant.verse }}</a>
      </template>
      <span v-else class="verse-ref">{{ variant.verse }}</span>
    </td>

    <!-- TR text -->
    <td class="col-tr">
      <div class="tr-text">{{ variant.tr_text }}</div>
    </td>

    <!-- UN text -->
    <td class="col-un">
      <div class="un-text">{{ variant.un_text }}</div>
    </td>

    <!-- Impact -->
    <td class="col-impact impact-col">
      <span v-if="impactRedundant" class="impact-same">—</span>
      <div v-else class="impact-text">{{ variant.impact }}</div>
    </td>

    <!-- Witness -->
    <WitnessCell :witnesses="variant.witnesses ?? null" />
  </tr>
</template>

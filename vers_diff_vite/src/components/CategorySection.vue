<script setup>
import VariantRow  from './VariantRow.vue'
import MobileCard  from './MobileCard.vue'
import { GNT_PATH } from '../constants/index.js'

const props = defineProps({
  categoryKey:    { type: String,  required: true },
  categoryData:   { type: Object,  required: true },
  variants:       { type: Array,   required: true },
  witnessVisible: { type: Boolean, default: false },
})
</script>

<template>
  <section
    v-if="variants.length > 0"
    class="category-section"
    :id="categoryKey"
    :data-category="categoryKey"
  >
    <h2 class="category-title">
      <span class="cat-emoji" aria-hidden="true">{{ categoryData.emoji }}</span>
      {{ categoryData.title }}
    </h2>
    <div class="category-info">
      {{ variants.length }} {{ variants.length === 1 ? 'vers' : 'verser' }} i denna kategori
    </div>

    <!-- Desktop table -->
    <table class="variant-table">
      <thead>
        <tr>
          <th class="col-verse">Vers</th>
          <th class="col-tr">Utdrag från PDF (TR)</th>
          <th class="col-un">UN-text</th>
          <th class="col-impact impact-col">Påverkan</th>
          <th class="col-witness witness-col">
            Handskrifter
            <a :href="GNT_PATH" target="_blank" rel="noopener" class="th-ms-link" title="Öppna Vittnesregister">↗</a>
          </th>
        </tr>
      </thead>
      <tbody>
        <VariantRow
          v-for="(v, i) in variants"
          :key="`${categoryKey}-${i}`"
          :variant="v"
          :witness-visible="witnessVisible"
        />
      </tbody>
    </table>

    <!-- Mobile cards -->
    <div class="mobile-card-container">
      <MobileCard
        v-for="(v, i) in variants"
        :key="`${categoryKey}-m-${i}`"
        :variant="v"
      />
    </div>
  </section>
</template>

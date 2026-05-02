<script setup>
defineEmits(['dismiss'])

const panels = [
  {
    tag:   'TR / UN',
    color: 'var(--c-byz)',
    title: 'Vad är den här sidan?',
    body:  'Textus Receptus (TR) är den traditionella grekiska texten som Reformationsbibeln (SRB) bygger på. Den moderna kritiska texten (UN/UBS·NA) ligger till grund för de flesta översättningar efter 1881. Den här sidan listar ställen där de skiljer sig teologiskt.',
  },
  {
    tag:   '18 kat.',
    color: 'var(--accent)',
    title: 'Kategorierna',
    body:  'Varianterna är indelade i 18 kategorier efter teologisk tyngd — från kritiska doktrinära skillnader (kat. 1) till mindre varianter (kat. 16–18). Använd kategori-filtret i menyn för att fokusera på ett område.',
  },
  {
    tag:   'SV källa',
    color: 'var(--c-cod)',
    title: 'Citatkällor',
    body:  'UN-kolumnen citerar Bibel 2000 och Folkbibeln — båda baserade på den moderna kritiska grundtexten (UBS 1975 / NA 1979). TR-kolumnen är hämtad direkt ur Reformationsbibelns PDF.',
  },
]
</script>

<template>
  <div class="info-banner" role="note" aria-label="Introduktion">
    <div class="info-panels">
      <div v-for="p in panels" :key="p.tag" class="info-panel">
        <span class="info-panel-tag" :style="{ background: p.color }">{{ p.tag }}</span>
        <div class="info-panel-body">
          <strong class="info-panel-title">{{ p.title }}</strong>
          <p class="info-panel-text">{{ p.body }}</p>
        </div>
      </div>
    </div>
    <button class="info-banner-close" title="Stäng" aria-label="Stäng intro" @click="$emit('dismiss')">✕</button>
  </div>
</template>

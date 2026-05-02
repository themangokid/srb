<script setup>
defineProps({ visible: { type: Boolean, default: false } })
</script>

<template>
  <div v-if="visible" class="witness-legend-bar">
    <strong style="font-size:.78rem; color:var(--accent); margin-right:4px">Handskrifter:</strong>
    <span class="wl-item"><span class="wl-swatch wl-pap"></span>Papyri</span>
    <span class="wl-item"><span class="wl-swatch wl-cod"></span>Kodex</span>
    <span class="wl-item"><span class="wl-swatch wl-byz"></span>Bysantinsk/Min.</span>
    <span class="wl-item"><span class="wl-swatch wl-ver"></span>Gamla vers.</span>
    <span class="wl-item"><span class="wl-swatch wl-pat"></span>Kyrkofäder</span>
    <span class="wl-item"><span class="wl-swatch wl-tr"></span>TR-utgåvor</span>
    <span class="wl-wip">– Under uppbyggnad!</span>
    <span style="margin-left:auto; font-size:.75rem; opacity:.6">Klicka ▸ i tabellen för att expandera</span>
  </div>
</template>

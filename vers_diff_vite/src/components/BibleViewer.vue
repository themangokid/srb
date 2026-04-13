<script setup>
import { ref } from 'vue'
import { useBibleViewer } from '../composables/useBibleViewer.js'

const { isOpen, currentUrl, currentVerse, close } = useBibleViewer()

const iframeError = ref(false)
const parallelUrl = ref(false)

function onIframeLoad(e) {
  // Can't detect X-Frame-Options blocks reliably from JS,
  // but we can check if the iframe loaded an about:blank fallback.
  try {
    const doc = e.target.contentDocument
    if (!doc || doc.location.href === 'about:blank') iframeError.value = true
  } catch {
    // Cross-origin — means the page loaded fine
    iframeError.value = false
  }
}

function toggleParallel() {
  parallelUrl.value = !parallelUrl.value
  iframeError.value = false
}

function getUrl() {
  return parallelUrl.value ? currentUrl.value + '?parallel=154' : currentUrl.value
}

function openExternal() {
  window.open(getUrl(), '_blank', 'noopener')
}

import { watch } from 'vue'
watch(currentUrl, () => { iframeError.value = false })
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen" class="bv-backdrop" @click.self="close" />

    <aside v-if="isOpen" class="bv-panel" role="dialog" aria-label="Bibelvisare">
      <div class="bv-header">
        <span class="bv-verse-label">{{ currentVerse }}</span>
        <div class="bv-header-actions">
          <button
            class="bv-btn"
            :class="{ active: parallelUrl }"
            title="Visa parallell jämförelse (SRB ⇌ SFB)"
            @click="toggleParallel"
          >⇌ Parallell</button>
          <button class="bv-btn" title="Öppna i ny flik" @click="openExternal">↗ Ny flik</button>
          <button class="bv-close" aria-label="Stäng" @click="close">✕</button>
        </div>
      </div>

      <div class="bv-body">
        <div v-if="iframeError" class="bv-blocked">
          <p>YouVersion tillåter inte inbäddning.</p>
          <button class="bv-fallback-btn" @click="openExternal">↗ Öppna {{ currentVerse }} i ny flik</button>
        </div>
        <iframe
          v-else
          :key="getUrl()"
          :src="getUrl()"
          class="bv-iframe"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          referrerpolicy="no-referrer"
          @load="onIframeLoad"
        />
      </div>
    </aside>
  </Teleport>
</template>

<style scoped>
.bv-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.35);
  z-index: 500;
}

.bv-panel {
  position: fixed;
  top: 0; right: 0; bottom: 0;
  width: min(560px, 100vw);
  background: var(--bg-card);
  border-left: 1px solid var(--border);
  box-shadow: var(--shadow-lg);
  z-index: 501;
  display: flex;
  flex-direction: column;
  animation: slideIn .2s ease;
}

@keyframes slideIn {
  from { transform: translateX(100%); }
  to   { transform: translateX(0); }
}

.bv-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background: var(--bg-table-head);
  border-bottom: 1px solid var(--border);
  gap: 10px;
  flex-shrink: 0;
}

.bv-verse-label {
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 1rem;
  color: var(--accent);
}

.bv-header-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.bv-btn {
  font-family: var(--font-ui);
  font-size: .78rem;
  padding: 4px 10px;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: var(--bg-card);
  color: var(--text-muted);
  cursor: pointer;
  transition: border-color .15s, background .15s, color .15s;
}
.bv-btn:hover, .bv-btn.active {
  border-color: var(--accent);
  color: var(--accent);
  background: var(--bg-hover);
}

.bv-close {
  background: none;
  border: 1px solid var(--border);
  border-radius: 4px;
  width: 28px; height: 28px;
  cursor: pointer;
  color: var(--text-muted);
  font-size: .95rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background .15s, color .15s;
}
.bv-close:hover { background: var(--bg-hover); color: var(--accent); }

.bv-body {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.bv-iframe {
  width: 100%;
  height: 100%;
  border: none;
  flex: 1;
}

.bv-blocked {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 40px 24px;
  color: var(--text-muted);
  font-family: var(--font-ui);
  font-size: .9rem;
  text-align: center;
}

.bv-fallback-btn {
  font-family: var(--font-ui);
  font-size: .88rem;
  padding: 8px 20px;
  border: 1.5px solid var(--accent);
  border-radius: 6px;
  background: none;
  color: var(--accent);
  cursor: pointer;
  transition: background .15s;
}
.bv-fallback-btn:hover { background: var(--bg-hover); }
</style>

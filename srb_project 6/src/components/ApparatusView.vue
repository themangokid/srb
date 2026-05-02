<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const emit = defineEmits(['close'])

// ── Data state ────────────────────────────────────────────────────
const allVerses  = ref([])
const URLS       = ref([])
const META       = ref({})
const loadPct    = ref(0)      // 0–100
const loadDone   = ref(false)
const loadError  = ref('')

// ── Load with progress ────────────────────────────────────────────
onMounted(async () => {
  try {
    const resp = await fetch('/apparatus_full.json')
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`)

    const total  = parseInt(resp.headers.get('content-length') || '0')
    const reader = resp.body.getReader()
    let received = 0
    const chunks = []

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      chunks.push(value)
      received += value.length
      if (total) loadPct.value = Math.min(99, Math.round(received / total * 100))
    }

    loadPct.value = 99
    const text   = new TextDecoder().decode(
      chunks.reduce((a, b) => { const c = new Uint8Array(a.length + b.length); c.set(a); c.set(b, a.length); return c }, new Uint8Array(0))
    )
    const parsed = JSON.parse(text)
    URLS.value   = parsed.urls   || []
    META.value   = parsed.meta   || {}
    allVerses.value = parsed.verses || []
    loadPct.value   = 100
    loadDone.value  = true
  } catch (e) {
    loadError.value = e.message
  }
})

// ── Search ────────────────────────────────────────────────────────
const search = ref('')
let searchTimer = null
function onInput(e) {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => { search.value = e.target.value }, 200)
}

function norm(s) {
  return (s ?? '').normalize('NFC').toLowerCase().replace(/\u00ad/g,'')
}

const filtered = computed(() => {
  const q = norm(search.value.trim())
  if (!q) return allVerses.value
  return allVerses.value.filter(v =>
    norm(v.v).includes(q) ||
    norm(v.srb).includes(q) ||
    v.trw?.some(w => norm(w.g).includes(q) || norm(w.e).includes(q))
  )
})

// ── Expand ────────────────────────────────────────────────────────
const expanded = ref({})
function toggle(ref) {
  expanded.value[ref] = !expanded.value[ref]
  if (popover.value) popover.value = null
}

// ── Chip helpers ──────────────────────────────────────────────────
const TYPE_CSS = {
  pap:'av-chip-pap', cod:'av-chip-cod', min:'av-chip-min',
  byz:'av-chip-byz', fam:'av-chip-fam', lec:'av-chip-lec',
  ver:'av-chip-ver', pat:'av-chip-pat', edi:'av-chip-edi',
}
function chipCss(w)   { return TYPE_CSS[w[1]] || 'av-chip-min' }
function chipLabel(w) { return w[0] }
function chipUrl(w)   { return w[2] >= 0 ? URLS.value[w[2]] : '' }
function chipMeta(w)  { return w[2] >= 0 ? META.value[w[2]] : null }
function hasMeta(w)   { return w[2] >= 0 && META.value[w[2]] != null }

// ── Popover ───────────────────────────────────────────────────────
const popover = ref(null)

function openPopover(event, w) {
  event.preventDefault()
  event.stopPropagation()
  if (!hasMeta(w) && !chipUrl(w)) return
  const rect  = event.currentTarget.getBoundingClientRect()
  const above = rect.top > window.innerHeight / 2
  if (popover.value?.siglum === w[0]) { popover.value = null; return }
  popover.value = {
    siglum: w[0], url: chipUrl(w), meta: chipMeta(w),
    x: rect.left + rect.width / 2,
    y: above ? rect.top - 8 : rect.bottom + 8,
    above, type: w[1],
  }
}
function closePopover() { popover.value = null }

function onDocClick(e) {
  if (!e.target.closest('.av-popover') && !e.target.closest('.av-chip')) {
    popover.value = null
  }
}
onMounted(() => document.addEventListener('click', onDocClick))
onUnmounted(() => document.removeEventListener('click', onDocClick))

// ── Apparatus helpers ─────────────────────────────────────────────
function badgeClass(r) {
  if (r.tr && r.byz) return 'av-badge-tr'
  if (r.tr)           return 'av-badge-tr'
  if (r.byz)          return 'av-badge-byz'
  return 'av-badge-na'
}
function badgeText(r) {
  if (r.tr && r.byz) return 'TR + Byz'
  if (r.tr)           return 'TR'
  if (r.byz)          return 'Byz'
  return 'UBS/NA'
}
function sortedApp(app) {
  return [...app].sort((a,b) => {
    const s = r => (r.tr&&r.byz)?0:r.tr?1:r.byz?2:3
    return s(a)-s(b)
  })
}
function calloutWords(v) {
  const w = [...(v.trw||[]),...(v.mxw||[])]
  return w.length ? w : null
}

const TYPE_LABEL_SV = {
  pap:'Papyrus', cod:'Uncial/Kodex', min:'Minuskel',
  byz:'Bysantinsk tradition', fam:'Handskriftsfamilj', lec:'Lektionarium',
  ver:'Forntida version', pat:'Kyrkofader', edi:'Edition',
}
</script>

<template>
  <div class="av-root" @click.self="closePopover">

    <!-- Header -->
    <div class="av-header">
      <div class="av-header-inner">
        <div class="av-title-row">
          <h2 class="av-title">📜 Handskriftsapparaten</h2>
          <button class="av-close-btn" @click="emit('close')">✕</button>
        </div>

        <!-- Progress bar -->
        <div class="av-progress-wrap" v-if="!loadDone">
          <div class="av-progress-bar" :style="{width: loadPct+'%'}"></div>
          <span class="av-progress-label">
            {{ loadError ? '⚠ ' + loadError : 'Laddar handskriftsdata… ' + loadPct + '%' }}
          </span>
        </div>

        <p class="av-subtitle" v-else>
          NT-varianter med fullständigt handskriftsstöd · Laparola apparatus (CC0) ·
          <span class="av-count">{{ filtered.length }} av {{ allVerses.length }} vers</span>
          · Klicka på ett chip för info
        </p>

        <input
          class="av-search"
          type="text"
          placeholder="Sök vers, t.ex. Rom 8:1, Matt 5, blod..."
          @input="onInput"
          autocomplete="off"
          spellcheck="false"
          :disabled="!loadDone"
        />
      </div>
    </div>

    <!-- Loading skeleton -->
    <div class="av-list" v-if="!loadDone && !loadError">
      <div class="av-skeleton" v-for="i in 6" :key="i">
        <div class="av-skel-line av-skel-short"></div>
        <div class="av-skel-line av-skel-long"></div>
      </div>
    </div>

    <!-- Error -->
    <div class="av-list" v-else-if="loadError">
      <div class="av-empty">⚠ Kunde inte ladda data: {{ loadError }}</div>
    </div>

    <!-- Verse list -->
    <div class="av-list" v-else>
      <div v-if="filtered.length === 0" class="av-empty">
        Inga resultat för "{{ search }}"
      </div>

      <div v-for="verse in filtered" :key="verse.ref" class="av-card" :class="{'av-card-open': expanded[verse.ref]}">

        <button class="av-card-header" @click="toggle(verse.ref)">
          <span class="av-ref">{{ verse.v }}</span>
          <span class="av-badges">
            <span class="av-badge av-badge-sm av-badge-tr" v-if="verse.trw?.length">{{ verse.trw.length }} TR</span>
            <span class="av-badge av-badge-sm av-badge-count">{{ verse.app?.length }} läsarter</span>
          </span>
          <a :href="verse.url" target="_blank" rel="noopener" class="av-step-link" @click.stop>{{ verse.ref }} ↗</a>
          <span class="av-chevron" :class="{'av-chevron-open': expanded[verse.ref]}">▸</span>
        </button>

        <div v-if="expanded[verse.ref]" class="av-card-body">

          <div class="av-srb-block" v-if="verse.srb">
            <div class="av-srb-text" :class="{'av-srb-has-variant': verse.trw?.length||verse.mxw?.length}">
              {{ verse.srb }}
            </div>
            <div class="av-callout" v-if="calloutWords(verse)">
              <span class="av-callout-label">TR har — saknas i UBS/NA:</span>
              <span v-for="(w,i) in calloutWords(verse)" :key="i" class="av-callout-word" :title="w.e">
                {{ w.g }} <em>{{ w.t }}</em> — {{ w.e }}
              </span>
            </div>
          </div>

          <details class="av-details" v-if="verse.trw?.length">
            <summary class="av-details-summary">
              TR-stödd läsart — utelämnad i kritisk text
              <span class="av-details-count">({{ verse.trw.length }} ord)</span>
            </summary>
            <div class="av-word-table">
              <div v-for="(w,i) in verse.trw" :key="i" class="av-word-row">
                <span class="av-word-greek">{{ w.g }}</span>
                <span class="av-word-translit">{{ w.t }}</span>
                <span class="av-word-english">{{ w.e }}</span>
                <span class="av-word-badge av-badge-tr-sm">K</span>
              </div>
            </div>
          </details>

          <details class="av-details" v-if="verse.mxw?.length">
            <summary class="av-details-summary">
              Avvikande läsart i UBS/NA
              <span class="av-details-count">({{ verse.mxw.length }} ord)</span>
            </summary>
            <div class="av-word-table">
              <div v-for="(w,i) in verse.mxw" :key="i" class="av-word-row">
                <span class="av-word-greek">{{ w.g }}</span>
                <span class="av-word-translit">{{ w.t }}</span>
                <span class="av-word-english">{{ w.e }}</span>
                <span class="av-word-badge av-badge-mix-sm">NK</span>
              </div>
            </div>
          </details>

          <div class="av-note" v-if="verse.note">{{ verse.note.replace(/^\^\s*/,'') }}</div>

          <details class="av-details av-details-apparatus" open>
            <summary class="av-details-summary">
              Handskriftsstöd · Laparola apparatus (CC0)
              <span class="av-details-count">({{ verse.app?.length }} läsarter)</span>
            </summary>
            <div v-for="(r,ri) in sortedApp(verse.app||[])" :key="ri" class="av-reading" :class="{'av-reading-tr':r.tr}">
              <div class="av-reading-top">
                <span class="av-reading-greek">{{ r.r||'—' }}</span>
                <span class="av-badge" :class="badgeClass(r)">{{ badgeText(r) }}</span>
              </div>
              <div class="av-chips">
                <button
                  v-for="(w,wi) in r.w" :key="wi"
                  class="av-chip"
                  :class="[chipCss(w),{'av-chip-has-meta':hasMeta(w)}]"
                  :title="hasMeta(w)?chipMeta(w).n+' · '+chipMeta(w).d:chipLabel(w)"
                  @click.stop="openPopover($event,w)"
                >{{ chipLabel(w) }}</button>
              </div>
            </div>
          </details>

        </div>
      </div>
    </div>

    <div class="av-footer" v-if="loadDone">
      Data: TAGNT (STEPBible CC BY 4.0) · Laparola apparatus (CC0) · Handskriftsinfo: textus-receptus.com · SRB © Svenska Reformationsbibelsällskapet
    </div>

    <!-- Popover -->
    <Teleport to="body">
      <div
        v-if="popover"
        class="av-popover"
        :style="{
          left: popover.x+'px',
          top:  popover.y+'px',
          transform: popover.above ? 'translate(-50%,-100%)' : 'translateX(-50%)'
        }"
        @click.stop
      >
        <div class="av-popover-arrow" :class="{'av-popover-arrow-above':popover.above}"></div>
        <div class="av-pop-head">
          <span class="av-pop-sig" :class="'av-chip-'+popover.type">{{ popover.siglum }}</span>
          <span class="av-pop-type">{{ TYPE_LABEL_SV[popover.type]||popover.type }}</span>
          <button class="av-pop-close" @click="closePopover">✕</button>
        </div>
        <div class="av-pop-body" v-if="popover.meta">
          <div class="av-pop-name">{{ popover.meta.n }}</div>
          <div class="av-pop-grid">
            <span class="av-pop-key">Datum</span><span class="av-pop-val">{{ popover.meta.d }}</span>
            <span class="av-pop-key">Plats</span><span class="av-pop-val">{{ popover.meta.l }}</span>
            <span class="av-pop-key">Texttyp</span><span class="av-pop-val">{{ popover.meta.t }}</span>
          </div>
          <p class="av-pop-note">{{ popover.meta.x }}</p>
        </div>
        <div class="av-pop-body" v-else>
          <p class="av-pop-note">{{ popover.siglum }}</p>
        </div>
        <div class="av-pop-footer" v-if="popover.url">
          <a :href="popover.url" target="_blank" rel="noopener" class="av-pop-link">
            Läs mer på textus-receptus.com ↗
          </a>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<style scoped>
.av-root{min-height:100vh;background:var(--bg);color:var(--text);font-family:var(--font-body);}
.av-header{position:sticky;top:var(--header-h,64px);z-index:50;background:var(--bg-header);border-bottom:1px solid var(--border);box-shadow:var(--shadow-sm);}
.av-header-inner{max-width:1100px;margin:0 auto;padding:.75rem 1rem .6rem;}
.av-title-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:.4rem;}
.av-title{font-size:1.1rem;font-weight:600;color:var(--accent);font-family:var(--font-ui);}
.av-close-btn{background:none;border:1px solid var(--border);border-radius:var(--radius-sm);padding:.2rem .6rem;cursor:pointer;color:var(--text-muted);font-size:.9rem;transition:all var(--transition);}
.av-close-btn:hover{border-color:var(--accent);color:var(--accent);}

/* Progress bar */
.av-progress-wrap{position:relative;height:28px;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;margin-bottom:.5rem;}
.av-progress-bar{height:100%;background:var(--accent);transition:width .2s ease;opacity:.85;}
.av-progress-label{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:var(--font-ui);font-size:.75rem;color:var(--text);mix-blend-mode:difference;filter:invert(1);}

.av-subtitle{font-size:.78rem;color:var(--text-light);font-family:var(--font-ui);margin-bottom:.5rem;}
.av-count{color:var(--accent);}
.av-search{width:100%;padding:.5rem .85rem;border:1px solid var(--border);border-radius:var(--radius);background:var(--bg-card);color:var(--text);font-family:var(--font-body);font-size:1rem;outline:none;transition:border-color var(--transition);}
.av-search:focus{border-color:var(--accent);}
.av-search::placeholder{color:var(--text-light);}
.av-search:disabled{opacity:.5;}

/* Skeleton */
.av-skeleton{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:.85rem;margin-bottom:.5rem;}
.av-skel-line{height:12px;border-radius:6px;background:var(--border);margin-bottom:.5rem;animation:av-pulse 1.4s ease-in-out infinite;}
.av-skel-short{width:30%;}
.av-skel-long{width:75%;opacity:.6;}
@keyframes av-pulse{0%,100%{opacity:.4}50%{opacity:.9}}

.av-list{max-width:1100px;margin:0 auto;padding:.75rem 1rem 4rem;display:flex;flex-direction:column;gap:.5rem;}
.av-empty{text-align:center;padding:3rem;color:var(--text-light);font-style:italic;}

.av-card{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;transition:box-shadow var(--transition);}
.av-card:hover{box-shadow:var(--shadow-sm);}
.av-card-open{box-shadow:var(--shadow-md);}
.av-card-header{width:100%;display:flex;align-items:center;gap:.6rem;padding:.6rem .85rem;background:var(--bg-table-head);border:none;cursor:pointer;text-align:left;flex-wrap:wrap;transition:background var(--transition);}
.av-card-header:hover{background:var(--bg-hover);}
.av-ref{font-family:var(--font-ui);font-size:.82rem;font-weight:600;color:var(--accent);min-width:80px;}
.av-badges{display:flex;gap:.3rem;flex-wrap:wrap;flex:1;}
.av-badge{font-family:var(--font-ui);font-size:.62rem;padding:.12rem .45rem;border-radius:999px;font-weight:500;white-space:nowrap;}
.av-badge-sm{font-size:.6rem;padding:.1rem .4rem;}
.av-badge-tr{background:var(--c-byz,#065f46);color:#fff;}
.av-badge-byz{background:var(--c-ver,#92400e);color:#fff;}
.av-badge-na{background:transparent;color:var(--text-muted);border:1px solid var(--border);}
.av-badge-count{background:var(--bg);color:var(--text-light);border:1px solid var(--border-light);}
.av-step-link{font-family:var(--font-ui);font-size:.62rem;color:var(--accent);text-decoration:none;padding:.15rem .4rem;border:1px solid var(--accent);border-radius:var(--radius-sm);white-space:nowrap;transition:all var(--transition);}
.av-step-link:hover{background:var(--accent);color:#fff;}
.av-chevron{color:var(--text-light);font-size:.75rem;transition:transform var(--transition);flex-shrink:0;}
.av-chevron-open{transform:rotate(90deg);}

.av-srb-block{padding:.7rem .85rem;border-bottom:1px solid var(--border-light);}
.av-srb-text{font-size:1.05rem;line-height:1.65;}
.av-srb-has-variant{border-left:3px solid var(--c-byz,#065f46);padding-left:.6rem;}
.av-callout{margin-top:.45rem;padding:.3rem .55rem;background:var(--tr-highlight-bg,rgba(6,95,70,.08));border-radius:var(--radius-sm);font-family:var(--font-ui);font-size:.68rem;display:flex;flex-wrap:wrap;gap:.35rem;align-items:baseline;}
.av-callout-label{font-weight:600;color:var(--c-byz,#065f46);white-space:nowrap;}
.av-callout-word{background:var(--bg-card);border:1px solid var(--border);border-radius:3px;padding:.08rem .4rem;font-family:var(--font-body);font-size:.82rem;}
.av-callout-word em{font-style:italic;color:var(--text-light);font-size:.75rem;margin-left:.15rem;}

.av-details{border-bottom:1px solid var(--border-light);}
.av-details-summary{padding:.5rem .85rem;font-family:var(--font-ui);font-size:.65rem;letter-spacing:.07em;text-transform:uppercase;color:var(--text-light);cursor:pointer;list-style:none;display:flex;align-items:center;gap:.5rem;background:var(--bg-table-head);user-select:none;}
.av-details-summary::-webkit-details-marker{display:none;}
.av-details-summary::before{content:'▸';font-size:.6rem;transition:transform var(--transition);}
details[open] .av-details-summary::before{transform:rotate(90deg);}
.av-details-count{font-size:.6rem;}

.av-word-table{padding:.25rem .85rem .5rem;}
.av-word-row{display:grid;grid-template-columns:1fr 1fr 1fr auto;gap:.2rem .65rem;padding:.25rem 0;border-bottom:1px solid var(--border-light);font-size:.88rem;align-items:baseline;}
.av-word-row:last-child{border-bottom:none;}
.av-word-greek{font-size:1rem;}
.av-word-translit{font-style:italic;color:var(--text-light);font-size:.82rem;}
.av-word-english{color:var(--text-muted);font-size:.85rem;}
.av-word-badge{font-family:var(--font-ui);font-size:.58rem;padding:.06rem .3rem;border-radius:2px;}
.av-badge-tr-sm{background:rgba(6,95,70,.12);color:var(--c-byz,#065f46);}
.av-badge-mix-sm{background:rgba(29,78,216,.1);color:#1d4ed8;}

.av-note{margin:.5rem .85rem;padding:.4rem .6rem;font-size:.82rem;font-style:italic;color:var(--text-muted);border-left:2px solid var(--accent);background:var(--bg-row-alt);border-radius:0 var(--radius-sm) var(--radius-sm) 0;line-height:1.5;}

.av-reading{padding:.6rem .85rem;border-bottom:1px solid var(--border-light);}
.av-reading:last-child{border-bottom:none;}
.av-reading-tr{background:var(--tr-highlight-bg,rgba(6,95,70,.06));}
.av-reading-top{display:flex;align-items:flex-start;gap:.6rem;margin-bottom:.4rem;flex-wrap:wrap;}
.av-reading-greek{font-size:1.02rem;flex:1;min-width:140px;line-height:1.4;}

.av-chips{display:flex;flex-wrap:wrap;gap:.25rem;}
.av-chip{display:inline-flex;align-items:center;font-family:var(--font-ui);font-size:.67rem;padding:.14rem .42rem;border-radius:3px;border:1px solid transparent;white-space:nowrap;line-height:1.3;cursor:pointer;background:none;transition:filter .12s,transform .1s;}
.av-chip:hover{filter:brightness(.88);}
.av-chip-has-meta:hover{transform:translateY(-1px);box-shadow:0 2px 6px rgba(0,0,0,.15);}
.av-chip-pap{background:#f3e8ff;border-color:#c4b5fd;color:#5b21b6;}
.av-chip-cod{background:#eff6ff;border-color:#93c5fd;color:#1e40af;}
.av-chip-min{background:#f5f5f5;border-color:#d4d4d4;color:#404040;}
.av-chip-byz{background:#f0fdf4;border-color:#86efac;color:#14532d;}
.av-chip-fam{background:#faf5ff;border-color:#d8b4fe;color:#6b21a8;}
.av-chip-lec{background:#fdf4ff;border-color:#e9d5ff;color:#7e22ce;}
.av-chip-ver{background:#f0fdf4;border-color:#6ee7b7;color:#065f46;}
.av-chip-pat{background:#fff1f2;border-color:#fda4af;color:#9f1239;}
.av-chip-edi{background:#fefce8;border-color:#fde047;color:#713f12;}

.av-popover{position:fixed;z-index:1000;width:280px;background:var(--bg-card,#fff);border:1px solid var(--border);border-radius:var(--radius,8px);box-shadow:0 8px 30px rgba(0,0,0,.18);font-family:var(--font-ui);pointer-events:all;}
.av-popover-arrow{position:absolute;left:50%;transform:translateX(-50%);width:12px;height:12px;background:var(--bg-card,#fff);border:1px solid var(--border);clip-path:polygon(0 100%,100% 100%,50% 0);top:-7px;}
.av-popover-arrow-above{top:auto;bottom:-7px;clip-path:polygon(0 0,100% 0,50% 100%);}
.av-pop-head{display:flex;align-items:center;gap:.5rem;padding:.6rem .75rem .4rem;border-bottom:1px solid var(--border-light);}
.av-pop-sig{font-size:.82rem;padding:.15rem .5rem;border-radius:3px;border:1px solid transparent;font-weight:600;}
.av-pop-type{font-size:.68rem;color:var(--text-light);flex:1;}
.av-pop-close{margin-left:auto;background:none;border:none;cursor:pointer;color:var(--text-light);font-size:.85rem;padding:.1rem .3rem;border-radius:3px;}
.av-pop-close:hover{color:var(--text);}
.av-pop-body{padding:.5rem .75rem;}
.av-pop-name{font-weight:600;font-size:.88rem;margin-bottom:.4rem;}
.av-pop-grid{display:grid;grid-template-columns:auto 1fr;gap:.15rem .6rem;font-size:.78rem;margin-bottom:.4rem;}
.av-pop-key{color:var(--text-light);white-space:nowrap;}
.av-pop-note{font-size:.78rem;color:var(--text-muted);font-style:italic;line-height:1.5;margin:0;}
.av-pop-footer{padding:.4rem .75rem .6rem;border-top:1px solid var(--border-light);}
.av-pop-link{font-size:.75rem;color:var(--accent);text-decoration:none;}
.av-pop-link:hover{text-decoration:underline;}

.av-footer{text-align:center;font-family:var(--font-ui);font-size:.68rem;color:var(--text-light);padding:1rem;border-top:1px solid var(--border-light);max-width:1100px;margin:0 auto;}

@media(max-width:640px){
  .av-word-row{grid-template-columns:1fr 1fr;}
  .av-word-english{grid-column:1/-1;font-size:.8rem;}
  .av-popover{width:240px;}
}
</style>

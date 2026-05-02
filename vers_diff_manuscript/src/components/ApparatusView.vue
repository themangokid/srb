<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  settings:          { type: Object,  default: () => ({}) },
  witnessColVisible: { type: Boolean, default: false },
})
const emit = defineEmits(['open-settings', 'navigate'])

// ── Data loading ──────────────────────────────────────────────────
const allVerses = ref([])
const URLS      = ref([])
const META      = ref({})
const loadPct   = ref(0)
const loadDone  = ref(false)
const loadError = ref('')

onMounted(async () => {
  try {
    const resp = await fetch(import.meta.env.BASE_URL + 'apparatus_full.json')
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
    const merged = new Uint8Array(received)
    let offset = 0
    for (const chunk of chunks) { merged.set(chunk, offset); offset += chunk.length }
    const parsed   = JSON.parse(new TextDecoder().decode(merged))
    URLS.value     = parsed.urls   || []
    META.value     = parsed.meta   || {}
    allVerses.value = parsed.verses || []
    loadPct.value  = 100
    loadDone.value = true
  } catch (e) { loadError.value = e.message }
})

// ── Search ────────────────────────────────────────────────────────
const search = ref('')
let searchTimer = null
function onInput(e) {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => { search.value = e.target.value }, 200)
}
function norm(s) { return (s ?? '').normalize('NFC').toLowerCase().replace(/\u00ad/g,'') }
const filtered = computed(() => {
  const q = norm(search.value.trim())
  if (!q) return allVerses.value
  return allVerses.value.filter(v =>
    norm(v.v).includes(q) || norm(v.srb).includes(q) ||
    v.trw?.some(w => norm(w.g).includes(q) || norm(w.e).includes(q))
  )
})

// ── Expand ────────────────────────────────────────────────────────
const expanded = ref({})
function toggle(ref) { expanded.value[ref] = !expanded.value[ref]; if (popover.value) popover.value = null }

// ── Witness legend ────────────────────────────────────────────────
const legendOpen = ref(false)
const LEGEND_ITEMS = [
  { cls: 'av-chip-pap', label: 'Papyrus',               desc: 'Tidiga papyrusfragment, 2–4 jh.' },
  { cls: 'av-chip-cod', label: 'Uncial/Kodex',           desc: 'Pergamentkodexar med versaler' },
  { cls: 'av-chip-min', label: 'Minuskel',               desc: 'Handskrifter med gemener, 9–15 jh.' },
  { cls: 'av-chip-byz', label: 'Bysantinsk tradition',   desc: 'Majoriteten av alla gr. NT-handskrifter' },
  { cls: 'av-chip-fam', label: 'Handskriftsfamilj',      desc: 'Grupper av besläktade handskrifter' },
  { cls: 'av-chip-lec', label: 'Lektionarium',           desc: 'Kyrkliga läsordningar' },
  { cls: 'av-chip-ver', label: 'Forntida version',       desc: 'Syriska, Latinska, Koptiska m.fl.' },
  { cls: 'av-chip-pat', label: 'Kyrkofader',             desc: 'Citat hos fornkyrkliga teologer' },
  { cls: 'av-chip-edi', label: 'Edition',                desc: 'TR (ς), WH, NA, ECM m.fl.' },
]

// ── Chip helpers ──────────────────────────────────────────────────
const TYPE_CSS = { pap:'av-chip-pap',cod:'av-chip-cod',min:'av-chip-min',byz:'av-chip-byz',fam:'av-chip-fam',lec:'av-chip-lec',ver:'av-chip-ver',pat:'av-chip-pat',edi:'av-chip-edi' }
function chipCss(w)   { return TYPE_CSS[w[1]] || 'av-chip-min' }
function chipLabel(w) { return w[0] }
function chipUrl(w)   { return w[2] >= 0 ? URLS.value[w[2]] : '' }
function chipMeta(w)  { return w[2] >= 0 ? META.value[w[2]] : null }
function hasMeta(w)   { return w[2] >= 0 && META.value[w[2]] != null }

// ── Popover ───────────────────────────────────────────────────────
const popover = ref(null)
function openPopover(event, w) {
  event.preventDefault(); event.stopPropagation()
  if (!hasMeta(w) && !chipUrl(w)) return
  const rect  = event.currentTarget.getBoundingClientRect()
  const above = rect.top > window.innerHeight / 2
  if (popover.value?.siglum === w[0]) { popover.value = null; return }
  popover.value = { siglum:w[0], url:chipUrl(w), meta:chipMeta(w), x:rect.left+rect.width/2, y:above?rect.top-8:rect.bottom+8, above, type:w[1] }
}
function closePopover() { popover.value = null }
function onDocClick(e) {
  if (!e.target.closest('.av-popover') && !e.target.closest('.av-chip')) popover.value = null
}
onMounted(() => document.addEventListener('click', onDocClick))
onUnmounted(() => document.removeEventListener('click', onDocClick))

// ── Apparatus helpers ─────────────────────────────────────────────
function badgeClass(r) { return r.tr ? 'av-badge-tr' : r.byz ? 'av-badge-byz' : 'av-badge-na' }
function badgeText(r)  { return (r.tr&&r.byz)?'TR + Byz':r.tr?'TR':r.byz?'Byz':'UBS/NA' }
function sortedApp(app){ return [...app].sort((a,b)=>{ const s=r=>(r.tr&&r.byz)?0:r.tr?1:r.byz?2:3; return s(a)-s(b) }) }
function calloutWords(v){ const w=[...(v.trw||[]),...(v.mxw||[])]; return w.length?w:null }

const TYPE_LABEL_SV = { pap:'Papyrus',cod:'Uncial/Kodex',min:'Minuskel',byz:'Bysantinsk tradition',fam:'Handskriftsfamilj',lec:'Lektionarium',ver:'Forntida version',pat:'Kyrkofader',edi:'Edition' }
</script>

<template>
  <div class="av-root">

    <!-- Sub-header -->
    <div class="av-subheader">
      <div class="av-subheader-inner">

        <!-- Progress bar -->
        <div class="av-progress-wrap" v-if="!loadDone && !loadError">
          <div class="av-progress-bar" :style="{width:loadPct+'%'}"></div>
          <span class="av-progress-label">Laddar handskriftsdata… {{ loadPct }}%</span>
        </div>
        <div class="av-progress-wrap av-progress-error" v-else-if="loadError">
          ⚠ Kunde inte ladda: {{ loadError }}
        </div>

        <div class="av-subheader-row" v-if="loadDone">
          <div class="av-meta">
            <span class="av-count">{{ filtered.length }} av {{ allVerses.length }} vers</span>
            <span class="av-sep">·</span>
            <span class="av-source">Laparola apparatus (CC0)</span>
            <span class="av-sep">·</span>
            <button class="av-legend-toggle" @click="legendOpen = !legendOpen">
              {{ legendOpen ? '▴ Dölj förklaring' : '▾ Förklaring av chip-färger' }}
            </button>
          </div>
          <input
            class="av-search"
            type="text"
            placeholder="Sök vers, t.ex. Rom 8:1, Matt 5, blod..."
            @input="onInput"
            autocomplete="off"
            spellcheck="false"
          />
        </div>

        <!-- Witness legend -->
        <Transition name="av-legend-slide">
          <div class="av-legend" v-if="legendOpen && loadDone">
            <div v-for="item in LEGEND_ITEMS" :key="item.cls" class="av-legend-item">
              <span class="av-chip av-chip-demo" :class="item.cls">Aa</span>
              <div class="av-legend-text">
                <strong>{{ item.label }}</strong>
                <span>{{ item.desc }}</span>
              </div>
            </div>
          </div>
        </Transition>

      </div>
    </div>

    <!-- Loading skeletons -->
    <div class="av-list" v-if="!loadDone && !loadError">
      <div class="av-skeleton" v-for="i in 8" :key="i">
        <div class="av-skel-line av-skel-short"></div>
        <div class="av-skel-line av-skel-long"></div>
      </div>
    </div>

    <!-- Error -->
    <div class="av-list" v-else-if="loadError">
      <div class="av-empty">⚠ {{ loadError }}</div>
    </div>

    <!-- Verse list -->
    <div class="av-list" v-else>
      <div v-if="filtered.length===0" class="av-empty">
        Inga resultat för "{{ search }}"
      </div>

      <div v-for="verse in filtered" :key="verse.ref" class="av-card" :class="{'av-card-open':expanded[verse.ref]}">

        <button class="av-card-header" @click="toggle(verse.ref)">
          <span class="av-ref">{{ verse.v }}</span>
          <span class="av-badges">
            <span class="av-badge av-badge-tr" v-if="verse.trw?.length">{{ verse.trw.length }} TR</span>
            <span class="av-badge av-badge-count">{{ verse.app?.length }} läsarter</span>
          </span>
          <a :href="verse.url" target="_blank" rel="noopener" class="av-step-link" @click.stop>{{ verse.ref }} ↗</a>
          <span class="av-chevron" :class="{'av-chevron-open':expanded[verse.ref]}">▸</span>
        </button>

        <div v-if="expanded[verse.ref]" class="av-card-body">

          <!-- SRB text -->
          <div class="av-srb-block" v-if="verse.srb">
            <div class="av-srb-text" :class="{'av-srb-has-variant':verse.trw?.length||verse.mxw?.length}">{{ verse.srb }}</div>
            <div class="av-callout" v-if="calloutWords(verse)">
              <span class="av-callout-label">TR har — saknas i UBS/NA:</span>
              <span v-for="(w,i) in calloutWords(verse)" :key="i" class="av-callout-word" :title="w.e">{{ w.g }} <em>{{ w.t }}</em> — {{ w.e }}</span>
            </div>
          </div>

          <!-- TR words -->
          <details class="av-details" v-if="verse.trw?.length">
            <summary class="av-details-summary">TR-stödd läsart — utelämnad i kritisk text <span class="av-details-count">({{ verse.trw.length }} ord)</span></summary>
            <div class="av-word-table">
              <div v-for="(w,i) in verse.trw" :key="i" class="av-word-row">
                <span class="av-word-greek">{{ w.g }}</span>
                <span class="av-word-translit">{{ w.t }}</span>
                <span class="av-word-english">{{ w.e }}</span>
                <span class="av-word-badge av-wbadge-tr">K</span>
              </div>
            </div>
          </details>

          <!-- Mixed words -->
          <details class="av-details" v-if="verse.mxw?.length">
            <summary class="av-details-summary">Avvikande läsart i UBS/NA <span class="av-details-count">({{ verse.mxw.length }} ord)</span></summary>
            <div class="av-word-table">
              <div v-for="(w,i) in verse.mxw" :key="i" class="av-word-row">
                <span class="av-word-greek">{{ w.g }}</span>
                <span class="av-word-translit">{{ w.t }}</span>
                <span class="av-word-english">{{ w.e }}</span>
                <span class="av-word-badge av-wbadge-mix">NK</span>
              </div>
            </div>
          </details>

          <!-- Variant note -->
          <div class="av-note" v-if="verse.note">{{ verse.note.replace(/^\^\s*/,'') }}</div>

          <!-- Apparatus -->
          <details class="av-details" open>
            <summary class="av-details-summary">Handskriftsstöd · Laparola apparatus (CC0) <span class="av-details-count">({{ verse.app?.length }} läsarter)</span></summary>
            <div v-for="(r,ri) in sortedApp(verse.app||[])" :key="ri" class="av-reading" :class="{'av-reading-tr':r.tr}">
              <div class="av-reading-top">
                <span class="av-reading-greek">{{ r.r||'—' }}</span>
                <span class="av-badge" :class="badgeClass(r)">{{ badgeText(r) }}</span>
              </div>
              <div class="av-chips">
                <button v-for="(w,wi) in r.w" :key="wi"
                  class="av-chip" :class="[chipCss(w),{'av-chip-has-meta':hasMeta(w)}]"
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
      TAGNT · STEPBible (CC BY 4.0) &nbsp;·&nbsp; Laparola apparatus (CC0) &nbsp;·&nbsp; textus-receptus.com &nbsp;·&nbsp; SRB © Svenska Reformationsbibelsällskapet
    </div>

    <!-- Popover -->
    <Teleport to="body">
      <div v-if="popover" class="av-popover"
        :style="{left:popover.x+'px',top:popover.y+'px',transform:popover.above?'translate(-50%,-100%)':'translateX(-50%)'}"
        @click.stop>
        <div class="av-popover-arrow" :class="{'av-popover-arrow-above':popover.above}"></div>
        <div class="av-pop-head">
          <span class="av-pop-sig av-chip" :class="'av-chip-'+popover.type">{{ popover.siglum }}</span>
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
        <div class="av-pop-body" v-else><p class="av-pop-note">{{ popover.siglum }}</p></div>
        <div class="av-pop-footer" v-if="popover.meta?.w || popover.url">
          <a v-if="popover.meta?.w" :href="popover.meta.w" target="_blank" rel="noopener" class="av-pop-link av-pop-wiki">
            📖 Wikipedia ↗
          </a>
          <a v-if="popover.url && popover.url !== popover.meta?.w" :href="popover.url" target="_blank" rel="noopener" class="av-pop-link">
            textus-receptus.com ↗
          </a>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<style scoped>
/* Uses the project's CSS variables throughout — all themes auto-inherited */
.av-root { min-height: 100vh; background: var(--bg); color: var(--text); font-family: var(--font-body); }

/* Sub-header */
.av-subheader { background: var(--bg-header); border-bottom: 1px solid var(--border); box-shadow: var(--shadow-sm); position: sticky; top: var(--header-h, 64px); z-index: 40; }
.av-subheader-inner { max-width: 1100px; margin: 0 auto; padding: .5rem 1rem; }
.av-subheader-row { display: flex; align-items: center; gap: .75rem; flex-wrap: wrap; margin-bottom: .4rem; }
.av-meta { display: flex; align-items: center; gap: .4rem; font-family: var(--font-ui); font-size: .75rem; color: var(--text-light); flex-wrap: wrap; }
.av-count { color: var(--accent); font-weight: 500; }
.av-sep { opacity: .4; }
.av-legend-toggle { background: none; border: 1px solid var(--border); border-radius: var(--radius-sm); padding: .15rem .5rem; cursor: pointer; font-family: var(--font-ui); font-size: .72rem; color: var(--accent); transition: all var(--transition); }
.av-legend-toggle:hover { background: var(--accent); color: #fff; border-color: var(--accent); }
.av-search { flex: 1; min-width: 200px; padding: .4rem .75rem; border: 1px solid var(--border); border-radius: var(--radius); background: var(--bg-card); color: var(--text); font-family: var(--font-body); font-size: .95rem; outline: none; transition: border-color var(--transition); }
.av-search:focus { border-color: var(--accent); }
.av-search::placeholder { color: var(--text-light); }

/* Progress */
.av-progress-wrap { position: relative; height: 24px; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; margin-bottom: .4rem; }
.av-progress-bar { height: 100%; background: var(--accent); transition: width .2s ease; }
.av-progress-label { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-family: var(--font-ui); font-size: .72rem; color: var(--text); }
.av-progress-error { background: var(--bg-card); display: flex; align-items: center; justify-content: center; font-size: .8rem; color: var(--text-muted); }

/* Legend */
.av-legend { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: .4rem; padding: .5rem 0 .25rem; border-top: 1px solid var(--border-light); margin-top: .25rem; }
.av-legend-item { display: flex; align-items: flex-start; gap: .4rem; }
.av-chip-demo { pointer-events: none; font-size: .6rem !important; }
.av-legend-text { display: flex; flex-direction: column; }
.av-legend-text strong { font-size: .72rem; color: var(--text); font-family: var(--font-ui); }
.av-legend-text span { font-size: .66rem; color: var(--text-light); font-family: var(--font-ui); }
.av-legend-slide-enter-active, .av-legend-slide-leave-active { transition: max-height .2s ease, opacity .15s ease; max-height: 400px; overflow: hidden; }
.av-legend-slide-enter-from, .av-legend-slide-leave-to { max-height: 0; opacity: 0; }

/* Skeleton */
.av-skeleton { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); padding: .85rem; margin-bottom: .5rem; }
.av-skel-line { height: 11px; border-radius: 6px; background: var(--border); margin-bottom: .45rem; animation: av-pulse 1.4s ease-in-out infinite; }
.av-skel-short { width: 28%; } .av-skel-long { width: 72%; opacity: .6; }
@keyframes av-pulse { 0%,100% { opacity: .35 } 50% { opacity: .8 } }

/* List */
.av-list { max-width: 1100px; margin: 0 auto; padding: .75rem 1rem 4rem; display: flex; flex-direction: column; gap: .4rem; }
.av-empty { text-align: center; padding: 3rem; color: var(--text-light); font-style: italic; }

/* Card */
.av-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; transition: box-shadow var(--transition); }
.av-card:hover { box-shadow: var(--shadow-sm); }
.av-card-open { box-shadow: var(--shadow-md); }

/* Card header */
.av-card-header { width: 100%; display: flex; align-items: center; gap: .5rem; padding: .55rem .85rem; background: var(--bg-table-head); border: none; cursor: pointer; text-align: left; flex-wrap: wrap; transition: background var(--transition); font-family: var(--font-ui); }
.av-card-header:hover { background: var(--bg-hover); }
.av-ref { font-size: .82rem; font-weight: 600; color: var(--accent); min-width: 78px; }
.av-badges { display: flex; gap: .3rem; flex: 1; flex-wrap: wrap; }
.av-badge { font-family: var(--font-ui); font-size: .6rem; padding: .1rem .4rem; border-radius: 999px; font-weight: 500; white-space: nowrap; }
.av-badge-tr { background: var(--c-byz, #065f46); color: #fff; }
.av-badge-byz { background: var(--c-ver, #92400e); color: #fff; }
.av-badge-na { background: transparent; color: var(--text-muted); border: 1px solid var(--border); }
.av-badge-count { background: var(--bg); color: var(--text-light); border: 1px solid var(--border-light); }
.av-step-link { font-family: var(--font-ui); font-size: .6rem; color: var(--accent); text-decoration: none; padding: .12rem .38rem; border: 1px solid var(--accent); border-radius: var(--radius-sm); white-space: nowrap; transition: all var(--transition); }
.av-step-link:hover { background: var(--accent); color: #fff; }
.av-chevron { color: var(--text-light); font-size: .7rem; transition: transform var(--transition); flex-shrink: 0; }
.av-chevron-open { transform: rotate(90deg); }

/* SRB text */
.av-srb-block { padding: .65rem .85rem; border-bottom: 1px solid var(--border-light); }
.av-srb-text { font-size: 1.05rem; line-height: 1.65; color: var(--text); }
.av-srb-has-variant { border-left: 3px solid var(--c-byz, #065f46); padding-left: .6rem; }
.av-callout { margin-top: .4rem; padding: .28rem .5rem; background: var(--tr-highlight-bg, rgba(6,95,70,.08)); border-radius: var(--radius-sm); font-family: var(--font-ui); font-size: .67rem; display: flex; flex-wrap: wrap; gap: .3rem; align-items: baseline; }
.av-callout-label { font-weight: 600; color: var(--c-byz, #065f46); white-space: nowrap; }
.av-callout-word { background: var(--bg-card); border: 1px solid var(--border); border-radius: 3px; padding: .06rem .35rem; font-family: var(--font-body); font-size: .8rem; color: var(--text); }
.av-callout-word em { font-style: italic; color: var(--text-light); font-size: .73rem; margin-left: .12rem; }

/* Details */
.av-details { border-bottom: 1px solid var(--border-light); }
.av-details-summary { padding: .45rem .85rem; font-family: var(--font-ui); font-size: .63rem; letter-spacing: .07em; text-transform: uppercase; color: var(--text-light); cursor: pointer; list-style: none; display: flex; align-items: center; gap: .4rem; background: var(--bg-table-head); user-select: none; }
.av-details-summary::-webkit-details-marker { display: none; }
.av-details-summary::before { content: '▸'; font-size: .58rem; transition: transform var(--transition); }
details[open] .av-details-summary::before { transform: rotate(90deg); }
.av-details-count { font-size: .58rem; }

/* Word table */
.av-word-table { padding: .2rem .85rem .45rem; }
.av-word-row { display: grid; grid-template-columns: 1fr 1fr 1fr auto; gap: .18rem .6rem; padding: .22rem 0; border-bottom: 1px solid var(--border-light); font-size: .87rem; align-items: baseline; }
.av-word-row:last-child { border-bottom: none; }
.av-word-greek { font-size: .98rem; color: var(--text); }
.av-word-translit { font-style: italic; color: var(--text-light); font-size: .8rem; }
.av-word-english { color: var(--text-muted); font-size: .83rem; }
.av-word-badge { font-family: var(--font-ui); font-size: .56rem; padding: .05rem .28rem; border-radius: 2px; }
.av-wbadge-tr  { background: rgba(6,95,70,.12); color: var(--c-byz, #065f46); }
.av-wbadge-mix { background: rgba(29,78,216,.1); color: #1d4ed8; }

/* Variant note */
.av-note { margin: .45rem .85rem; padding: .35rem .55rem; font-size: .8rem; font-style: italic; color: var(--text-muted); border-left: 2px solid var(--accent); background: var(--bg-row-alt); border-radius: 0 var(--radius-sm) var(--radius-sm) 0; line-height: 1.5; }

/* Reading blocks */
.av-reading { padding: .55rem .85rem; border-bottom: 1px solid var(--border-light); }
.av-reading:last-child { border-bottom: none; }
.av-reading-tr { background: var(--tr-highlight-bg, rgba(6,95,70,.06)); }
.av-reading-top { display: flex; align-items: flex-start; gap: .5rem; margin-bottom: .35rem; flex-wrap: wrap; }
.av-reading-greek { font-size: 1rem; flex: 1; min-width: 130px; line-height: 1.4; color: var(--text); }

/* Chips */
.av-chips { display: flex; flex-wrap: wrap; gap: .22rem; }
.av-chip { display: inline-flex; align-items: center; font-family: var(--font-ui); font-size: .65rem; padding: .12rem .38rem; border-radius: 3px; border: 1px solid transparent; white-space: nowrap; line-height: 1.3; cursor: pointer; background: none; transition: filter .12s, transform .1s; }
.av-chip:hover { filter: brightness(.88); }
.av-chip-has-meta:hover { transform: translateY(-1px); box-shadow: 0 2px 5px rgba(0,0,0,.12); }
.av-chip-pap { background: #f3e8ff; border-color: #c4b5fd; color: #5b21b6; }
.av-chip-cod { background: #eff6ff; border-color: #93c5fd; color: #1e40af; }
.av-chip-min { background: #f5f5f5; border-color: #d4d4d4; color: #404040; }
.av-chip-byz { background: #f0fdf4; border-color: #86efac; color: #14532d; }
.av-chip-fam { background: #faf5ff; border-color: #d8b4fe; color: #6b21a8; }
.av-chip-lec { background: #fdf4ff; border-color: #e9d5ff; color: #7e22ce; }
.av-chip-ver { background: #f0fdf4; border-color: #6ee7b7; color: #065f46; }
.av-chip-pat { background: #fff1f2; border-color: #fda4af; color: #9f1239; }
.av-chip-edi { background: #fefce8; border-color: #fde047; color: #713f12; }

/* Dark theme chip overrides */
:global(.setting-dark) .av-chip-pap { background: #3b1f5e; border-color: #7c3aed; color: #d8b4fe; }
:global(.setting-dark) .av-chip-cod { background: #1e3a5f; border-color: #3b82f6; color: #93c5fd; }
:global(.setting-dark) .av-chip-min { background: #2a2a2a; border-color: #555;     color: #ccc; }
:global(.setting-dark) .av-chip-byz { background: #052e16; border-color: #16a34a; color: #86efac; }
:global(.setting-dark) .av-chip-fam { background: #2d1b5e; border-color: #7c3aed; color: #c4b5fd; }
:global(.setting-dark) .av-chip-ver { background: #052e16; border-color: #059669; color: #6ee7b7; }
:global(.setting-dark) .av-chip-pat { background: #4c0519; border-color: #e11d48; color: #fda4af; }
:global(.setting-dark) .av-chip-edi { background: #3d2c00; border-color: #ca8a04; color: #fde047; }

/* Popover */
.av-popover { position: fixed; z-index: 1000; width: 280px; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: 0 8px 30px rgba(0,0,0,.2); font-family: var(--font-ui); pointer-events: all; }
.av-popover-arrow { position: absolute; left: 50%; transform: translateX(-50%); width: 12px; height: 12px; background: var(--bg-card); border: 1px solid var(--border); clip-path: polygon(0 100%,100% 100%,50% 0); top: -7px; }
.av-popover-arrow-above { top: auto; bottom: -7px; clip-path: polygon(0 0,100% 0,50% 100%); }
.av-pop-head { display: flex; align-items: center; gap: .45rem; padding: .55rem .7rem .35rem; border-bottom: 1px solid var(--border-light); }
.av-pop-sig { font-size: .78rem !important; padding: .12rem .45rem !important; font-weight: 600; }
.av-pop-type { font-size: .66rem; color: var(--text-light); flex: 1; }
.av-pop-close { margin-left: auto; background: none; border: none; cursor: pointer; color: var(--text-light); font-size: .82rem; padding: .08rem .28rem; border-radius: 3px; }
.av-pop-close:hover { color: var(--text); }
.av-pop-body { padding: .45rem .7rem; }
.av-pop-name { font-weight: 600; font-size: .85rem; margin-bottom: .35rem; color: var(--text); }
.av-pop-grid { display: grid; grid-template-columns: auto 1fr; gap: .12rem .55rem; font-size: .76rem; margin-bottom: .35rem; }
.av-pop-key { color: var(--text-light); white-space: nowrap; }
.av-pop-val { color: var(--text); }
.av-pop-note { font-size: .76rem; color: var(--text-muted); font-style: italic; line-height: 1.5; margin: 0; }
.av-pop-footer { padding: .35rem .7rem .55rem; border-top: 1px solid var(--border-light); display: flex; gap: .5rem; flex-wrap: wrap; }
.av-pop-link { font-size: .73rem; color: var(--accent); text-decoration: none; padding: .2rem .5rem; border: 1px solid var(--accent); border-radius: var(--radius-sm); transition: all var(--transition); }
.av-pop-link:hover { background: var(--accent); color: #fff; }
.av-pop-wiki { font-weight: 500; }

/* Footer */
.av-footer { text-align: center; font-family: var(--font-ui); font-size: .66rem; color: var(--text-light); padding: .85rem 1rem; border-top: 1px solid var(--border-light); max-width: 1100px; margin: 0 auto; }

/* Mobile */
@media (max-width: 640px) {
  .av-word-row { grid-template-columns: 1fr 1fr; }
  .av-word-english { grid-column: 1 / -1; font-size: .78rem; }
  .av-popover { width: 230px; }
  .av-legend { grid-template-columns: 1fr 1fr; }
  .av-subheader-row { flex-direction: column; align-items: stretch; }
}
</style>

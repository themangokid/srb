import { ref, watch } from 'vue'

const SETTINGS_KEY = 'diffSettings_v1'

export const SETTINGS_DEFS = [
  { id: 'dark',             cls: 'setting-dark',             label: 'Mörkt tema',          desc: 'Byt till mörk bakgrund' },
  { id: 'sepia',            cls: 'setting-sepia',            label: 'Sepia-ton',           desc: 'Varm pergamentfärg' },
  { id: 'large-font',       cls: 'setting-large-font',       label: 'Större text',         desc: 'Ökar grundstorleken' },
  { id: 'compact-rows',     cls: 'setting-compact-rows',     label: 'Kompakta rader',      desc: 'Tätare tabellrader' },
  { id: 'minimal-header',   cls: 'setting-minimal-header',   label: 'Minimal rubrik',      desc: 'Döljer titeln, kompakt verktygsfält' },
  { id: 'hide-impact',      cls: 'setting-hide-impact',      label: 'Dölj påverkan-kolumn',desc: 'Mer plats för texterna' },
  { id: 'highlight-tr',     cls: 'setting-highlight-tr',     label: 'Markera TR-text',     desc: 'Grön bakgrund på TR-kolumnen' },
  { id: 'always-witnesses', cls: 'setting-always-witnesses', label: 'Visa alltid handskrifter', desc: 'Expanderar automatiskt (mobil)' },
]

const DEFAULTS = { 'compact-rows': true, 'hide-impact': true, 'highlight-tr': true }

function load() {
  try { return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || { ...DEFAULTS } }
  catch { return { ...DEFAULTS } }
}

function save(settings) {
  try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)) } catch {}
}

function applyBodyClasses(settings) {
  SETTINGS_DEFS.forEach(({ id, cls }) => {
    document.body.classList.toggle(cls, !!settings[id])
  })
}

export function useSettings() {
  const settings = ref(load())

  watch(settings, (val) => {
    save(val)
    applyBodyClasses(val)
  }, { deep: true, immediate: true })

  function toggle(id) {
    settings.value = { ...settings.value, [id]: !settings.value[id] }
  }

  function resetSettings() {
    settings.value = {}
  }

  return { settings, toggle, resetSettings, SETTINGS_DEFS }
}

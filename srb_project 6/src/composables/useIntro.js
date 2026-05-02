import { ref } from 'vue'

const KEY = 'srb_intro_v1'

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {} }
  catch { return {} }
}
function save(d) {
  try { localStorage.setItem(KEY, JSON.stringify(d)) } catch {}
}

export function useIntro() {
  const stored = load()
  const visits = (stored.visits || 0) + 1
  save({ ...stored, visits })

  // Auto-show on first two visits unless already manually dismissed
  const visible = ref(!stored.dismissed && visits <= 2)

  function dismiss() {
    visible.value = false
    save({ ...load(), dismissed: true })
  }

  function reEnable() {
    visible.value = true
    save({ visits: 0, dismissed: false })
  }

  return { visible, dismiss, reEnable }
}

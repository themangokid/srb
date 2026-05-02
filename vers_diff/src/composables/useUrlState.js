export function readUrlParams() {
  const p = new URLSearchParams(window.location.search)
  return {
    category:  p.get('kategori')     || 'all',
    search:    p.get('sok')          || '',
    witnesses: p.get('handskrifter') === '1',
    verse:     p.get('vers')         || '',
  }
}

export function pushUrlState({ category, search, witnesses, verse } = {}) {
  const p = new URLSearchParams()
  if (category && category !== 'all') p.set('kategori', category)
  if (search && search.trim())        p.set('sok', search.trim())
  if (witnesses)                       p.set('handskrifter', '1')
  if (verse)                           p.set('vers', verse)
  const qs = p.toString()
  history.replaceState(null, '', qs ? `${location.pathname}?${qs}` : location.pathname)
}

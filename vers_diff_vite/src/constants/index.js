export const CATEGORIES = {
  'critical':     { title: 'Kategori 1: Kritiska doktrinära varianter',              emoji: '🔴' },
  'significant':  { title: 'Kategori 2: Betydande teologiska varianter',             emoji: '🟠' },
  'jesus':        { title: 'Kategori 3: Referenser till Jesus namn och titlar',      emoji: '✝️' },
  'god':          { title: 'Kategori 4: Guds namn och attribut',                     emoji: '👑' },
  'spirit':       { title: 'Kategori 5: Den Helige Ande',                            emoji: '🕊️' },
  'family':       { title: 'Kategori 6: Jungfrufödelsen och familj',                emoji: '👶' },
  'miracles':     { title: 'Kategori 7: Undergörelser',                              emoji: '⚡' },
  'ethics':       { title: 'Kategori 8: Etik och kristet liv',                       emoji: '📖' },
  'names':        { title: 'Kategori 9: Geografiska och personnamn',                emoji: '🗺️' },
  'church':       { title: 'Kategori 10: Församlingsordning och sakrament',         emoji: '⛪' },
  'resurrection': { title: 'Kategori 11: Uppståndelsen och efteråt',                emoji: '💫' },
  'prophecy':     { title: 'Kategori 12: Profetior och uppfyllelser',               emoji: '🔮' },
  'sin':          { title: 'Kategori 13: Doktrin om synd och helgelse',             emoji: '🚫' },
  'ministry':     { title: 'Kategori 14: Kristen kallelse och tjänst',              emoji: '👥' },
  'eschatology':  { title: 'Kategori 15: Himmelska scener och eskatologi',          emoji: '🌅' },
  'minor':        { title: 'Kategori 16: Mindre varianter med viss teologisk bet.', emoji: '📋' },
  'john':         { title: 'Kategori 17: Johannesevangeliet specifika varianter',   emoji: '📜' },
  'acts':         { title: 'Kategori 18: Apostlagärningar',                         emoji: '🏛️' },
}

export const BOOK_MAP = {
  'Matt': 'mat', 'Mark': 'mrk', 'Luk': 'luk', 'Joh': 'jhn', 'Apg': 'act',
  'Rom': 'rom', '1 Kor': '1co', '2 Kor': '2co', 'Gal': 'gal', 'Ef': 'eph',
  'Fil': 'php', 'Kol': 'col', '1 Thess': '1th', '2 Thess': '2th',
  '1 Tim': '1ti', '2 Tim': '2ti', 'Tit': 'tit', 'Filem': 'phm',
  'Hebr': 'heb', 'Jak': 'jas', '1 Petr': '1pe', '2 Petr': '2pe',
  '1 Joh': '1jn', '2 Joh': '2jn', '3 Joh': '3jn', 'Jud': 'jud', 'Upp': 'rev',
}

export const WITNESS_TYPES = {
  pap: { label: 'Papyri',       cssClass: 'w-pap' },
  cod: { label: 'Kodex',        cssClass: 'w-cod' },
  byz: { label: 'Bysantinsk',   cssClass: 'w-byz' },
  ver: { label: 'Gamla vers.',  cssClass: 'w-ver' },
  pat: { label: 'Kyrkofäder',   cssClass: 'w-pat' },
  tr:  { label: 'TR-utgåvor',   cssClass: 'w-tr'  },
}

export const TYPE_ORDER = ['pap', 'cod', 'byz', 'ver', 'pat', 'tr']

export const HOME_URL  = 'https://themangokid.github.io/srb'
export const GNT_PATH  = '../vers_differences/gnt_v6.html'

export const WITNESS_NAMES = {
  'P45':    'Papyrus 45 (Chester Beatty I, ~250 e.Kr.)',
  'P46':    'Papyrus 46 (Chester Beatty II, ~200 e.Kr.)',
  'P47':    'Papyrus 47 (Chester Beatty III, ~250 e.Kr.)',
  'P52':    'Papyrus 52 (Rylands, ~125 e.Kr.)',
  'P66':    'Papyrus 66 (Bodmer II, ~200 e.Kr.)',
  'P72':    'Papyrus 72 (Bodmer VII–VIII, ~300 e.Kr.)',
  'P74':    'Papyrus 74 (Bodmer XVII, ~600 e.Kr.)',
  'P75':    'Papyrus 75 (Bodmer XIV–XV, ~200 e.Kr.)',
  'P98':    'Papyrus 98 (~175 e.Kr.)',
  'ℵ':      'Codex Sinaiticus (~350 e.Kr.)',
  'A':      'Codex Alexandrinus (~425 e.Kr.)',
  'B':      'Codex Vaticanus (~325 e.Kr.)',
  'C':      'Codex Ephraemi Rescriptus (~450 e.Kr.)',
  'D':      'Codex Bezae (~450 e.Kr.)',
  'D²':     'Codex Claromontanus (~550 e.Kr.)',
  'L':      'Codex Regius (~750 e.Kr.)',
  'W':      'Codex Washingtonianus (~425 e.Kr.)',
  '1':      'Minuskel 1 (1100-tal)',
  '33':     'Minuskel 33 — "Drottningen av minusklerna" (800-tal)',
  '61':     'Minuskel 61 / Codex Britannicus (~1520)',
  '69':     'Minuskel 69 (1400-tal)',
  '2814':   'Minuskel 2814 — Erasmus Upp-handskrift (1100-tal)',
  '2815':   'Minuskel 2815 — Erasmus bashandskrift',
  '2816':   'Minuskel 2816 — Erasmus bashandskrift',
  '2817':   'Minuskel 2817 — Erasmus bashandskrift',
  'Lect':   'Bysantinska lektionarier (majoritetstexten)',
  'Comp':   'Complutensiska polyglotten (1514–1517)',
  'min.36': 'Minuskel 36',
  'syrp':   'Peshitta — syrisk version (~400 e.Kr.)',
  'syrh':   'Harklensisk syriska (616 e.Kr.)',
  'it':     'Itala / Gamla latinska (~200 e.Kr.)',
  'Vg':     'Vulgata — Hieronymus (~400 e.Kr.)',
  'arm':    'Armenisk version (~430 e.Kr.)',
  'got':    'Gotisk version — Wulfila (~350 e.Kr.)',
  'aeth':   'Etiopisk version (tidiga medeltiden)',
  'Iren':   'Irenaeus av Lyon (~130–202 e.Kr.)',
  'Tert':   'Tertullianus (~155–240 e.Kr.)',
  'Cypr':   'Cyprianus av Karthago (~210–258 e.Kr.)',
  'Orig':   'Origenes (~185–254 e.Kr.)',
  'Ambr':   'Ambrosius av Milano (~339–397 e.Kr.)',
  'Basil':  'Basilius av Caesarea (~329–379 e.Kr.)',
  'Chry':   'Johannes Chrysostomos (~347–407 e.Kr.)',
  'Jer':    'Hieronymus (~347–420 e.Kr.)',
  'Aug':    'Augustinus av Hippo (~354–430 e.Kr.)',
  'TR-E':   'Erasmus TR 1516–1535',
  'TR-S':   'Stephanus TR 1546–1551 (Editio Regia)',
  'TR-B':   'Beza TR 1565–1604 (KJV:s primära källa)',
  'Elz':    'Elzevir 1624/1633 (myntade "Textus Receptus")',
  'SCR':    'Scrivener 1894 (KJV:s exakta undertext, TBS)',
}

export function generateBibleLink(verse) {
  const match = verse.match(/^(.+?)\s+(\d+):(\d+)(?:-(\d+))?$/)
  if (!match) return null
  const [, book, chapter, startVerse] = match
  const bookCode = BOOK_MAP[book]
  if (!bookCode) return null
  return `https://www.bible.com/bible/4709/${bookCode}.${chapter}.${startVerse}`
}

export function isRedundantImpact(impact, un_text) {
  if (!impact || !un_text) return false
  const n = s => s.toLowerCase().replace(/[^a-zåäö0-9]/g, '').trim()
  const a = n(impact), b = n(un_text)
  return a === b || (a.length > 5 && b.includes(a)) || (b.length > 5 && a.includes(b))
}

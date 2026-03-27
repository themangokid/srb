// ===== Configuration =====
const CATEGORIES = {
    'critical':    { title: 'Kategori 1: Kritiska doktrinära varianter',             emoji: '🔴' },
    'significant': { title: 'Kategori 2: Betydande teologiska varianter',            emoji: '🟠' },
    'jesus':       { title: 'Kategori 3: Referenser till Jesus namn och titlar',     emoji: '✝️' },
    'god':         { title: 'Kategori 4: Guds namn och attribut',                    emoji: '👑' },
    'spirit':      { title: 'Kategori 5: Den Helige Ande',                           emoji: '🕊️' },
    'family':      { title: 'Kategori 6: Jungfrufödelsen och familj',               emoji: '👶' },
    'miracles':    { title: 'Kategori 7: Undergörelser',                             emoji: '⚡' },
    'ethics':      { title: 'Kategori 8: Etik och kristet liv',                      emoji: '📖' },
    'names':       { title: 'Kategori 9: Geografiska och personnamn',               emoji: '🗺️' },
    'church':      { title: 'Kategori 10: Församlingsordning och sakrament',        emoji: '⛪' },
    'resurrection':{ title: 'Kategori 11: Uppståndelsen och efteråt',               emoji: '💫' },
    'prophecy':    { title: 'Kategori 12: Profetior och uppfyllelser',              emoji: '🔮' },
    'sin':         { title: 'Kategori 13: Doktrin om synd och helgelse',            emoji: '🚫' },
    'ministry':    { title: 'Kategori 14: Kristen kallelse och tjänst',             emoji: '👥' },
    'eschatology': { title: 'Kategori 15: Himmelska scener och eskatologi',         emoji: '🌅' },
    'minor':       { title: 'Kategori 16: Mindre varianter med viss teologisk bet.',emoji: '📋' },
    'john':        { title: 'Kategori 17: Johannesevangeliet specifika varianter',  emoji: '📜' },
    'acts':        { title: 'Kategori 18: Apostlagärningar',                        emoji: '🏛️' }
};

const BOOK_MAP = {
    'Matt': 'mat', 'Mark': 'mrk', 'Luk': 'luk', 'Joh': 'jhn', 'Apg': 'act',
    'Rom': 'rom', '1 Kor': '1co', '2 Kor': '2co', 'Gal': 'gal', 'Ef': 'eph',
    'Fil': 'php', 'Kol': 'col', '1 Thess': '1th', '2 Thess': '2th',
    '1 Tim': '1ti', '2 Tim': '2ti', 'Tit': 'tit', 'Filem': 'phm',
    'Hebr': 'heb', 'Jak': 'jas', '1 Petr': '1pe', '2 Petr': '2pe',
    '1 Joh': '1jn', '2 Joh': '2jn', '3 Joh': '3jn', 'Jud': 'jud', 'Upp': 'rev'
};

// ── Witness type metadata ─────────────────────────────────────────────────────
const WITNESS_TYPES = {
    pap: { label: 'Papyri',          cssClass: 'w-pap' },
    cod: { label: 'Kodex',           cssClass: 'w-cod' },
    byz: { label: 'Bysantinsk',      cssClass: 'w-byz' },
    ver: { label: 'Gamla vers.',     cssClass: 'w-ver' },
    pat: { label: 'Kyrkofäder',      cssClass: 'w-pat' },
    tr:  { label: 'TR-utgåvor',      cssClass: 'w-tr'  }
};

const TYPE_ORDER = ['pap','cod','byz','ver','pat','tr'];

// ── State ─────────────────────────────────────────────────────────────────────
let filteredVariants  = [...allVariants];
let currentFilter     = 'all';
let witnessColVisible = false;
let _rowCounter       = 0;

// ── Utility ───────────────────────────────────────────────────────────────────
function generateBibleLink(verse) {
    const match = verse.match(/^(.+?)\s+(\d+):(\d+)(?:-(\d+))?$/);
    if (!match) return null;
    const [, book, chapter, startVerse] = match;
    const bookCode = BOOK_MAP[book];
    if (!bookCode) return null;
    return `https://www.bible.com/bible/3413/${bookCode}.${chapter}.${startVerse}`;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function groupByCategory(variants) {
    const grouped = {};
    Object.keys(CATEGORIES).forEach(key => {
        grouped[key] = { ...CATEGORIES[key], variants: variants.filter(v => v.category === key) };
    });
    return grouped;
}

function isRedundantImpact(impact, un_text) {
    if (!impact || !un_text) return false;
    const n = s => s.toLowerCase().replace(/[^a-zåäö0-9]/g, '').trim();
    const a = n(impact), b = n(un_text);
    return a === b || (a.length > 5 && b.includes(a)) || (b.length > 5 && a.includes(b));
}

function nextRowId() { return `wr-${++_rowCounter}`; }

// ── Full names for every siglum ───────────────────────────────────────────────
const WITNESS_NAMES = {
    // Papyri
    'P45':   'Papyrus 45 (Chester Beatty I, ~250 e.Kr.)',
    'P46':   'Papyrus 46 (Chester Beatty II, ~200 e.Kr.)',
    'P47':   'Papyrus 47 (Chester Beatty III, ~250 e.Kr.)',
    'P52':   'Papyrus 52 (Rylands, ~125 e.Kr.)',
    'P66':   'Papyrus 66 (Bodmer II, ~200 e.Kr.)',
    'P72':   'Papyrus 72 (Bodmer VII–VIII, ~300 e.Kr.)',
    'P74':   'Papyrus 74 (Bodmer XVII, ~600 e.Kr.)',
    'P75':   'Papyrus 75 (Bodmer XIV–XV, ~200 e.Kr.)',
    'P98':   'Papyrus 98 (~175 e.Kr.)',
    // Major codices
    'ℵ':     'Codex Sinaiticus (~350 e.Kr.)',
    'A':     'Codex Alexandrinus (~425 e.Kr.)',
    'B':     'Codex Vaticanus (~325 e.Kr.)',
    'C':     'Codex Ephraemi Rescriptus (~450 e.Kr.)',
    'D':     'Codex Bezae (~450 e.Kr.)',
    'D²':    'Codex Claromontanus (~550 e.Kr.)',
    'L':     'Codex Regius (~750 e.Kr.)',
    'W':     'Codex Washingtonianus (~425 e.Kr.)',
    // Byzantine / minuscules
    '1':     'Minuskel 1 (1100-tal)',
    '33':    'Minuskel 33 — "Drottningen av minusklerna" (800-tal)',
    '61':    'Minuskel 61 / Codex Britannicus (~1520)',
    '69':    'Minuskel 69 (1400-tal)',
    '2814':  'Minuskel 2814 — Erasmus Upp-handskrift (1100-tal)',
    '2815':  'Minuskel 2815 — Erasmus bashandskrift',
    '2816':  'Minuskel 2816 — Erasmus bashandskrift',
    '2817':  'Minuskel 2817 — Erasmus bashandskrift',
    'Lect':  'Bysantinska lektionarier (majoritetstexten)',
    'Comp':  'Complutensiska polyglotten (1514–1517)',
    'min.36':'Minuskel 36',
    // Ancient versions
    'syrp':  'Peshitta — syrisk version (~400 e.Kr.)',
    'syrh':  'Harklensisk syriska (616 e.Kr.)',
    'it':    'Itala / Gamla latinska (~200 e.Kr.)',
    'Vg':    'Vulgata — Hieronymus (~400 e.Kr.)',
    'arm':   'Armenisk version (~430 e.Kr.)',
    'got':   'Gotisk version — Wulfila (~350 e.Kr.)',
    'aeth':  'Etiopisk version (tidiga medeltiden)',
    // Church Fathers
    'Iren':  'Irenaeus av Lyon (~130–202 e.Kr.)',
    'Tert':  'Tertullianus (~155–240 e.Kr.)',
    'Cypr':  'Cyprianus av Karthago (~210–258 e.Kr.)',
    'Orig':  'Origenes (~185–254 e.Kr.)',
    'Ambr':  'Ambrosius av Milano (~339–397 e.Kr.)',
    'Basil': 'Basilius av Caesarea (~329–379 e.Kr.)',
    'Chry':  'Johannes Chrysostomos (~347–407 e.Kr.)',
    'Jer':   'Hieronymus (~347–420 e.Kr.)',
    'Aug':   'Augustinus av Hippo (~354–430 e.Kr.)',
    // Printed TR editions
    'TR-E':  'Erasmus TR 1516–1535',
    'TR-S':  'Stephanus TR 1546–1551 (Editio Regia)',
    'TR-B':  'Beza TR 1565–1604 (KJV:s primära källa)',
    'Elz':   'Elzevir 1624/1633 (myntade "Textus Receptus")',
    'SCR':   'Scrivener 1894 (KJV:s exakta undertext, TBS)',
};

// ── Path to the GNT witness registry (sibling file in the same folder) ───────
const GNT_PATH = 'gnt_v6.html';

// ── Witness chip HTML ─────────────────────────────────────────────────────────
function chipHtml(w) {
    const cls      = WITNESS_TYPES[w.t]?.cssClass || 'w-byz';
    const fullName = WITNESS_NAMES[w.s] || w.s;
    const typeLabel= WITNESS_TYPES[w.t]?.label || w.t;
    // Display name: full name stripped of parenthetical date, or sigla fallback
    const display  = escapeHtml(fullName.split(' (~')[0].split(' (')[0]);
    return `<a href="${GNT_PATH}" target="_blank" rel="noopener"
               class="w-chip ${cls}"
               title="${escapeHtml(fullName)} · ${typeLabel}">${display}</a>`;
}

// ── Summary bar (collapsed state) ────────────────────────────────────────────
// Shows one coloured dot per TYPE present + total count
function summaryBarHtml(witnesses) {
    if (!witnesses) return '<span class="w-no-data">—</span>';
    const all = [...(witnesses.tr || []), ...(witnesses.un || [])];
    if (!all.length) return '<span class="w-no-data">—</span>';

    const present = [...new Set(all.map(w => w.t))];
    const dots = TYPE_ORDER.filter(t => present.includes(t)).map(t => {
        const cls = WITNESS_TYPES[t]?.cssClass || 'w-byz';
        return `<span class="w-dot ${cls}" title="${WITNESS_TYPES[t]?.label}"></span>`;
    }).join('');

    const trN = witnesses.tr?.length || 0;
    const unN = witnesses.un?.length || 0;

    return `<span class="w-summary">
        ${dots}
        <span class="w-counts">
            <span class="w-count-tr" title="TR-vittnen">${trN}</span>
            <span class="w-count-sep">/</span>
            <span class="w-count-un" title="UN-vittnen">${unN}</span>
        </span>
    </span>`;
}

// ── Expanded panel ────────────────────────────────────────────────────────────
function sideGroupsHtml(list) {
    if (!list || !list.length) return '<span class="w-no-data">ingen data</span>';
    const groups = {};
    list.forEach(w => { (groups[w.t] = groups[w.t] || []).push(w); });
    return TYPE_ORDER.filter(t => groups[t]).map(t => {
        const chips = groups[t].map(chipHtml).join('');
        const cls   = WITNESS_TYPES[t].cssClass;
        return `<span class="w-group">
            <span class="w-group-label ${cls}">${WITNESS_TYPES[t].label}</span>${chips}
        </span>`;
    }).join('');
}

function expandedPanelHtml(witnesses, rowId) {
    if (!witnesses) return '';
    const trHtml = sideGroupsHtml(witnesses.tr);
    const unHtml = sideGroupsHtml(witnesses.un);

    return `<div class="w-expanded" id="${rowId}-exp" role="region" hidden>
        <div class="w-exp-side">
            <span class="w-side-badge w-label-tr">TR stöds av</span>
            <div class="w-exp-chips">${trHtml}</div>
        </div>
        <div class="w-exp-side">
            <span class="w-side-badge w-label-un">UN stöds av</span>
            <div class="w-exp-chips">${unHtml}</div>
        </div>
        <a href="${GNT_PATH}" target="_blank" class="w-reg-link" rel="noopener">
            📖 Öppna Vittnesregister
        </a>
    </div>`;
}

function renderWitnessCell(witnesses, rowId) {
    if (!witnesses) {
        return `<td class="witness-col wc-empty"><span class="w-no-data">—</span></td>`;
    }
    return `<td class="witness-col">
        <button class="w-toggle-btn"
                onclick="toggleWitnessRow('${rowId}')"
                aria-expanded="false"
                aria-controls="${rowId}-exp"
                title="Klicka för att visa/dölja handskrifter">
            ${summaryBarHtml(witnesses)}
            <span class="w-arrow" aria-hidden="true">▸</span>
        </button>
        ${expandedPanelHtml(witnesses, rowId)}
    </td>`;
}

// ── Mobile card witness section ───────────────────────────────────────────────
function renderWitnessMobile(witnesses) {
    if (!witnesses) return '';
    return `<div class="card-section witness-mob-section">
        <div class="card-section-title">
            Handskrifter
            <a href="${GNT_PATH}" target="_blank" class="ms-reg-link" rel="noopener">↗ Vittnesregister</a>
        </div>
        <div class="card-section-content">
            <div class="wm-side">
                <span class="w-side-badge w-label-tr">TR</span>
                <div class="wm-chips">${sideGroupsHtml(witnesses.tr)}</div>
            </div>
            <div class="wm-side" style="margin-top:6px">
                <span class="w-side-badge w-label-un">UN</span>
                <div class="wm-chips">${sideGroupsHtml(witnesses.un)}</div>
            </div>
        </div>
    </div>`;
}

// ── Table rows / mobile cards ─────────────────────────────────────────────────
function createTableRow(variant) {
    const impactRedundant = isRedundantImpact(variant.impact, variant.un_text);
    const impactHtml = impactRedundant
        ? `<span class="impact-same">—</span>`
        : `<div class="impact-text">${escapeHtml(variant.impact)}</div>`;
    const rowId = nextRowId();
    return `<tr>
        <td>${createVerseLinks(variant.verse)}</td>
        <td><div class="tr-text">${escapeHtml(variant.tr_text)}</div></td>
        <td><div class="un-text">${escapeHtml(variant.un_text)}</div></td>
        <td>${impactHtml}</td>
        ${renderWitnessCell(variant.witnesses, rowId)}
    </tr>`;
}

function createMobileCard(variant) {
    const url = generateBibleLink(variant.verse);
    const safeVerse = escapeHtml(variant.verse);
    const link = url
        ? `<a href="${url}" target="_blank" class="card-verse-link" rel="noopener">${safeVerse}</a>`
        : `<span class="card-verse-link">${safeVerse}</span>`;
    const impactRedundant = isRedundantImpact(variant.impact, variant.un_text);
    return `<div class="variant-card">
        <div class="card-header">${link}</div>
        <div class="card-content">
            <div class="card-section tr-section">
                <div class="card-section-title">Utdrag (TR)</div>
                <div class="card-section-content">${escapeHtml(variant.tr_text)}</div>
            </div>
            <div class="card-section un-section">
                <div class="card-section-title">UN-text</div>
                <div class="card-section-content">${escapeHtml(variant.un_text)}</div>
            </div>
            ${!impactRedundant ? `
            <div class="card-section impact-section">
                <div class="card-section-title">Påverkan</div>
                <div class="card-section-content">${escapeHtml(variant.impact)}</div>
            </div>` : ''}
            ${renderWitnessMobile(variant.witnesses)}
        </div>
    </div>`;
}

function createVerseLinks(verse) {
    const url = generateBibleLink(verse);
    const safeVerse = escapeHtml(verse);
    if (!url) return `<span class="verse-ref">${safeVerse}</span>`;
    return `<a href="${url}" target="_blank" class="verse-link" rel="noopener"
               title="Öppna i YouVersion">${safeVerse}</a>
            <a href="${url}?parallel=154" target="_blank" class="verse-parallel-link"
               rel="noopener" title="Parallell jämförelse">⇌</a>`;
}

function createCategorySection(categoryKey, data) {
    if (data.variants.length === 0) return '';
    const tableRows   = data.variants.map(createTableRow).join('');
    const mobileCards = data.variants.map(createMobileCard).join('');
    const count = data.variants.length;
    const noun  = count === 1 ? 'vers' : 'verser';

    return `<div class="category-section" id="${categoryKey}" data-category="${categoryKey}">
        <h2 class="category-title">${data.title}</h2>
        <div class="category-info">
            <span>${count} ${noun} i denna kategori</span>
        </div>
        <table class="variant-table">
            <thead><tr>
                <th style="width:11%">Vers</th>
                <th style="width:27%">Utdrag från PDF (TR)</th>
                <th style="width:27%">UN-text</th>
                <th style="width:13%">Påverkan</th>
                <th class="th-witness" style="width:22%">
                    Handskrifter
                    <a href="${GNT_PATH}" target="_blank" class="th-ms-link"
                       rel="noopener" title="Öppna Vittnesregister">↗</a>
                </th>
            </tr></thead>
            <tbody>${tableRows}</tbody>
        </table>
        <div class="mobile-card-container">${mobileCards}</div>
    </div>`;
}

// ── Per-row toggle ────────────────────────────────────────────────────────────
function toggleWitnessRow(rowId) {
    const panel = document.getElementById(`${rowId}-exp`);
    const btn   = panel?.previousElementSibling;
    if (!panel) return;
    const isOpen = panel.hasAttribute('hidden');
    if (isOpen) {
        panel.removeAttribute('hidden');
        btn?.setAttribute('aria-expanded','true');
        if (btn) btn.querySelector('.w-arrow').textContent = '▾';
    } else {
        panel.setAttribute('hidden','');
        btn?.setAttribute('aria-expanded','false');
        if (btn) btn.querySelector('.w-arrow').textContent = '▸';
    }
}

// ── Global witness column toggle ──────────────────────────────────────────────
function toggleWitnessColumn() {
    witnessColVisible = !witnessColVisible;
    document.body.classList.toggle('witnesses-hidden', !witnessColVisible);
    const btn = document.getElementById('witnessToggleBtn');
    if (!btn) return;
    btn.setAttribute('aria-pressed', String(witnessColVisible));
    btn.classList.toggle('btn-active', witnessColVisible);
    btn.title = witnessColVisible ? 'Dölj handskrifter' : 'Visa handskrifter';
    const label = btn.querySelector('.wtb-label');
    if (label) label.textContent = witnessColVisible ? 'Handskrifter på' : 'Handskrifter av';
    pushUrlState(currentUiState());
}

// ── Render ────────────────────────────────────────────────────────────────────
function renderCategories() {
    _rowCounter = 0;
    const container = document.getElementById('content-container');
    const grouped = groupByCategory(filteredVariants);
    const html = Object.keys(CATEGORIES)
        .map(key => createCategorySection(key, grouped[key]))
        .filter(Boolean).join('');
    container.innerHTML = html || '<div class="no-results">Inga resultat hittades.</div>';
}

function renderFilterDropdown() {
    const dropdown = document.getElementById('filterDropdown');
    const options = [
        '<div class="filter-option active" data-category="all">Alla kategorier</div>',
        ...Object.keys(CATEGORIES).map(key =>
            `<div class="filter-option" data-category="${key}">
                ${CATEGORIES[key].emoji} ${CATEGORIES[key].title.split(': ')[1] || CATEGORIES[key].title}
            </div>`
        )
    ];
    dropdown.innerHTML = options.join('');
}

// ── Event Listeners ───────────────────────────────────────────────────────────
function handleSearch(searchTerm) {
    searchTerm = searchTerm.toLowerCase().trim();
    const base = currentFilter === 'all' ? allVariants : allVariants.filter(v => v.category === currentFilter);
    filteredVariants = !searchTerm ? [...base] : base.filter(v =>
        v.verse.toLowerCase().includes(searchTerm) ||
        v.tr_text.toLowerCase().includes(searchTerm) ||
        v.un_text.toLowerCase().includes(searchTerm) ||
        v.impact.toLowerCase().includes(searchTerm)
    );
    renderCategories();
}

function handleFilterChange(category) {
    currentFilter = category;
    handleSearch(document.getElementById('searchInput').value);
}

function setupScrollHeader() {
    const header = document.getElementById('main-header');
    let isCompact = false, ticking = false;
    function updateHeader() {
        const should = window.scrollY > 100;
        if (should !== isCompact) { isCompact = should; header.classList.toggle('compact', isCompact); }
        ticking = false;
    }
    window.addEventListener('scroll', () => {
        if (!ticking) { requestAnimationFrame(updateHeader); ticking = true; }
    }, { passive: true });
    updateHeader();
}

function setupEventListeners() {
    // Search
    const searchInput = document.getElementById('searchInput');
    let searchTimeout;
    searchInput.addEventListener('input', e => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            handleSearch(e.target.value);
            pushUrlState(currentUiState());
        }, 250);
    });

    // Filter dropdown
    const dropdownBtn       = document.getElementById('filterDropdownBtn');
    const dropdown          = document.getElementById('filterDropdown');
    const currentFilterText = document.getElementById('currentFilterText');
    dropdownBtn.addEventListener('click', e => { e.stopPropagation(); dropdown.classList.toggle('show'); });
    document.addEventListener('click', e => {
        if (!dropdown.contains(e.target) && !dropdownBtn.contains(e.target)) dropdown.classList.remove('show');
    });
    dropdown.addEventListener('click', e => {
        const option = e.target.closest('.filter-option');
        if (!option) return;
        dropdown.querySelectorAll('.filter-option').forEach(o => o.classList.remove('active'));
        option.classList.add('active');
        currentFilterText.textContent = option.textContent.trim();
        handleFilterChange(option.getAttribute('data-category'));
        dropdown.classList.remove('show');
        pushUrlState(currentUiState());
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Witness column toggle
    const wBtn = document.getElementById('witnessToggleBtn');
    if (wBtn) wBtn.addEventListener('click', toggleWitnessColumn);

    // Keyboard
    document.addEventListener('keydown', e => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') { e.preventDefault(); searchInput.focus(); searchInput.select(); }
        if (e.key === 'Escape') {
            if (dropdown.classList.contains('show')) dropdown.classList.remove('show');
            else if (document.activeElement === searchInput) { searchInput.value = ''; handleSearch(''); pushUrlState(currentUiState()); searchInput.blur(); }
        }
    });
}

// ── URL State Management ──────────────────────────────────────────────────────

/**
 * Read all relevant params from the current URL.
 * Supported params:
 *   ?kategori=critical        – filter by category key
 *   ?sok=frälsning            – pre-fill search box
 *   ?handskrifter=1           – show witness column
 *   ?vers=Matt+5:18           – scroll to a specific verse row
 */
function readUrlParams() {
    const p = new URLSearchParams(window.location.search);
    return {
        category:  p.get('kategori')     || 'all',
        search:    p.get('sok')          || '',
        witnesses: p.get('handskrifter') === '1',
        verse:     p.get('vers')         || ''
    };
}

/**
 * Push the current UI state into the URL without reloading the page.
 * Only adds params that differ from the default to keep URLs clean.
 */
function pushUrlState({ category, search, witnesses, verse } = {}) {
    const p = new URLSearchParams();
    if (category  && category  !== 'all') p.set('kategori',     category);
    if (search    && search.trim())        p.set('sok',          search.trim());
    if (witnesses)                          p.set('handskrifter', '1');
    if (verse)                              p.set('vers',         verse);

    const qs = p.toString();
    const newUrl = qs ? `${location.pathname}?${qs}` : location.pathname;
    history.replaceState(null, '', newUrl);
}

/** Collect current UI state into one object. */
function currentUiState() {
    return {
        category:  currentFilter,
        search:    document.getElementById('searchInput')?.value || '',
        witnesses: witnessColVisible,
        verse:     ''   // verse param is one-shot (we don't re-encode it after scroll)
    };
}

/**
 * Given a verse string (e.g. "Matt 5:18"), find the first matching <tr> or
 * mobile card in the rendered DOM and scroll it into view smoothly.
 * Works for both the desktop table and mobile card layout.
 */
function scrollToVerse(verseStr) {
    if (!verseStr) return;
    const needle = verseStr.trim().toLowerCase();

    function attempt(retriesLeft) {
        // On mobile: .card-verse-link is visible; on desktop: .verse-link / .verse-ref
        const links = document.querySelectorAll('.card-verse-link, .verse-link, .verse-ref');
        for (const el of links) {
            if (el.textContent.trim().toLowerCase() === needle) {
                const row = el.closest('.variant-card') || el.closest('tr');
                const target = row || el;

                // Make sure the target is actually rendered/visible before scrolling
                const rect = target.getBoundingClientRect();
                const isVisible = rect.width > 0 || rect.height > 0 ||
                                  window.getComputedStyle(target).display !== 'none';

                if (!isVisible && retriesLeft > 0) {
                    setTimeout(() => attempt(retriesLeft - 1), 150);
                    return;
                }

                target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                target.classList.add('url-highlight');
                setTimeout(() => target.classList.remove('url-highlight'), 2500);
                return;
            }
        }
        // Element not found yet — retry
        if (retriesLeft > 0) setTimeout(() => attempt(retriesLeft - 1), 150);
    }

    // Use rAF to wait for the browser to finish painting, then attempt with retries
    requestAnimationFrame(() => attempt(5));
}

// ── Init ──────────────────────────────────────────────────────────────────────
function init() {
    console.log('Initializing app with', allVariants.length, 'variants');
    document.getElementById('loading').style.display = 'none';

    // ── Read URL params first ──────────────────────────────────────────────────
    const params = readUrlParams();

    // ── Witness column state (URL overrides default-off) ──────────────────────
    witnessColVisible = params.witnesses;
    document.body.classList.toggle('witnesses-hidden', !witnessColVisible);
    const btn = document.getElementById('witnessToggleBtn');
    if (btn) {
        btn.setAttribute('aria-pressed', String(witnessColVisible));
        btn.classList.toggle('btn-active', witnessColVisible);
        btn.title = witnessColVisible ? 'Dölj handskrifter' : 'Visa handskrifter';
        const label = btn.querySelector('.wtb-label');
        if (label) label.textContent = witnessColVisible ? 'Handskrifter på' : 'Handskrifter av';
    }

    renderFilterDropdown();

    // ── Apply category filter from URL ────────────────────────────────────────
    if (params.category && params.category !== 'all' && CATEGORIES[params.category]) {
        currentFilter = params.category;
        // Mark the correct dropdown option as active
        const dropdown = document.getElementById('filterDropdown');
        // Dropdown may not be populated yet — renderFilterDropdown() was just called
        const opt = dropdown?.querySelector(`[data-category="${params.category}"]`);
        if (opt) {
            dropdown.querySelectorAll('.filter-option').forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
        }
        const filterText = document.getElementById('currentFilterText');
        if (filterText) {
            const cat = CATEGORIES[params.category];
            const shortTitle = cat.title.split(': ')[1] || cat.title;
            filterText.textContent = shortTitle;
        }
    }

    // ── Apply search from URL ─────────────────────────────────────────────────
    const searchInput = document.getElementById('searchInput');
    if (params.search && searchInput) {
        searchInput.value = params.search;
    }

    // Run the combined filter+search to populate filteredVariants
    handleSearch(params.search);   // also calls renderCategories()

    setupEventListeners();
    setupScrollHeader();

    // ── Scroll to verse after render ──────────────────────────────────────────
    if (params.verse) {
        scrollToVerse(params.verse);
    }
}
document.addEventListener('DOMContentLoaded', init);
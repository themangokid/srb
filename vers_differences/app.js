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
let witnessColVisible = true;
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

// ── Witness chip HTML ─────────────────────────────────────────────────────────
function chipHtml(w) {
    const cls = WITNESS_TYPES[w.t]?.cssClass || 'w-byz';
    const esc = escapeHtml(w.s);
    const typeLabel = WITNESS_TYPES[w.t]?.label || w.t;
    return `<a href="gnt_v6.html" target="_blank" rel="noopener"
               class="w-chip ${cls}"
               title="${esc} · ${typeLabel}">${esc}</a>`;
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
        <a href="gnt_v6.html" target="_blank" class="w-reg-link" rel="noopener">
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
            <a href="gnt_v6.html" target="_blank" class="ms-reg-link" rel="noopener">↗ Vittnesregister</a>
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
                    <a href="gnt_v6.html" target="_blank" class="th-ms-link"
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
        searchTimeout = setTimeout(() => handleSearch(e.target.value), 250);
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
            else if (document.activeElement === searchInput) { searchInput.value = ''; handleSearch(''); searchInput.blur(); }
        }
    });
}

// ── Init ──────────────────────────────────────────────────────────────────────
function init() {
    console.log('Initializing app with', allVariants.length, 'variants');
    document.getElementById('loading').style.display = 'none';
    renderFilterDropdown();
    renderCategories();
    setupEventListeners();
    setupScrollHeader();
}
document.addEventListener('DOMContentLoaded', init);

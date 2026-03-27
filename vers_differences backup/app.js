// ===== Configuration =====
const CATEGORIES = {
    'critical': { title: 'Kategori 1: Kritiska doktrinära varianter', emoji: '🔴' },
    'significant': { title: 'Kategori 2: Betydande teologiska varianter', emoji: '🟠' },
    'jesus': { title: 'Kategori 3: Referenser till Jesus namn och titlar', emoji: '✝️' },
    'god': { title: 'Kategori 4: Guds namn och attribut', emoji: '👑' },
    'spirit': { title: 'Kategori 5: Den Helige Ande', emoji: '🕊️' },
    'family': { title: 'Kategori 6: Jungfrufödelsen och familj', emoji: '👶' },
    'miracles': { title: 'Kategori 7: Undergörelser', emoji: '⚡' },
    'ethics': { title: 'Kategori 8: Etik och kristet liv', emoji: '📖' },
    'names': { title: 'Kategori 9: Geografiska och personnamn', emoji: '🗺️' },
    'church': { title: 'Kategori 10: Församlingsordning och sakrament', emoji: '⛪' },
    'resurrection': { title: 'Kategori 11: Uppståndelsen och efteråt', emoji: '💫' },
    'prophecy': { title: 'Kategori 12: Profetior och uppfyllelser', emoji: '🔮' },
    'sin': { title: 'Kategori 13: Doktrin om synd och helgelse', emoji: '🚫' },
    'ministry': { title: 'Kategori 14: Kristen kallelse och tjänst', emoji: '👥' },
    'eschatology': { title: 'Kategori 15: Himmelska scener och eskatologi', emoji: '🌅' },
    'minor': { title: 'Kategori 16: Mindre varianter med viss teologisk betydelse', emoji: '📋' },
    'john': { title: 'Kategori 17: Johannesevangeliet specifika varianter', emoji: '📜' },
    'acts': { title: 'Kategori 18: Apostlagärningar', emoji: '🏛️' }
};

const BOOK_MAP = {
    'Matt': 'mat', 'Mark': 'mrk', 'Luk': 'luk', 'Joh': 'jhn', 'Apg': 'act',
    'Rom': 'rom', '1 Kor': '1co', '2 Kor': '2co', 'Gal': 'gal', 'Ef': 'eph',
    'Fil': 'php', 'Kol': 'col', '1 Thess': '1th', '2 Thess': '2th',
    '1 Tim': '1ti', '2 Tim': '2ti', 'Tit': 'tit', 'Filem': 'phm',
    'Hebr': 'heb', 'Jak': 'jas', '1 Petr': '1pe', '2 Petr': '2pe',
    '1 Joh': '1jn', '2 Joh': '2jn', '3 Joh': '3jn', 'Jud': 'jud', 'Upp': 'rev'
};

// ===== State =====
let filteredVariants = [...allVariants];
let currentFilter = 'all';

// ===== Utility Functions =====
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
        grouped[key] = {
            ...CATEGORIES[key],
            variants: variants.filter(v => v.category === key)
        };
    });
    return grouped;
}

// Check if impact text is essentially the same as un_text (deduplication)
function isRedundantImpact(impact, un_text) {
    if (!impact || !un_text) return false;
    const normalise = s => s.toLowerCase().replace(/[^a-zåäöа-я0-9]/g, '').trim();
    const a = normalise(impact);
    const b = normalise(un_text);
    // If impact is >80% same as un_text, it's redundant
    if (a === b) return true;
    if (a.length > 5 && b.includes(a)) return true;
    if (b.length > 5 && a.includes(b)) return true;
    return false;
}

// ===== Rendering Functions =====
function createVerseLinks(verse) {
    const url = generateBibleLink(verse);
    const safeVerse = escapeHtml(verse);
    if (!url) {
        return `<span class="verse-ref">${safeVerse}</span>`;
    }
    // Single clean link — verse reference opens bible.com, parallel icon opens parallel view
    return `
        <a href="${url}" target="_blank" class="verse-link" rel="noopener" title="Öppna i YouVersion">${safeVerse}</a>
        <a href="${url}?parallel=154" target="_blank" class="verse-parallel-link" rel="noopener" title="Parallell jämförelse">⇌</a>
    `;
}

function createTableRow(variant) {
    const impactRedundant = isRedundantImpact(variant.impact, variant.un_text);
    const impactHtml = impactRedundant
        ? `<span class="impact-same">—</span>`
        : `<div class="impact-text">${escapeHtml(variant.impact)}</div>`;

    return `
        <tr>
            <td>${createVerseLinks(variant.verse)}</td>
            <td><div class="tr-text">${escapeHtml(variant.tr_text)}</div></td>
            <td><div class="un-text">${escapeHtml(variant.un_text)}</div></td>
            <td>${impactHtml}</td>
        </tr>
    `;
}

function createMobileCard(variant) {
    const url = generateBibleLink(variant.verse);
    const safeVerse = escapeHtml(variant.verse);
    const link = url
        ? `<a href="${url}" target="_blank" class="card-verse-link" rel="noopener">${safeVerse}</a>`
        : `<span class="card-verse-link">${safeVerse}</span>`;

    const impactRedundant = isRedundantImpact(variant.impact, variant.un_text);

    return `
        <div class="variant-card">
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
            </div>
        </div>
    `;
}

function createCategorySection(categoryKey, data) {
    if (data.variants.length === 0) return '';

    const tableRows = data.variants.map(createTableRow).join('');
    const mobileCards = data.variants.map(createMobileCard).join('');
    const count = data.variants.length;
    const noun = count === 1 ? 'vers' : 'verser';

    return `
        <div class="category-section" id="${categoryKey}" data-category="${categoryKey}">
            <h2 class="category-title">${data.title}</h2>
            <div class="category-info">
                <span>${count} ${noun} i denna kategori</span>
            </div>

            <table class="variant-table">
                <thead>
                    <tr>
                        <th style="width: 13%">Vers</th>
                        <th style="width: 36%">Utdrag från PDF (TR)</th>
                        <th style="width: 36%">UN-text</th>
                        <th style="width: 15%">Påverkan</th>
                    </tr>
                </thead>
                <tbody>${tableRows}</tbody>
            </table>

            <div class="mobile-card-container">${mobileCards}</div>
        </div>
    `;
}

function renderCategories() {
    const container = document.getElementById('content-container');
    const grouped = groupByCategory(filteredVariants);

    const html = Object.keys(CATEGORIES)
        .map(key => createCategorySection(key, grouped[key]))
        .filter(html => html !== '')
        .join('');

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

// ===== Event Handlers =====
function handleSearch(searchTerm) {
    searchTerm = searchTerm.toLowerCase().trim();

    if (searchTerm === '') {
        filteredVariants = currentFilter === 'all'
            ? [...allVariants]
            : allVariants.filter(v => v.category === currentFilter);
    } else {
        const baseVariants = currentFilter === 'all'
            ? allVariants
            : allVariants.filter(v => v.category === currentFilter);

        filteredVariants = baseVariants.filter(v =>
            v.verse.toLowerCase().includes(searchTerm) ||
            v.tr_text.toLowerCase().includes(searchTerm) ||
            v.un_text.toLowerCase().includes(searchTerm) ||
            v.impact.toLowerCase().includes(searchTerm)
        );
    }

    renderCategories();
}

function handleFilterChange(category) {
    currentFilter = category;

    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();

    if (category === 'all') {
        filteredVariants = searchTerm === ''
            ? [...allVariants]
            : allVariants.filter(v =>
                v.verse.toLowerCase().includes(searchTerm) ||
                v.tr_text.toLowerCase().includes(searchTerm) ||
                v.un_text.toLowerCase().includes(searchTerm) ||
                v.impact.toLowerCase().includes(searchTerm)
            );
    } else {
        const categoryVariants = allVariants.filter(v => v.category === category);
        filteredVariants = searchTerm === ''
            ? categoryVariants
            : categoryVariants.filter(v =>
                v.verse.toLowerCase().includes(searchTerm) ||
                v.tr_text.toLowerCase().includes(searchTerm) ||
                v.un_text.toLowerCase().includes(searchTerm) ||
                v.impact.toLowerCase().includes(searchTerm)
            );
    }

    renderCategories();
}

// ===== Scroll Header: NO flicker fix =====
// Use requestAnimationFrame + CSS will-change to prevent layout thrash / flicker
function setupScrollHeader() {
    const header = document.getElementById('main-header');
    let isCompact = false;
    let ticking = false;

    function updateHeader() {
        const shouldBeCompact = window.scrollY > 100;
        if (shouldBeCompact !== isCompact) {
            isCompact = shouldBeCompact;
            // Batch the DOM write — avoids mid-paint flicker
            header.classList.toggle('compact', isCompact);
        }
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            // Schedule exactly one rAF per scroll event burst
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }, { passive: true });

    // Run once on load
    updateHeader();
}

// ===== Event Listeners =====
function setupEventListeners() {
    // Search
    const searchInput = document.getElementById('searchInput');
    let searchTimeout;

    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => handleSearch(e.target.value), 250);
    });

    // Dropdown toggle
    const dropdownBtn = document.getElementById('filterDropdownBtn');
    const dropdown = document.getElementById('filterDropdown');
    const currentFilterText = document.getElementById('currentFilterText');

    dropdownBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('show');
    });

    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target) && !dropdownBtn.contains(e.target)) {
            dropdown.classList.remove('show');
        }
    });

    // Filter options (delegated event)
    dropdown.addEventListener('click', (e) => {
        const option = e.target.closest('.filter-option');
        if (!option) return;

        const category = option.getAttribute('data-category');
        const text = option.textContent.trim();

        // Update UI
        dropdown.querySelectorAll('.filter-option').forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
        currentFilterText.textContent = text;

        // Filter and close
        handleFilterChange(category);
        dropdown.classList.remove('show');

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            searchInput.focus();
            searchInput.select();
        }

        if (e.key === 'Escape') {
            if (dropdown.classList.contains('show')) {
                dropdown.classList.remove('show');
            } else if (document.activeElement === searchInput) {
                searchInput.value = '';
                handleSearch('');
                searchInput.blur();
            }
        }
    });
}

// ===== Initialization =====
function init() {
    console.log('Initializing app with', allVariants.length, 'variants');

    document.getElementById('loading').style.display = 'none';

    renderFilterDropdown();
    renderCategories();
    setupEventListeners();
    setupScrollHeader();

    console.log('App initialized successfully');
}

document.addEventListener('DOMContentLoaded', init);

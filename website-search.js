// Bible book mappings for quick reference lookup
const BIBLE_BOOKS = {
    40: { name: 'Matthew', swedish: 'Matteus', abbrev: ['mat', 'matt', 'matthew'] },
    41: { name: 'Mark', swedish: 'Markus', abbrev: ['mrk', 'mk', 'mark', 'mar', 'markus'] },
    42: { name: 'Luke', swedish: 'Lukas', abbrev: ['luk', 'lk', 'luke', 'lukas'] },
    43: { name: 'John', swedish: 'Johannes', abbrev: ['jhn', 'jn', 'john', 'joh', 'johannes'] },
    44: { name: 'Acts', swedish: 'Apostlagärningarna', abbrev: ['act', 'acts', 'apg', 'apostla'] },
    45: { name: 'Romans', swedish: 'Romarbrevet', abbrev: ['rom', 'romans', 'romarbrevet'] },
    46: { name: '1 Corinthians', swedish: 'Första Korinthierbrevet', abbrev: ['1co', '1cor', '1kor', '1korint'] },
    47: { name: '2 Corinthians', swedish: 'Andra Korinthierbrevet', abbrev: ['2co', '2cor', '2kor', '2korint'] },
    48: { name: 'Galatians', swedish: 'Galaterbrevet', abbrev: ['gal', 'galatians', 'galaterbrevet'] },
    49: { name: 'Ephesians', swedish: 'Efesierbrevet', abbrev: ['eph', 'ephesians', 'ef', 'efe'] },
    50: { name: 'Philippians', swedish: 'Filipperbrevet', abbrev: ['php', 'phil', 'fil', 'filip'] },
    51: { name: 'Colossians', swedish: 'Kolosserbrevet', abbrev: ['col', 'colossians', 'kol', 'kolosser'] },
    58: { name: 'Hebrews', swedish: 'Hebreerbrevet', abbrev: ['heb', 'hebrews', 'hebr', 'hebreerbrevet'] },
    59: { name: 'James', swedish: 'Jakobs brev', abbrev: ['jas', 'jam', 'james', 'jak', 'jakob'] },
    60: { name: '1 Peter', swedish: 'Första Petrusbrevet', abbrev: ['1pe', '1pet', '1peter', '1petr'] },
    61: { name: '2 Peter', swedish: 'Andra Petrusbrevet', abbrev: ['2pe', '2pet', '2peter', '2petr'] },
    62: { name: '1 John', swedish: 'Första Johannesbrevet', abbrev: ['1jn', '1john', '1joh', '1johan'] },
    63: { name: '2 John', swedish: 'Andra Johannesbrevet', abbrev: ['2jn', '2john', '2joh', '2johan'] },
    64: { name: '3 John', swedish: 'Tredje Johannesbrevet', abbrev: ['3jn', '3john', '3joh', '3johan'] },
    65: { name: 'Jude', swedish: 'Judas brev', abbrev: ['jud', 'jude', 'judas'] },
    66: { name: 'Revelation', swedish: 'Uppenbarelseboken', abbrev: ['rev', 'revelation', 'upp', 'uppenb'] },
    19: { name: 'Psalms', swedish: 'Psaltaren', abbrev: ['psa', 'ps', 'psalm', 'psalms', 'psaltaren'] },
    1: { name: 'Genesis', swedish: 'Första Mosebok', abbrev: ['gen', 'ge', '1mos', '1mo'] },
    23: { name: 'Isaiah', swedish: 'Jesaja', abbrev: ['isa', 'isaiah', 'jes', 'jesaja'] }
};

// Create reverse lookup for Bible books
const BOOK_LOOKUP = new Map();
Object.entries(BIBLE_BOOKS).forEach(([bookNumber, book]) => {
    book.abbrev.forEach(abbrev => {
        BOOK_LOOKUP.set(abbrev.toLowerCase(), parseInt(bookNumber));
    });
});

// Enhanced Website Search with improved robustness and Bible search
class WebsiteSearch {
    constructor() {
        this.overlay = document.getElementById('searchOverlay');
        this.input = document.getElementById('searchInput');
        this.results = document.getElementById('searchResults');
        this.selectedIndex = -1;
        this.currentResults = [];
        this.websiteData = [];
        this.searchCache = new Map();
        this.debounceTimer = null;
        
        this.init();
    }

    async init() {
        await this.loadSearchData();
        this.setupEventListeners();
        this.precomputeSearchTerms();
    }

    async loadSearchData() {
        try {
            // Try to use external search data first
            if (typeof searchData !== 'undefined') {
                this.websiteData = searchData;
                console.log('Loaded search data from external file');
                return;
            }
            
            // If external data fails, try to load from window object
            if (typeof window !== 'undefined' && window.searchData) {
                this.websiteData = window.searchData;
                console.log('Loaded search data from window object');
                return;
            }
            
            // Fallback to basic data if external loading fails
            console.warn('External search data not found, using fallback data');
            this.websiteData = this.getFallbackData();
            
        } catch (error) {
            console.error('Error loading search data:', error);
            this.websiteData = this.getFallbackData();
        }
    }

    getFallbackData() {
        // Minimal fallback data in case external file fails to load
        return [
            {
                title: "Svenska Reformationsbibeln - Hem",
                description: "En Bibel i Tiden. Reformationsbibeln är en modern svensk översättning av Karl XII:s Bibel från 1703.",
                url: "#hem",
                icon: "fas fa-home",
                keywords: ["hem", "reformationsbibeln", "karl xii", "textus receptus", "bibel"]
            },
            {
                title: "Digital Bibelläsare",
                description: "Läs Svenska Reformationsbibeln online med sökfunktion.",
                url: "https://bibelonline.se/biblereader.php",
                icon: "fas fa-book-open",
                keywords: ["läs", "online", "digital", "bibelläsare", "bibel"]
            },
            {
                title: "Frågor & Svar",
                description: "Vanliga frågor och svar om Reformationsbibeln.",
                url: "QnA.html",
                icon: "fas fa-question-circle",
                keywords: ["frågor", "svar", "q&a", "grundtext"]
            }
        ];
    }

    // Bible verse parsing functionality
    parseBibleReference(query) {
        const cleanQuery = query.trim().toLowerCase();
        
        // Match patterns like "mat1", "mat1:17", "mat1:17-20"
        const biblePattern = /^([a-z]+)(\d+)(?::(\d+)(?:-(\d+))?)?$/i;
        const match = cleanQuery.match(biblePattern);
        
        if (match) {
            const [, bookAbbrev, chapter, verse, endVerse] = match;
            const bookNumber = BOOK_LOOKUP.get(bookAbbrev.toLowerCase());
            
            if (bookNumber && BIBLE_BOOKS[bookNumber]) {
                return {
                    bookNumber: bookNumber,
                    book: BIBLE_BOOKS[bookNumber],
                    chapter: chapter ? parseInt(chapter) : null,
                    verse: verse ? parseInt(verse) : null,
                    endVerse: endVerse ? parseInt(endVerse) : null,
                    originalQuery: query
                };
            }
        }
        
        return null;
    }

    generateBibleUrl(reference) {
        const { bookNumber, chapter, verse } = reference;
        
        // YouVersion book codes mapping
        const youVersionCodes = {
            1: 'GEN', 19: 'PSA', 23: 'ISA', 40: 'MAT', 41: 'MRK', 42: 'LUK', 43: 'JHN', 
            44: 'ACT', 45: 'ROM', 46: '1CO', 47: '2CO', 48: 'GAL', 49: 'EPH', 50: 'PHP',
            51: 'COL', 58: 'HEB', 59: 'JAS', 60: '1PE', 61: '2PE', 62: '1JN', 63: '2JN',
            64: '3JN', 65: 'JUD', 66: 'REV'
        };
        
        const code = youVersionCodes[bookNumber] || 'MAT';
        let url = `https://www.bible.com/bible/3413/${code}`;
        
        if (chapter) {
            url += `.${chapter}`;
            if (verse) {
                url += `.${verse}`;
            }
        }
        url += '.SRB16';
        
        return url;
    }

    formatBibleReference(reference) {
        const { book, chapter, verse, endVerse } = reference;
        let formatted = book.swedish;
        
        if (chapter) {
            formatted += ` ${chapter}`;
            if (verse) {
                formatted += `:${verse}`;
                if (endVerse) {
                    formatted += `-${endVerse}`;
                }
            }
        }
        
        return formatted;
    }

    createBibleSearchResult(reference) {
        const url = this.generateBibleUrl(reference);
        const formattedRef = this.formatBibleReference(reference);
        
        return {
            title: formattedRef,
            description: `Läs ${formattedRef} i Svenska Reformationsbibeln`,
            url: url,
            icon: 'fas fa-bible',
            score: 1000, // High priority for Bible searches
            type: 'bible',
            highlightedTitle: formattedRef,
            highlightedDescription: `Läs ${formattedRef} i Svenska Reformationsbibeln`
        };
    }

    precomputeSearchTerms() {
        // Pre-process search terms for better performance
        this.websiteData.forEach((item, index) => {
            // Create normalized search strings
            item._searchTitle = this.normalizeText(item.title);
            item._searchDescription = this.normalizeText(item.description);
            item._searchKeywords = item.keywords.map(k => this.normalizeText(k));
            item._searchAll = [
                item._searchTitle,
                item._searchDescription,
                ...item._searchKeywords
            ].join(' ');
            item._index = index;
        });
    }

    normalizeText(text) {
        return text.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
            .replace(/[^\w\s]/g, ' ') // Replace punctuation with spaces
            .replace(/\s+/g, ' ') // Collapse multiple spaces
            .trim();
    }

    setupEventListeners() {
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                this.isOpen() ? this.close() : this.open();
            }
            if (e.key === 'Escape' && this.isOpen()) {
                this.close();
            }
            if (this.isOpen()) {
                this.handleNavigation(e);
            }
        });

        // Debounced search input
        this.input.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            
            // Clear existing timer
            if (this.debounceTimer) {
                clearTimeout(this.debounceTimer);
            }
            
            // Set new timer for debounced search
            this.debounceTimer = setTimeout(() => {
                this.search(query);
            }, 150);
        });

        // Close on overlay click
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) this.close();
        });

        // Search button click handler
        const searchButton = document.getElementById('searchButton');
        if (searchButton) {
            searchButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.open();
            });
        }
    }

    open() {
        this.overlay.classList.add('active');
        this.input.value = '';
        this.showEmptyState();
        document.body.style.overflow = 'hidden';
        
        // Focus with slight delay for better UX
        setTimeout(() => {
            this.input.focus();
        }, 100);
    }

    close() {
        this.overlay.classList.remove('active');
        document.body.style.overflow = '';
        this.selectedIndex = -1;
        this.currentResults = [];
        
        // Clear any pending debounce
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }
    }

    isOpen() {
        return this.overlay.classList.contains('active');
    }

    showEmptyState() {
        this.results.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-globe"></i>
                <p>Börja skriva för att söka på webbplatsen...</p>
                <div class="search-hints">
                    <span>Försök med: "bibel", "Mat1:17", "joh3:16"</span>
                </div>
            </div>
        `;
    }

    search(query) {
        if (!query.trim()) {
            this.showEmptyState();
            return;
        }

        // Check cache first
        const cacheKey = query.toLowerCase();
        if (this.searchCache.has(cacheKey)) {
            this.displayResults(this.searchCache.get(cacheKey));
            return;
        }

        let results = [];

        // First, check if it's a Bible reference
        const bibleRef = this.parseBibleReference(query);
        if (bibleRef) {
            const bibleResult = this.createBibleSearchResult(bibleRef);
            results.push(bibleResult);
        }

        // Then add regular search results
        const websiteResults = this.performEnhancedSearch(query);
        results = results.concat(websiteResults);
        
        // Cache results for performance
        this.searchCache.set(cacheKey, results);
        
        // Limit cache size
        if (this.searchCache.size > 50) {
            const firstKey = this.searchCache.keys().next().value;
            this.searchCache.delete(firstKey);
        }
        
        this.displayResults(results);
    }

    performEnhancedSearch(query) {
        const normalizedQuery = this.normalizeText(query);
        const searchTerms = normalizedQuery.split(/\s+/).filter(term => term.length >= 2);
        const results = [];

        if (searchTerms.length === 0) return results;

        this.websiteData.forEach(item => {
            let score = 0;
            let matchDetails = {
                titleMatches: 0,
                keywordMatches: 0,
                descriptionMatches: 0,
                exactMatches: 0,
                partialMatches: 0
            };

            searchTerms.forEach(term => {
                // Exact title matches (highest priority)
                if (item._searchTitle === term) {
                    score += 25;
                    matchDetails.exactMatches++;
                } else if (item._searchTitle.includes(term)) {
                    score += 15;
                    matchDetails.titleMatches++;
                }

                // Exact keyword matches (high priority)
                const exactKeywordMatch = item._searchKeywords.find(keyword => keyword === term);
                if (exactKeywordMatch) {
                    score += 20;
                    matchDetails.exactMatches++;
                } else {
                    // Partial keyword matches
                    const partialKeywordMatches = item._searchKeywords.filter(keyword => 
                        keyword.includes(term) || term.includes(keyword)
                    );
                    if (partialKeywordMatches.length > 0) {
                        score += partialKeywordMatches.length * 8;
                        matchDetails.keywordMatches += partialKeywordMatches.length;
                    }
                }

                // Description matches (medium priority)
                if (item._searchDescription.includes(term)) {
                    const occurrences = (item._searchDescription.match(new RegExp(term, 'g')) || []).length;
                    score += occurrences * 3;
                    matchDetails.descriptionMatches += occurrences;
                }

                // Fuzzy matching for typos (low priority)
                if (term.length >= 4) {
                    const fuzzyMatches = this.findFuzzyMatches(term, item._searchAll);
                    score += fuzzyMatches * 1;
                    matchDetails.partialMatches += fuzzyMatches;
                }
            });

            // Bonus for multiple term matches
            const matchingTerms = searchTerms.filter(term => 
                item._searchAll.includes(term)
            ).length;
            
            if (matchingTerms > 1) {
                score += matchingTerms * 5;
            }

            // Bonus for exact phrase matches
            if (normalizedQuery.length > 5 && item._searchAll.includes(normalizedQuery)) {
                score += 30;
            }

            if (score > 0) {
                results.push({
                    ...item,
                    score,
                    matchDetails,
                    type: 'website',
                    highlightedTitle: this.highlightMatches(item.title, searchTerms),
                    highlightedDescription: this.highlightMatches(item.description, searchTerms)
                });
            }
        });

        // Sort by score and relevance
        return results
            .sort((a, b) => {
                if (b.score !== a.score) return b.score - a.score;
                // Secondary sort by exact matches
                return b.matchDetails.exactMatches - a.matchDetails.exactMatches;
            })
            .slice(0, 12); // Show more results
    }

    findFuzzyMatches(term, text) {
        // Simple fuzzy matching for common typos
        const words = text.split(/\s+/);
        let matches = 0;
        
        words.forEach(word => {
            if (word.length >= term.length - 1 && word.length <= term.length + 1) {
                const distance = this.levenshteinDistance(term, word);
                if (distance <= 1 && term.length >= 4) {
                    matches++;
                }
            }
        });
        
        return matches;
    }

    levenshteinDistance(str1, str2) {
        const matrix = [];
        
        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }
        
        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }
        
        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        
        return matrix[str2.length][str1.length];
    }

    highlightMatches(text, searchTerms) {
        let highlighted = text;
        
        // Sort terms by length (longest first) to avoid partial highlighting issues
        const sortedTerms = searchTerms
            .filter(term => term.length >= 2)
            .sort((a, b) => b.length - a.length);
        
        sortedTerms.forEach(term => {
            // Escape special regex characters
            const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            // Use word boundaries for better matching
            const regex = new RegExp(`\\b(${escapedTerm})`, 'gi');
            highlighted = highlighted.replace(regex, '<mark>$1</mark>');
        });
        
        return highlighted;
    }

    displayResults(results) {
        this.currentResults = results;
        this.selectedIndex = 0; // Auto-select first result

        if (results.length === 0) {
            this.results.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <p>Inga resultat hittades</p>
                    <div class="search-hints">
                        <span>Försök med andra sökord, bibelreferenser som "Mat1:17"</span>
                    </div>
                </div>
            `;
            return;
        }

        const html = results.map((result, index) => {
            const isBible = result.type === 'bible';
            const resultClass = `result-item ${index === 0 ? 'selected' : ''} ${isBible ? 'bible-result' : ''}`;
            
            return `
                <div class="${resultClass}" data-index="${index}">
                    <div class="result-icon ${isBible ? 'bible-icon' : ''}">
                        <i class="${result.icon}"></i>
                    </div>
                    <div class="result-content">
                        <div class="result-title">${result.highlightedTitle}</div>
                        <div class="result-description">${result.highlightedDescription}</div>
                        <div class="result-url">${this.formatUrl(result.url, isBible)}</div>
                        ${this.shouldShowScore() ? `<div class="result-score">Score: ${result.score}</div>` : ''}
                    </div>
                    <div class="result-arrow">
                        <i class="fas fa-arrow-right"></i>
                    </div>
                </div>
            `;
        }).join('');

        this.results.innerHTML = html;

        // Add click handlers
        this.results.querySelectorAll('.result-item').forEach((item, index) => {
            item.addEventListener('click', () => this.selectResult(index));
            item.addEventListener('mouseenter', () => {
                this.selectedIndex = index;
                this.updateSelection();
            });
        });
    }

    formatUrl(url, isBible = false) {
        if (isBible) {
            return 'Svenska Reformationsbibeln - YouVersion';
        }
        
        if (url.startsWith('#')) {
            return `På denna sida ${url}`;
        }
        if (url.includes('bibel.se')) {
            return 'bibel.se';
        }
        if (url.includes('bibelonline.se')) {
            return 'bibelonline.se';
        }
        if (url.includes('youtube.com')) {
            return 'YouTube';
        }
        if (url.includes('bible.com')) {
            return 'YouVersion';
        }
        try {
            const urlObj = new URL(url);
            return urlObj.hostname;
        } catch {
            return 'Extern länk';
        }
    }

    shouldShowScore() {
        // Show scores in development mode
        return window.location.hostname === 'localhost' || window.location.search.includes('debug=1');
    }

    handleNavigation(e) {
        const resultItems = this.results.querySelectorAll('.result-item');
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            this.selectedIndex = Math.min(this.selectedIndex + 1, resultItems.length - 1);
            this.updateSelection();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
            this.updateSelection();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (this.selectedIndex >= 0 && this.selectedIndex < this.currentResults.length) {
                this.selectResult(this.selectedIndex);
            } else if (this.currentResults.length > 0) {
                // If no item is selected but there are results, select the first one
                this.selectResult(0);
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            // Cycle through results with Tab
            if (resultItems.length > 0) {
                this.selectedIndex = (this.selectedIndex + 1) % resultItems.length;
                this.updateSelection();
            }
        }
    }

    updateSelection() {
        const resultItems = this.results.querySelectorAll('.result-item');
        resultItems.forEach((item, index) => {
            item.classList.toggle('selected', index === this.selectedIndex);
        });
        
        if (this.selectedIndex >= 0 && resultItems[this.selectedIndex]) {
            resultItems[this.selectedIndex].scrollIntoView({ 
                block: 'nearest',
                behavior: 'smooth'
            });
        }
    }

    selectResult(index) {
        const result = this.currentResults[index];
        if (!result) return;

        try {
            if (result.url.startsWith('#')) {
                // Internal anchor link
                const element = document.querySelector(result.url);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                    this.showNotification(`Navigerar till: ${result.title}`, 'internal');
                } else {
                    this.showNotification(`Kunde inte hitta sektion: ${result.url}`, 'error');
                }
            } else {
                // External link - open in new tab/window
                window.open(result.url, '_blank', 'noopener,noreferrer');
                this.showNotification(`Öppnar: ${result.title}`, result.type === 'bible' ? 'bible' : 'external');
            }
            
            this.close();
            
        } catch (error) {
            console.error('Error navigating to result:', error);
            this.showNotification('Ett fel uppstod vid navigering', 'error');
        }
    }

    showNotification(message, type = 'info') {
        // Remove any existing notifications first
        const existingNotification = document.querySelector('.search-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `search-notification notification-${type}`;
        
        // Choose appropriate icon based on type
        let iconClass = 'fas fa-info-circle';
        if (type === 'external') iconClass = 'fas fa-external-link-alt';
        if (type === 'internal') iconClass = 'fas fa-link';
        if (type === 'error') iconClass = 'fas fa-exclamation-triangle';
        if (type === 'bible') iconClass = 'fas fa-bible';
        
        notification.innerHTML = `
            <i class="${iconClass}"></i> 
            <span>${message}</span>
        `;
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Show with animation
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Hide and remove after longer duration (6 seconds instead of 3)
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 6000); // Increased from 3000 to 6000ms
    }

    // Public method to programmatically trigger search
    triggerSearch(query) {
        this.open();
        this.input.value = query;
        this.search(query);
    }

    // Public method to get search statistics
    getSearchStats() {
        return {
            totalEntries: this.websiteData.length,
            cacheSize: this.searchCache.size,
            lastSearchResultCount: this.currentResults.length,
            bibleSearchEnabled: true
        };
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    const search = new WebsiteSearch();
    
    // Make search instance globally available for debugging
    window.websiteSearch = search;
    
    // Optional: Add keyboard shortcut info to help
    if (window.location.search.includes('debug=1')) {
        console.log('Website Search initialized with Bible search functionality');
        console.log('Available shortcuts: Ctrl/Cmd+K (open/close), Arrow keys (navigate), Enter (select), Tab (cycle), Escape (close)');
        console.log('Try Bible searches: Mat1:17, joh3:16, psalm23, rom8:28');
        console.log('Search stats:', search.getSearchStats());
    }
});
# Grundtextskillnader (TR vs UN) - Refactored

A clean, maintainable Bible text variants comparison tool.

## Files Structure

```
├── index.html      - Main HTML structure
├── styles.css      - All styling (organized by sections)
├── verse_data.js   - Data file (YOU NEED TO POPULATE THIS)
├── app.js          - Application logic
└── README.md       - This file
```

## Setup Instructions

1. **Add your verse data** to `verse_data.js`:
   - Replace the empty `allVariants = []` with your full data array
   - Each variant should have: `category`, `verse`, `tr_text`, `un_text`, `impact`

2. **Open `index.html`** in a browser - that's it!

## Key Improvements

### Code Reduction
- **Before**: ~2400 lines in one HTML file
- **After**: ~400 lines split across 4 organized files

### Better Organization
- Separated concerns: HTML, CSS, JS, Data
- CSS organized by sections with clear comments
- JavaScript uses modern patterns (const, arrow functions, template literals)
- All configuration in one place (CATEGORIES, BOOK_MAP)

### Features Retained
- ✅ All 18 categories
- ✅ Search functionality
- ✅ Category filtering
- ✅ Mobile-responsive design
- ✅ Sticky header with scroll compacting
- ✅ Bible verse links (YouVersion)
- ✅ Desktop table view
- ✅ Mobile card view
- ✅ Keyboard shortcuts (Ctrl/Cmd+F, Escape)

### Maintainability
- Easy to update categories (edit CATEGORIES object)
- Easy to update styles (CSS variables at top)
- Easy to add features (modular functions)
- Easy to debug (clear function names, organized code)

## How It Works

1. **Data Loading**: `verse_data.js` provides the variants array
2. **Rendering**: `app.js` groups variants by category and renders them
3. **Filtering**: Search and category filters update `filteredVariants`
4. **Views**: Desktop shows tables, mobile shows cards (CSS media queries)

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- No build step required

## Performance

- Efficient rendering with template literals
- Debounced search (300ms)
- Throttled scroll events
- Event delegation for filter options

## Customization

### Change Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --primary-bg: #f4f0e0;
    --accent-color: #8b6914;
    /* etc */
}
```

### Add Category
1. Add to `CATEGORIES` in `app.js`
2. Add variants with that category to data
3. Done!

### Change Bible Version
Edit `generateBibleLink()` in `app.js` to change the version ID (currently 3413)

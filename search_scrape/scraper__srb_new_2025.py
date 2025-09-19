#!/usr/bin/env python3
"""
Svenska Reformationsbibeln (SRB16) Downloader - Fixed Version with Better Parsing
Downloads SRB16 (Version ID: 3413) from YouVersion Bible.com

The SRB16 is freely available with no restrictions on copying text.
URL Pattern: https://www.bible.com/bible/3413/{BOOK}.{CHAPTER}.SRB16
"""

import requests
import json
import time
import re
from bs4 import BeautifulSoup
from pathlib import Path
import sys
from typing import Dict, List, Tuple, Optional

class SRB16Downloader:
    def __init__(self):
        """Initialize the SRB16 downloader"""
        
        self.version_id = 3413
        self.version_code = "SRB16" 
        self.version_name = "Svenska Reformationsbibeln"
        self.debug_mode = False  # Set to True to see debug output
        
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'sv-SE,sv;q=0.9,en;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Cache-Control': 'no-cache'
        })
        
        # Expected verse counts for major chapters (for validation)
        self.expected_verse_counts = {
            'MAT': {1: 25, 2: 23, 3: 17, 4: 25, 5: 48, 6: 34, 7: 29, 8: 34, 9: 38, 10: 42},
            'MRK': {1: 45, 2: 28, 3: 35, 4: 41, 5: 43, 6: 56, 7: 37, 8: 38, 9: 50, 10: 52},
            'LUK': {1: 80, 2: 52, 3: 38, 4: 44, 5: 39, 6: 49, 7: 50, 8: 56, 9: 62, 10: 42},
            'JHN': {1: 51, 2: 25, 3: 36, 4: 54, 5: 47, 6: 71, 7: 53, 8: 59, 9: 41, 10: 42}
        }
        
        # Bible books with chapter counts
        self.books = {
            # Old Testament (39 books) 
            'GEN': {'name': 'Första Mosebok', 'chapters': 50, 'swedish': 'Första Mosebok'},
            'EXO': {'name': 'Andra Mosebok', 'chapters': 40, 'swedish': 'Andra Mosebok'},
            'LEV': {'name': 'Tredje Mosebok', 'chapters': 27, 'swedish': 'Tredje Mosebok'},
            'NUM': {'name': 'Fjärde Mosebok', 'chapters': 36, 'swedish': 'Fjärde Mosebok'},
            'DEU': {'name': 'Femte Mosebok', 'chapters': 34, 'swedish': 'Femte Mosebok'},
            'JOS': {'name': 'Josua', 'chapters': 24, 'swedish': 'Josua'},
            'JDG': {'name': 'Domarboken', 'chapters': 21, 'swedish': 'Domarboken'},
            'RUT': {'name': 'Rut', 'chapters': 4, 'swedish': 'Rut'},
            '1SA': {'name': 'Första Samuelsboken', 'chapters': 31, 'swedish': 'Första Samuelsboken'},
            '2SA': {'name': 'Andra Samuelsboken', 'chapters': 24, 'swedish': 'Andra Samuelsboken'},
            '1KI': {'name': 'Första Kungaboken', 'chapters': 22, 'swedish': 'Första Kungaboken'}, 
            '2KI': {'name': 'Andra Kungaboken', 'chapters': 25, 'swedish': 'Andra Kungaboken'},
            '1CH': {'name': 'Första Krönikeboken', 'chapters': 29, 'swedish': 'Första Krönikeboken'},
            '2CH': {'name': 'Andra Krönikeboken', 'chapters': 36, 'swedish': 'Andra Krönikeboken'},
            'EZR': {'name': 'Esra', 'chapters': 10, 'swedish': 'Esra'},
            'NEH': {'name': 'Nehemja', 'chapters': 13, 'swedish': 'Nehemja'},
            'EST': {'name': 'Ester', 'chapters': 10, 'swedish': 'Ester'},
            'JOB': {'name': 'Job', 'chapters': 42, 'swedish': 'Job'},
            'PSA': {'name': 'Psaltaren', 'chapters': 150, 'swedish': 'Psaltaren'},
            'PRO': {'name': 'Ordspråksboken', 'chapters': 31, 'swedish': 'Ordspråksboken'},
            'ECC': {'name': 'Predikaren', 'chapters': 12, 'swedish': 'Predikaren'},
            'SNG': {'name': 'Höga visan', 'chapters': 8, 'swedish': 'Höga visan'},
            'ISA': {'name': 'Jesaja', 'chapters': 66, 'swedish': 'Jesaja'},
            'JER': {'name': 'Jeremia', 'chapters': 52, 'swedish': 'Jeremia'},
            'LAM': {'name': 'Klagovisorna', 'chapters': 5, 'swedish': 'Klagovisorna'},
            'EZK': {'name': 'Hesekiel', 'chapters': 48, 'swedish': 'Hesekiel'},
            'DAN': {'name': 'Daniel', 'chapters': 12, 'swedish': 'Daniel'},
            'HOS': {'name': 'Hosea', 'chapters': 14, 'swedish': 'Hosea'},
            'JOL': {'name': 'Joel', 'chapters': 3, 'swedish': 'Joel'},
            'AMO': {'name': 'Amos', 'chapters': 9, 'swedish': 'Amos'},
            'OBA': {'name': 'Obadja', 'chapters': 1, 'swedish': 'Obadja'},
            'JON': {'name': 'Jona', 'chapters': 4, 'swedish': 'Jona'},
            'MIC': {'name': 'Mika', 'chapters': 7, 'swedish': 'Mika'},
            'NAM': {'name': 'Nahum', 'chapters': 3, 'swedish': 'Nahum'},
            'HAB': {'name': 'Habacuk', 'chapters': 3, 'swedish': 'Habacuk'},
            'ZEP': {'name': 'Sefanja', 'chapters': 3, 'swedish': 'Sefanja'},
            'HAG': {'name': 'Haggai', 'chapters': 2, 'swedish': 'Haggai'},
            'ZEC': {'name': 'Sakarja', 'chapters': 14, 'swedish': 'Sakarja'},
            'MAL': {'name': 'Malaki', 'chapters': 4, 'swedish': 'Malaki'},
            
            # New Testament (27 books)
            'MAT': {'name': 'Matteus', 'chapters': 28, 'swedish': 'Matteus'},
            'MRK': {'name': 'Markus', 'chapters': 16, 'swedish': 'Markus'},
            'LUK': {'name': 'Lukas', 'chapters': 24, 'swedish': 'Lukas'},
            'JHN': {'name': 'Johannes', 'chapters': 21, 'swedish': 'Johannes'},
            'ACT': {'name': 'Apostlagärningar', 'chapters': 28, 'swedish': 'Apostlagärningar'},
            'ROM': {'name': 'Romarbrevet', 'chapters': 16, 'swedish': 'Romarbrevet'},
            '1CO': {'name': 'Första Korintierbrevet', 'chapters': 16, 'swedish': 'Första Korintierbrevet'},
            '2CO': {'name': 'Andra Korintierbrevet', 'chapters': 13, 'swedish': 'Andra Korintierbrevet'},
            'GAL': {'name': 'Galaterbrevet', 'chapters': 6, 'swedish': 'Galaterbrevet'},
            'EPH': {'name': 'Efesierbrevet', 'chapters': 6, 'swedish': 'Efesierbrevet'},
            'PHP': {'name': 'Filipperbrevet', 'chapters': 4, 'swedish': 'Filipperbrevet'},
            'COL': {'name': 'Kolosserbrevet', 'chapters': 4, 'swedish': 'Kolosserbrevet'},
            '1TH': {'name': 'Första Tessalonikerbrevet', 'chapters': 5, 'swedish': 'Första Tessalonikerbrevet'},
            '2TH': {'name': 'Andra Tessalonikerbrevet', 'chapters': 3, 'swedish': 'Andra Tessalonikerbrevet'},
            '1TI': {'name': 'Första Timotheusbrevet', 'chapters': 6, 'swedish': 'Första Timotheusbrevet'},
            '2TI': {'name': 'Andra Timotheusbrevet', 'chapters': 4, 'swedish': 'Andra Timotheusbrevet'},
            'TIT': {'name': 'Titusbrevet', 'chapters': 3, 'swedish': 'Titusbrevet'},
            'PHM': {'name': 'Filemonbrevet', 'chapters': 1, 'swedish': 'Filemonbrevet'},
            'HEB': {'name': 'Hebreerbrevet', 'chapters': 13, 'swedish': 'Hebreerbrevet'},
            'JAS': {'name': 'Jakobs brev', 'chapters': 5, 'swedish': 'Jakobs brev'},
            '1PE': {'name': 'Första Petrusbrevet', 'chapters': 5, 'swedish': 'Första Petrusbrevet'},
            '2PE': {'name': 'Andra Petrusbrevet', 'chapters': 3, 'swedish': 'Andra Petrusbrevet'},
            '1JN': {'name': 'Första Johannesbrevet', 'chapters': 5, 'swedish': 'Första Johannesbrevet'},
            '2JN': {'name': 'Andra Johannesbrevet', 'chapters': 1, 'swedish': 'Andra Johannesbrevet'},
            '3JN': {'name': 'Tredje Johannesbrevet', 'chapters': 1, 'swedish': 'Tredje Johannesbrevet'},
            'JUD': {'name': 'Judas brev', 'chapters': 1, 'swedish': 'Judas brev'},
            'REV': {'name': 'Uppenbarelseboken', 'chapters': 22, 'swedish': 'Uppenbarelseboken'}
        }

    def debug_print(self, message: str):
        """Print debug message if debug mode is enabled"""
        if self.debug_mode:
            print(f"DEBUG: {message}")

    def clean_verse_text(self, text: str) -> str:
        """Clean verse text from all non-biblical content"""
        if not text:
            return ""
        
        # Remove cross-references with # (e.g., "#Luk 3:23f.")
        text = re.sub(r'#[^.]*\.?\s*', '', text)
        
        # Remove footnote markers and "not *Alt. övers." patterns
        text = re.sub(r'#?\d+:\d+\s+not\s+\*[^.]*\.?\s*', '', text)
        
        # Remove any "not *" patterns (alternative translations)
        text = re.sub(r'\s+not\s+\*[^.]*\.?\s*', '', text)
        
        # Remove footnote markers like *Alt. övers. or *Alternativ översättning
        text = re.sub(r'\*[Aa]lt\.?\s*övers?\.?[^.]*\.?\s*', '', text)
        text = re.sub(r'\*[Aa]lternativ[^.]*\.?\s*', '', text)
        
        # Remove other footnote patterns with *
        text = re.sub(r'\*[^.]*\.?\s*', '', text)
        
        # Remove standalone "not" or "Not" that might be left over
        text = re.sub(r'\b[Nn]ot\b\s*', '', text)
        
        # Remove any remaining cross-reference patterns
        text = re.sub(r'#\w+\s*\d+:\d+[^.]*\.?\s*', '', text)
        
        # Clean up multiple spaces and trim
        text = re.sub(r'\s+', ' ', text).strip()
        
        return text

    def is_valid_verse_text(self, text: str) -> bool:
        """Check if text looks like a valid Bible verse"""
        if not text or len(text.strip()) < 3:
            return False
        
        # Filter out obvious non-verse content
        invalid_patterns = [
            r'^Life\.Church',
            r'Privacy Policy',
            r'Terms',
            r'Vulnerability Disclosure',
            r'Facebook.*Twitter.*Instagram',
            r'^Home.*Bible.*Plans',
            r'YouVersion',
            r'^not\s*$',
            r'^Not\s*$',
            r'^\*?[Aa]lt\.?\s*övers',
            r'^\*?[Aa]lternativ',
            r'^#\d+:\d+',
            r'^\s*$',
            r'^Cookie',
            r'^Accept',
            r'^Settings',
            r'^Menu',
            r'^Sign\s+in',
            r'^Download',
            r'^App\s+Store',
            r'^Google\s+Play'
        ]
        
        for pattern in invalid_patterns:
            if re.search(pattern, text, re.IGNORECASE):
                return False
        
        return True

    def extract_verse_content_advanced(self, soup: BeautifulSoup) -> str:
        """Advanced extraction targeting YouVersion's specific structure"""
        
        # Method 1: Try YouVersion-specific selectors
        verse_selectors = [
            'span[data-usfm*="."]',  # Verses with USFM data
            '.verse',
            '.v',
            '[class*="verse"]',
            '[class*="Verse"]',
            'span.label-1 + span',  # Verse number + text pattern
            'span.ChapterContent_verse__',  # YouVersion specific
            '.ChapterContent_content__',
            '.reader span[data-usfm]'
        ]
        
        # Try each selector
        for selector in verse_selectors:
            elements = soup.select(selector)
            if elements:
                self.debug_print(f"Found {len(elements)} elements with selector: {selector}")
                
                # Extract text from all verse elements
                verse_texts = []
                for elem in elements:
                    text = elem.get_text(strip=True)
                    if text and len(text) > 3:
                        verse_texts.append(text)
                
                if verse_texts:
                    combined_text = " ".join(verse_texts)
                    self.debug_print(f"Combined text length: {len(combined_text)}")
                    return combined_text
        
        # Method 2: Look for the main content container
        content_selectors = [
            'div.ChapterContent_reader__',
            'div[data-testid="chapter-content"]',
            'main[role="main"]',
            'div.reader',
            'div.chapter-content',
            '.content',
            'main',
            'article'
        ]
        
        for selector in content_selectors:
            container = soup.select_one(selector)
            if container:
                self.debug_print(f"Found container with selector: {selector}")
                
                # Remove navigation and footer elements
                for unwanted in container.select('nav, footer, header, .nav, .footer, .header, .navigation, .breadcrumb, .social-links, .app-download'):
                    unwanted.decompose()
                
                text = container.get_text()
                if text and len(text) > 100:  # Should have substantial content
                    self.debug_print(f"Container text length: {len(text)}")
                    return text
        
        # Method 3: Fallback - look for patterns that indicate verses
        # Find elements that contain verse-like patterns (number followed by text)
        potential_verse_elements = soup.find_all(string=re.compile(r'^\d+\s+\w'))
        if potential_verse_elements:
            self.debug_print(f"Found {len(potential_verse_elements)} potential verse strings")
            
            # Get the common parent of these elements
            parents = [elem.parent for elem in potential_verse_elements[:5]]
            if parents:
                # Find the highest common ancestor
                common_parent = parents[0]
                for parent in parents[1:]:
                    # Simple approach - go up until we find a container
                    temp = parent
                    while temp and temp != common_parent and temp.name not in ['body', 'html']:
                        temp = temp.parent
                    if temp == common_parent:
                        continue
                    # Find common ancestor
                    while common_parent and common_parent not in [p for p in parent.parents]:
                        common_parent = common_parent.parent
                
                if common_parent:
                    text = common_parent.get_text()
                    if text and len(text) > 100:
                        self.debug_print(f"Common parent text length: {len(text)}")
                        return text
        
        # Method 4: Last resort - get all text but this is unreliable
        self.debug_print("Using fallback method - getting all text")
        return soup.get_text()

    def parse_verses_improved(self, raw_text: str, book_code: str, chapter: int) -> dict:
        """Improved verse parsing with multiple strategies"""
        verses = {}
        
        if not raw_text:
            return verses
        
        self.debug_print(f"Raw text length for {book_code} {chapter}: {len(raw_text)}")
        self.debug_print(f"First 500 chars: {raw_text[:500]}")
        
        # Clean up the text - remove extra whitespace and newlines
        text = re.sub(r'\s+', ' ', raw_text.strip())
        
        # Strategy 1: Standard verse pattern (number space text)
        verse_pattern1 = r'(\d+)\s+([^0-9]*?)(?=\s+\d+\s+|$)'
        matches1 = re.findall(verse_pattern1, text, re.DOTALL)
        
        if matches1:
            self.debug_print(f"Strategy 1 found {len(matches1)} matches")
            verses.update(self.process_verse_matches(matches1))
        
        # Strategy 2: More flexible pattern allowing for various separators
        if not verses:
            verse_pattern2 = r'(\d+)[\s\.\-:]*([^0-9]*?)(?=\s*\d+[\s\.\-:]|$)'
            matches2 = re.findall(verse_pattern2, text, re.DOTALL)
            
            if matches2:
                self.debug_print(f"Strategy 2 found {len(matches2)} matches")
                verses.update(self.process_verse_matches(matches2))
        
        # Strategy 3: Line-based parsing for cases where verses are on separate lines
        if not verses:
            lines = text.split('\n')
            current_verse_num = None
            current_verse_text = []
            
            for line in lines:
                line = line.strip()
                if not line:
                    continue
                
                # Check if line starts with a verse number
                verse_match = re.match(r'^(\d+)\s+(.+)', line)
                if verse_match:
                    # Save previous verse if exists
                    if current_verse_num and current_verse_text:
                        combined_text = ' '.join(current_verse_text)
                        cleaned_text = self.clean_verse_text(combined_text)
                        if self.is_valid_verse_text(cleaned_text):
                            verses[current_verse_num] = cleaned_text
                    
                    # Start new verse
                    current_verse_num = int(verse_match.group(1))
                    current_verse_text = [verse_match.group(2)]
                else:
                    # Continue current verse
                    if current_verse_num:
                        current_verse_text.append(line)
            
            # Don't forget the last verse
            if current_verse_num and current_verse_text:
                combined_text = ' '.join(current_verse_text)
                cleaned_text = self.clean_verse_text(combined_text)
                if self.is_valid_verse_text(cleaned_text):
                    verses[current_verse_num] = cleaned_text
            
            if verses:
                self.debug_print(f"Strategy 3 found {len(verses)} verses")
        
        # Strategy 4: Split on likely verse boundaries and parse
        if not verses:
            # Split on patterns that look like verse starts
            verse_boundaries = re.split(r'\s+(\d+)\s+', text)
            if len(verse_boundaries) > 2:  # Should have number, text, number, text, etc.
                for i in range(1, len(verse_boundaries), 2):
                    try:
                        verse_num = int(verse_boundaries[i])
                        if i + 1 < len(verse_boundaries):
                            verse_text = verse_boundaries[i + 1]
                            cleaned_text = self.clean_verse_text(verse_text)
                            if self.is_valid_verse_text(cleaned_text):
                                verses[verse_num] = cleaned_text
                    except (ValueError, IndexError):
                        continue
                
                if verses:
                    self.debug_print(f"Strategy 4 found {len(verses)} verses")
        
        # Validation: Check if we got a reasonable number of verses
        expected_count = self.expected_verse_counts.get(book_code, {}).get(chapter)
        if expected_count and verses:
            actual_count = len(verses)
            if actual_count < expected_count * 0.5:  # Less than 50% of expected
                self.debug_print(f"WARNING: Only got {actual_count} verses, expected ~{expected_count}")
        
        return verses

    def process_verse_matches(self, matches: List[Tuple[str, str]]) -> dict:
        """Process regex matches into verse dictionary"""
        verses = {}
        
        for verse_num_str, verse_text in matches:
            try:
                verse_num = int(verse_num_str)
                
                # Skip obviously invalid verse numbers
                if verse_num < 1 or verse_num > 999:
                    continue
                
                # Clean the verse text thoroughly
                clean_text = self.clean_verse_text(verse_text)
                
                # Validate the cleaned text
                if self.is_valid_verse_text(clean_text):
                    verses[verse_num] = clean_text
                    
            except ValueError:
                continue
        
        return verses

    def fetch_chapter(self, book_code: str, chapter: int, retry_count: int = 3) -> dict:
        """Fetch a chapter from YouVersion SRB16 with improved parsing and retry logic"""
        
        url = f"https://www.bible.com/bible/{self.version_id}/{book_code}.{chapter}.{self.version_code}"
        
        print(f"  📖 {book_code} {chapter}... ", end="", flush=True)
        
        for attempt in range(retry_count):
            try:
                # Add slight delay before each attempt
                if attempt > 0:
                    time.sleep(2)
                    self.debug_print(f"Retry attempt {attempt + 1} for {book_code} {chapter}")
                
                response = self.session.get(url, timeout=30)
                response.raise_for_status()
                
                soup = BeautifulSoup(response.content, 'html.parser')
                
                # Extract verse content using advanced method
                verse_text = self.extract_verse_content_advanced(soup)
                
                # Parse verses using improved method
                verses = self.parse_verses_improved(verse_text, book_code, chapter)
                
                # Validate result
                if verses:
                    verse_count = len(verses)
                    expected_count = self.expected_verse_counts.get(book_code, {}).get(chapter)
                    
                    # Check if we got a reasonable number of verses
                    if expected_count and verse_count < expected_count * 0.3:
                        self.debug_print(f"Got {verse_count} verses, expected ~{expected_count} - retrying")
                        if attempt < retry_count - 1:
                            continue  # Retry
                    
                    print(f"✅ ({verse_count} verses)")
                    return {
                        'book': book_code,
                        'book_name': self.books[book_code]['name'],
                        'chapter': chapter,
                        'verses': verses
                    }
                else:
                    if attempt < retry_count - 1:
                        self.debug_print(f"No verses found, retrying...")
                        continue
                    
                print("❌ No verses found")
                return None
                
            except Exception as e:
                if attempt < retry_count - 1:
                    self.debug_print(f"Error on attempt {attempt + 1}: {e}, retrying...")
                    continue
                else:
                    print(f"❌ Error: {e}")
                    return None
        
        return None

    def verify_chapter_quality(self, book_code: str, chapter: int, verses: Dict[int, str]) -> List[str]:
        """Verify quality of a downloaded chapter"""
        issues = []
        
        if not verses:
            issues.append("No verses found")
            return issues
        
        # Check for missing verse 1
        if 1 not in verses:
            issues.append("Missing verse 1")
        
        # Check for gaps in verse numbering
        verse_nums = sorted(verses.keys())
        for i in range(len(verse_nums) - 1):
            if verse_nums[i+1] - verse_nums[i] > 1:
                gap_start = verse_nums[i] + 1
                gap_end = verse_nums[i+1] - 1
                issues.append(f"Missing verses {gap_start}-{gap_end}")
        
        # Check for very short verses (might indicate parsing issues)
        short_verses = [v for v, text in verses.items() if len(text) < 10]
        if short_verses:
            issues.append(f"Very short verses: {short_verses}")
        
        # Check for verses with suspicious content
        suspicious_verses = []
        for v, text in verses.items():
            if any(keyword in text.lower() for keyword in ['youversion', 'privacy', 'facebook', 'twitter', 'cookie', 'app store']):
                suspicious_verses.append(v)
        if suspicious_verses:
            issues.append(f"Verses with suspicious content: {suspicious_verses}")
        
        # Check if verse count is reasonable compared to expected
        verse_count = len(verses)
        expected_count = self.expected_verse_counts.get(book_code, {}).get(chapter)
        
        if expected_count:
            if verse_count < expected_count * 0.5:
                issues.append(f"Too few verses ({verse_count}) - expected ~{expected_count}")
            elif verse_count > expected_count * 1.5:
                issues.append(f"Too many verses ({verse_count}) - expected ~{expected_count}")
        else:
            # General sanity check
            if verse_count < 3:
                issues.append(f"Very few verses ({verse_count}) - possible parsing issue")
            elif verse_count > 200:
                issues.append(f"Too many verses ({verse_count}) - possible parsing issue")
        
        return issues

    def verify_json_structure(self, data: dict) -> List[str]:
        """Verify the JSON structure and content"""
        issues = []
        
        # Check top-level structure
        required_keys = ['version', 'version_name', 'version_id', 'language', 'language_name', 'books']
        for key in required_keys:
            if key not in data:
                issues.append(f"Missing top-level key: {key}")
        
        if 'books' not in data:
            issues.append("No books data found")
            return issues
        
        # Check each book
        for book_code, book_data in data['books'].items():
            if book_code not in self.books:
                issues.append(f"Unknown book code: {book_code}")
                continue
            
            # Check book structure
            book_required = ['code', 'name', 'swedish_name', 'chapters']
            for key in book_required:
                if key not in book_data:
                    issues.append(f"Book {book_code} missing key: {key}")
            
            expected_chapters = self.books[book_code]['chapters']
            actual_chapters = len(book_data.get('chapters', {}))
            
            if actual_chapters != expected_chapters:
                issues.append(f"Book {book_code}: expected {expected_chapters} chapters, got {actual_chapters}")
            
            # Check chapters
            for chapter_num, verses in book_data.get('chapters', {}).items():
                try:
                    ch_num = int(chapter_num)
                    if ch_num < 1 or ch_num > expected_chapters:
                        issues.append(f"Book {book_code}: invalid chapter number {ch_num}")
                except ValueError:
                    issues.append(f"Book {book_code}: invalid chapter number format '{chapter_num}'")
        
        return issues

    def generate_verification_report(self, data: dict) -> dict:
        """Generate comprehensive verification report"""
        report = {
            'timestamp': time.strftime('%Y-%m-%d %H:%M:%S'),
            'version': data.get('version', 'Unknown'),
            'total_books': len(data.get('books', {})),
            'total_chapters': 0,
            'total_verses': 0,
            'structural_issues': [],
            'quality_issues': [],
            'missing_data': [],
            'book_statistics': {},
            'summary': {}
        }
        
        # Verify JSON structure
        report['structural_issues'] = self.verify_json_structure(data)
        
        if 'books' not in data:
            report['summary']['status'] = 'FAILED'
            report['summary']['message'] = 'No books data found'
            return report
        
        # Analyze each book
        for book_code, book_data in data['books'].items():
            if book_code not in self.books:
                continue
            
            book_stats = {
                'name': book_data.get('name', 'Unknown'),
                'expected_chapters': self.books[book_code]['chapters'],
                'actual_chapters': len(book_data.get('chapters', {})),
                'total_verses': 0,
                'chapter_issues': {},
                'missing_chapters': []
            }
            
            expected_chapters = self.books[book_code]['chapters']
            
            # Check for missing chapters
            for ch in range(1, expected_chapters + 1):
                if str(ch) not in book_data.get('chapters', {}):
                    book_stats['missing_chapters'].append(ch)
                    report['missing_data'].append(f"{book_code} chapter {ch}")
            
            # Analyze existing chapters
            for chapter_num, verses in book_data.get('chapters', {}).items():
                chapter_verses = len(verses)
                book_stats['total_verses'] += chapter_verses
                
                # Verify chapter quality
                try:
                    ch_num = int(chapter_num)
                    quality_issues = self.verify_chapter_quality(book_code, ch_num, verses)
                    if quality_issues:
                        book_stats['chapter_issues'][chapter_num] = quality_issues
                        for issue in quality_issues:
                            report['quality_issues'].append(f"{book_code} {chapter_num}: {issue}")
                except ValueError:
                    report['quality_issues'].append(f"{book_code}: invalid chapter number '{chapter_num}'")
            
            report['book_statistics'][book_code] = book_stats
            report['total_chapters'] += book_stats['actual_chapters']
            report['total_verses'] += book_stats['total_verses']
        
        # Generate summary
        total_issues = len(report['structural_issues']) + len(report['quality_issues']) + len(report['missing_data'])
        
        if total_issues == 0:
            report['summary']['status'] = 'EXCELLENT'
            report['summary']['message'] = 'No issues found - high quality download'
        elif total_issues < 10:
            report['summary']['status'] = 'GOOD'
            report['summary']['message'] = f'{total_issues} minor issues found'
        elif total_issues < 50:
            report['summary']['status'] = 'FAIR'
            report['summary']['message'] = f'{total_issues} issues found - may need attention'
        else:
            report['summary']['status'] = 'POOR'
            report['summary']['message'] = f'{total_issues} issues found - significant problems'
        
        return report

    def print_verification_report(self, report: dict):
        """Print a formatted verification report"""
        print("\n" + "=" * 70)
        print("📊 VERIFICATION REPORT")
        print("=" * 70)
        
        # Summary
        status = report['summary']['status']
        status_emoji = {'EXCELLENT': '🟢', 'GOOD': '🟡', 'FAIR': '🟠', 'POOR': '🔴'}.get(status, '⚪')
        
        print(f"\n{status_emoji} STATUS: {status}")
        print(f"📝 {report['summary']['message']}")
        print(f"🕐 Generated: {report['timestamp']}")
        
        # Statistics
        print(f"\n📈 STATISTICS:")
        print(f"  📚 Books: {report['total_books']}")
        print(f"  📖 Chapters: {report['total_chapters']}")
        print(f"  📄 Verses: {report['total_verses']:,}")
        
        # Issues summary
        total_issues = len(report['structural_issues']) + len(report['quality_issues']) + len(report['missing_data'])
        print(f"\n⚠️  ISSUES FOUND: {total_issues}")
        print(f"  🏗️  Structural: {len(report['structural_issues'])}")
        print(f"  🔍 Quality: {len(report['quality_issues'])}")
        print(f"  📭 Missing: {len(report['missing_data'])}")
        
        # Detailed issues (limit output for readability)
        if report['structural_issues']:
            print(f"\n🏗️  STRUCTURAL ISSUES:")
            for issue in report['structural_issues'][:10]:
                print(f"    • {issue}")
            if len(report['structural_issues']) > 10:
                print(f"    ... and {len(report['structural_issues']) - 10} more")
        
        if report['quality_issues']:
            print(f"\n🔍 QUALITY ISSUES:")
            for issue in report['quality_issues'][:10]:
                print(f"    • {issue}")
            if len(report['quality_issues']) > 10:
                print(f"    ... and {len(report['quality_issues']) - 10} more")
        
        if report['missing_data']:
            print(f"\n📭 MISSING DATA:")
            for missing in report['missing_data'][:10]:
                print(f"    • {missing}")
            if len(report['missing_data']) > 10:
                print(f"    ... and {len(report['missing_data']) - 10} more")
        
        print("\n" + "=" * 70)

    def save_verification_report(self, report: dict, filename: str) -> bool:
        """Save verification report as JSON"""
        try:
            report_filename = filename.replace('.json', '_verification_report.json')
            with open(report_filename, 'w', encoding='utf-8') as f:
                json.dump(report, f, ensure_ascii=False, indent=2)
            print(f"📄 Verification report saved: {report_filename}")
            return True
        except Exception as e:
            print(f"❌ Error saving verification report: {e}")
            return False

    def verify_downloaded_file(self, filename: str) -> bool:
        """Verify a previously downloaded JSON file"""
        try:
            print(f"🔍 Verifying file: {filename}")
            
            if not Path(filename).exists():
                print(f"❌ File not found: {filename}")
                return False
            
            with open(filename, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            report = self.generate_verification_report(data)
            self.print_verification_report(report)
            self.save_verification_report(report, filename)
            
            return report['summary']['status'] in ['EXCELLENT', 'GOOD']
            
        except Exception as e:
            print(f"❌ Error verifying file: {e}")
            return False

    def download_bible(self, output_file: str = None, sample_books: list = None, debug: bool = False) -> bool:
        """Download the SRB16 Bible with verification"""
        
        self.debug_mode = debug
        
        if output_file is None:
            output_file = "svenska_reformationsbibeln_srb16.json"
            
        # For testing, allow downloading just a few books
        books_to_download = sample_books if sample_books else self.books.keys()
        
        print(f"🔥 Starting download of {self.version_name} ({self.version_code})")
        print(f"📚 Books to download: {len(books_to_download)}")
        if sample_books:
            print(f"📝 Sample mode - downloading: {', '.join(sample_books)}")
        if debug:
            print("🐛 Debug mode enabled")
        print("=" * 70)
        
        bible_data = {
            'version': self.version_code,
            'version_name': self.version_name,
            'version_id': self.version_id,
            'language': 'sv',
            'language_name': 'Svenska',
            'books': {}
        }
        
        total_chapters = sum(self.books[book]['chapters'] for book in books_to_download)
        completed_chapters = 0
        
        for book_code in books_to_download:
            book_info = self.books[book_code]
            print(f"\n📚 {book_info['name']} ({book_code}) - {book_info['chapters']} chapters")
            
            book_data = {
                'code': book_code,
                'name': book_info['name'],
                'swedish_name': book_info['swedish'],
                'chapters': {}
            }
            
            for chapter_num in range(1, book_info['chapters'] + 1):
                chapter_data = self.fetch_chapter(book_code, chapter_num)
                
                if chapter_data and chapter_data['verses']:
                    book_data['chapters'][str(chapter_num)] = chapter_data['verses']
                else:
                    print(f"    ⚠️  No data for {book_code} {chapter_num}")
                
                completed_chapters += 1
                progress = (completed_chapters / total_chapters) * 100
                
                if completed_chapters % 10 == 0 or chapter_num == book_info['chapters']:
                    print(f"    📊 Progress: {progress:.1f}% ({completed_chapters}/{total_chapters})")
                
                # Be respectful - wait between requests
                time.sleep(0.8)  # 800ms delay
            
            bible_data['books'][book_code] = book_data
            
            # Save progress after each book
            temp_file = f"temp_{output_file}"
            self.save_json(bible_data, temp_file)
            print(f"    💾 Progress saved to {temp_file}")
        
        # Final save
        success = self.save_json(bible_data, output_file)
        
        if success:
            print(f"\n🎉 Download completed successfully!")
            print(f"📁 File: {output_file}")
            print(f"📊 Books: {len(bible_data['books'])}")
            
            # Count total verses
            total_verses = sum(
                len(chapter_verses) 
                for book in bible_data['books'].values() 
                for chapter_verses in book['chapters'].values()
            )
            print(f"📖 Total verses: {total_verses:,}")
            
            # Auto-verify the downloaded file
            print(f"\n🔍 Auto-verifying download quality...")
            report = self.generate_verification_report(bible_data)
            self.print_verification_report(report)
            self.save_verification_report(report, output_file)
            
            # Clean up temp file
            temp_file = Path(f"temp_{output_file}")
            if temp_file.exists():
                temp_file.unlink()
                
        return success

    def save_json(self, data: dict, filename: str) -> bool:
        """Save data as JSON"""
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            return True
        except Exception as e:
            print(f"❌ Error saving {filename}: {e}")
            return False

def main():
    """Main function with options including verification and debug mode"""
    print("🇸🇪 Svenska Reformationsbibeln (SRB16) Downloader - Fixed Version")
    print("=" * 70)
    
    downloader = SRB16Downloader()
    
    # Ask user for action
    print("\nChoose action:")
    print("1. Download complete Bible (66 books) - Takes ~1 hour")
    print("2. Download New Testament only (27 books) - Takes ~20 minutes")  
    print("3. Download sample (5 books) for testing - Takes ~5 minutes")
    print("4. Download sample with debug mode - For troubleshooting")
    print("5. Verify existing JSON file")
    
    while True:
        choice = input("\nEnter choice (1-5): ").strip()
        
        if choice == "1":
            # Full Bible
            success = downloader.download_bible()
            break
        elif choice == "2":
            # New Testament only
            nt_books = ['MAT', 'MRK', 'LUK', 'JHN', 'ACT', 'ROM', '1CO', '2CO', 
                       'GAL', 'EPH', 'PHP', 'COL', '1TH', '2TH', '1TI', '2TI', 
                       'TIT', 'PHM', 'HEB', 'JAS', '1PE', '2PE', '1JN', '2JN', 
                       '3JN', 'JUD', 'REV']
            success = downloader.download_bible("srb16_new_testament.json", nt_books)
            break
        elif choice == "3":
            # Sample books
            sample_books = ['MAT', 'JHN', 'ROM', 'EPH', 'REV']
            success = downloader.download_bible("srb16_sample.json", sample_books)
            break
        elif choice == "4":
            # Sample with debug
            sample_books = ['MAT']  # Just Matthew for debugging
            success = downloader.download_bible("srb16_debug.json", sample_books, debug=True)
            break
        elif choice == "5":
            # Verify existing file
            filename = input("Enter JSON filename to verify: ").strip()
            if not filename:
                filename = "svenska_reformationsbibeln_srb16.json"
            success = downloader.verify_downloaded_file(filename)
            break
        else:
            print("Invalid choice. Please enter 1-5.")
    
    if success:
        print("\n🎉 Ready to use in your spotlight search app!")
    else:
        print("\n💔 Operation failed. Check the verification report for details.")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⏹️  Operation interrupted by user.")
    except Exception as e:
        print(f"\n💥 Error: {e}")
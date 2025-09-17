import requests
from bs4 import BeautifulSoup
import json
import time
import re
from urllib.parse import urljoin, parse_qs, urlparse
import html

class BibelQAScraper:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'sv-SE,sv;q=0.8,en-US;q=0.5,en;q=0.3',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
        })
        self.base_url = "https://bibel.se"
        
    def get_main_page(self, url="https://bibel.se/QandA.php?sel=0&qtype=other&origin=homepage"):
        """Get the main Q&A page"""
        try:
            print(f"Fetching main page: {url}")
            response = self.session.get(url, timeout=15)
            response.raise_for_status()
            response.encoding = 'utf-8'
            return BeautifulSoup(response.content, 'html.parser')
        except Exception as e:
            print(f"Error fetching main page: {e}")
            return None
    
    def extract_question_links(self, soup):
        """Extract all question links from the main page"""
        question_links = []
        
        links = soup.find_all('a', href=lambda href: href and 'QandA.php' in href)
        
        for link in links:
            href = link.get('href')
            text = link.get_text(strip=True)
            
            if not text or len(text) < 10:
                continue
                
            parsed_url = urlparse(href)
            query_params = parse_qs(parsed_url.query)
            
            sel_id = query_params.get('sel', ['0'])[0]
            qtype = query_params.get('qtype', ['other'])[0]
            
            if sel_id == '0':
                continue
                
            question_links.append({
                'id': sel_id,
                'type': qtype,
                'question': text,
                'href': href,
                'full_url': urljoin(self.base_url, href)
            })
        
        return question_links
    
    def get_question_answer(self, question_data):
        """Get the full question and answer content"""
        try:
            print(f"Fetching Q&A {question_data['id']}: {question_data['question'][:50]}...")
            
            response = self.session.get(question_data['full_url'], timeout=15)
            response.raise_for_status()
            response.encoding = 'utf-8'
            
            soup = BeautifulSoup(response.content, 'html.parser')
            content = self.extract_and_format_content(soup)
            
            if content and content.get('question_content') and content.get('answer_content'):
                question_data.update(content)
            else:
                question_data['question_content'] = question_data['question']
                question_data['answer_content'] = "Innehållet kunde inte extraheras korrekt."
            
            return question_data
            
        except Exception as e:
            print(f"Error fetching Q&A {question_data['id']}: {e}")
            question_data['error'] = str(e)
            question_data['question_content'] = question_data['question']
            question_data['answer_content'] = f"Fel vid hämtning: {e}"
            return question_data
    
    def extract_and_format_content(self, soup):
        """Extract ALL content and format it beautifully"""
        
        # Remove unwanted elements but keep the structure
        for unwanted in soup.find_all(['script', 'style', 'nav', 'footer', 'header']):
            unwanted.decompose()
        
        # Find the main content area
        content_area = self.find_main_content_area(soup)
        if not content_area:
            return None
        
        # Extract and format question
        question = self.extract_formatted_question(content_area)
        
        # Extract ALL remaining content as answer (comprehensive approach)
        answer = self.extract_all_formatted_content(content_area, question)
        
        if question and answer:
            return {
                'question_content': question,
                'answer_content': answer
            }
        
        # Fallback: if no clear question found, treat everything as content
        if not question:
            all_content = self.extract_all_formatted_content(content_area, "")
            if all_content:
                # Try to split into question and answer based on content
                lines = all_content.split('\n\n')
                if len(lines) >= 2:
                    question = lines[0]
                    answer = '\n\n'.join(lines[1:])
                else:
                    question = "Fråga inte tydligt identifierad"
                    answer = all_content
                
                return {
                    'question_content': question,
                    'answer_content': answer
                }
        
        return None
    
    def find_main_content_area(self, soup):
        """Find the main content area with intelligent detection"""
        
        # Try different strategies to find content
        candidates = []
        
        # Strategy 1: Look for tables with substantial content
        tables = soup.find_all('table')
        for table in tables:
            text_length = len(table.get_text(strip=True))
            if text_length > 300:
                candidates.append(('table', text_length, table))
        
        # Strategy 2: Look for divs with content classes
        content_divs = soup.find_all('div', class_=re.compile(r'content|main|body|newspaper'))
        for div in content_divs:
            text_length = len(div.get_text(strip=True))
            if text_length > 100:
                candidates.append(('div', text_length, div))
        
        # Strategy 3: Look for any element with substantial content
        all_containers = soup.find_all(['article', 'section', 'main', 'td'])
        for container in all_containers:
            text_length = len(container.get_text(strip=True))
            if text_length > 300:
                candidates.append(('container', text_length, container))
        
        # Return the element with the most content
        if candidates:
            candidates.sort(key=lambda x: x[1], reverse=True)
            return candidates[0][2]
        
        return soup.find('body')
    
    def extract_formatted_question(self, content_area):
        """Extract and format the question beautifully"""
        
        # Look for question in headers
        question_candidates = []
        
        # Check h1-h6 tags
        for level in range(1, 7):
            headers = content_area.find_all(f'h{level}')
            for header in headers:
                text = self.preserve_formatting(header)
                if len(text.strip()) > 20:
                    question_candidates.append(text)
        
        # If no headers, look for italic text in the beginning (common pattern)
        if not question_candidates:
            italic_elements = content_area.find_all(['i', 'em'])[:3]  # Check first 3
            for elem in italic_elements:
                text = self.preserve_formatting(elem)
                if len(text.strip()) > 20:
                    question_candidates.append(text)
        
        # Return the best question candidate
        if question_candidates:
            # Choose the longest one, likely to be the most complete
            return max(question_candidates, key=len)
        
        return ""
    
    def extract_all_formatted_content(self, content_area, question_text):
        """Extract ALL content from the area and format it beautifully"""
        
        # Create a copy to work with so we don't modify the original
        content_copy = BeautifulSoup(str(content_area), 'html.parser')
        
        # Remove the question elements to avoid duplication (only if we found a clear question)
        if question_text and len(question_text.strip()) > 20:
            for header in content_copy.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']):
                if question_text.strip() in header.get_text().strip():
                    header.decompose()
        
        # Extract ALL text content with formatting preserved
        all_content_sections = []
        
        # Get all meaningful elements in document order
        all_elements = content_copy.find_all(['p', 'div', 'span', 'b', 'strong', 'i', 'em', 'br', 'hr', 'ul', 'ol', 'li', 'blockquote', 'td'])
        
        # Process each element and preserve its formatting
        for element in all_elements:
            # Skip if this element is contained within another element we'll process
            if element.find_parent(['p', 'div'], recursive=False) and element.name in ['span', 'b', 'strong', 'i', 'em']:
                continue
                
            formatted_text = self.preserve_formatting(element)
            if formatted_text and formatted_text.strip():
                all_content_sections.append(formatted_text)
        
        # If we didn't get much from structured elements, get all text
        if not all_content_sections or len(' '.join(all_content_sections).strip()) < 100:
            # Fallback: get all text content with basic structure preservation
            full_text = self.preserve_formatting(content_copy)
            if full_text and full_text.strip():
                all_content_sections = [full_text]
        
        # Combine all sections
        if all_content_sections:
            # Remove duplicates while preserving order
            unique_sections = []
            seen_content = set()
            
            for section in all_content_sections:
                section_clean = re.sub(r'\s+', ' ', section.strip().lower())
                if section_clean and section_clean not in seen_content and len(section_clean) > 10:
                    seen_content.add(section_clean)
                    unique_sections.append(section.strip())
            
            if unique_sections:
                full_content = self.combine_sections(unique_sections)
                return full_content
        
        return ""
    
    def preserve_formatting(self, element):
        """Preserve natural formatting and structure of ALL text"""
        
        if not element:
            return ""
        
        # Handle text nodes directly
        if isinstance(element, str):
            return self.clean_and_beautify_text(element)
        
        # For NavigableString (text content)
        if hasattr(element, 'string') and element.string:
            return self.clean_and_beautify_text(element.string)
        
        # Handle different element types appropriately - capture EVERYTHING
        formatted_parts = []
        
        # Get all content including text nodes and nested elements
        for child in element.descendants:
            if hasattr(child, 'name'):  # It's a tag
                if child.name in ['br']:
                    formatted_parts.append('\n')
                elif child.name in ['hr']:
                    formatted_parts.append('\n' + '─' * 50 + '\n')
                elif child.name in ['p', 'div'] and child.parent == element:
                    # Only process if direct child to avoid duplication
                    child_text = child.get_text()
                    if child_text.strip():
                        formatted_parts.append(f"\n{child_text.strip()}\n")
            else:  # It's text content
                text = str(child).strip()
                if text and len(text) > 1:  # Ignore single characters and whitespace
                    formatted_parts.append(text + ' ')
        
        # If we didn't capture much, get all text directly
        if not formatted_parts or len(''.join(formatted_parts).strip()) < 20:
            direct_text = element.get_text()
            if direct_text and direct_text.strip():
                return self.clean_and_beautify_text(direct_text)
        
        # Join and clean up the result
        if formatted_parts:
            result = ''.join(formatted_parts)
            return self.clean_and_beautify_text(result)
        
        return ""
    
    def get_element_text(self, element):
        """Get text from element while preserving some structure"""
        if not element:
            return ""
        
        # For simple elements, just get the text
        if element.name in ['span', 'a']:
            return element.get_text()
        
        # For block elements, preserve line breaks
        text_parts = []
        for child in element.children:
            if hasattr(child, 'name'):
                if child.name == 'br':
                    text_parts.append('\n')
                else:
                    text_parts.append(child.get_text())
            else:
                text_parts.append(str(child))
        
        return ''.join(text_parts)
    
    def combine_sections(self, sections):
        """Intelligently combine sections with proper spacing"""
        
        if not sections:
            return ""
        
        combined_parts = []
        
        for i, section in enumerate(sections):
            cleaned_section = section.strip()
            if not cleaned_section:
                continue
            
            # Add appropriate spacing between sections
            if i > 0 and combined_parts:
                # Check if we need a paragraph break
                if not combined_parts[-1].endswith('\n\n'):
                    combined_parts.append('\n\n')
            
            combined_parts.append(cleaned_section)
        
        result = ''.join(combined_parts)
        return self.clean_and_beautify_text(result)
    
    def clean_and_beautify_text(self, text):
        """Clean text while preserving intentional formatting"""
        
        if not text:
            return ""
        
        # Decode HTML entities
        text = html.unescape(text)
        
        # Fix encoding issues
        encoding_fixes = {
            'â€‹': '',      # Zero-width space
            'â€"': '–',     # En dash  
            'â€™': "'",     # Right single quotation
            'â€œ': '"',     # Left double quotation
            'â€': '"',      # Right double quotation
            'Ã¥': 'å',      # Swedish å
            'Ã¤': 'ä',      # Swedish ä  
            'Ã¶': 'ö',      # Swedish ö
            'Ã…': 'Å',      # Swedish Å
            'Ã„': 'Ä',      # Swedish Ä
            'Ã–': 'Ö',      # Swedish Ö
        }
        
        for wrong, correct in encoding_fixes.items():
            text = text.replace(wrong, correct)
        
        # Normalize excessive whitespace but preserve intentional line breaks
        # Replace multiple spaces with single space
        text = re.sub(r'[ \t]+', ' ', text)
        
        # Preserve double line breaks (paragraph separators)
        # But reduce triple+ line breaks to double
        text = re.sub(r'\n\s*\n\s*\n+', '\n\n', text)
        
        # Clean up line breaks at start and end
        text = text.strip()
        
        # Ensure proper spacing around formatting marks
        text = re.sub(r'\*\*([^*]+)\*\*', r'**\1**', text)
        text = re.sub(r'\*([^*]+)\*', r'*\1*', text)
        
        return text
    
    def scrape_all_questions(self, max_questions=None):
        """Scrape all questions and answers with beautiful formatting"""
        
        soup = self.get_main_page()
        if not soup:
            print("Could not fetch main page")
            return []
        
        question_links = self.extract_question_links(soup)
        print(f"Found {len(question_links)} question links")
        
        if not question_links:
            print("No question links found")
            return []
        
        if max_questions:
            question_links = question_links[:max_questions]
            print(f"Processing first {max_questions} questions")
        
        results = []
        
        for i, question_data in enumerate(question_links, 1):
            print(f"\nProcessing {i}/{len(question_links)}")
            
            complete_qa = self.get_question_answer(question_data)
            results.append(complete_qa)
            
            # Show preview of extracted content
            if complete_qa.get('question_content') and complete_qa.get('answer_content'):
                print(f"  ✓ Successfully extracted content")
                print(f"    Question: {complete_qa['question_content'][:100]}...")
                print(f"    Answer: {complete_qa['answer_content'][:150]}...")
            else:
                print(f"  ✗ Content extraction incomplete")
            
            time.sleep(2)
        
        return results
    
    def save_formatted_content(self, data, filename='bibel_qa_formatted.json'):
        """Save beautifully formatted data to JSON"""
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            print(f"\nFormatted data saved to {filename}")
            return True
        except Exception as e:
            print(f"Error saving formatted data: {e}")
            return False
    
    def save_as_markdown(self, data, filename='bibel_qa.md'):
        """Save as readable Markdown file"""
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                f.write("# Bibel.se Frågor och Svar\n\n")
                f.write("*Extraherat innehåll från bibel.se*\n\n")
                f.write("---\n\n")
                
                for i, qa in enumerate(data, 1):
                    if qa.get('question_content') and qa.get('answer_content'):
                        f.write(f"## Fråga {i} (ID: {qa['id']})\n\n")
                        f.write(f"**Kategori:** {qa['type']}\n\n")
                        f.write(f"### Fråga:\n{qa['question_content']}\n\n")
                        f.write(f"### Svar:\n{qa['answer_content']}\n\n")
                        f.write("---\n\n")
            
            print(f"Markdown version saved to {filename}")
            return True
        except Exception as e:
            print(f"Error saving markdown file: {e}")
            return False
    
    def preview_formatting(self, qa_item):
        """Preview the formatting of a single Q&A item"""
        print("\n" + "="*80)
        print(f"PREVIEW - Question ID: {qa_item['id']}")
        print("="*80)
        
        print(f"\nKATEGORI: {qa_item['type']}")
        print(f"URL: {qa_item['full_url']}")
        
        print("\nFRÅGA:")
        print("-" * 40)
        print(qa_item.get('question_content', 'Ingen fråga extraherad'))
        
        print("\nSVAR:")
        print("-" * 40)
        print(qa_item.get('answer_content', 'Inget svar extraherat'))
        
        print("\n" + "="*80 + "\n")

def main():
    scraper = BibelQAScraper()
    
    print("=== Bibel.se Q&A Scraper - Beautiful Formatting ===")
    print("Fokus på vacker formatering och bevarad struktur\n")
    
    max_questions = input("Antal frågor att bearbeta (eller Enter för alla): ").strip()
    max_questions = int(max_questions) if max_questions.isdigit() else None
    
    qa_data = scraper.scrape_all_questions(max_questions)
    
    if qa_data:
        print(f"\n=== RESULTAT ===")
        print(f"Totalt bearbetade frågor: {len(qa_data)}")
        
        # Save in different formats
        scraper.save_formatted_content(qa_data)
        scraper.save_as_markdown(qa_data)
        
        # Preview first successful extraction
        successful_items = [item for item in qa_data 
                          if item.get('question_content') and item.get('answer_content')]
        
        if successful_items:
            print(f"\nFramgångsrikt extraherade: {len(successful_items)}")
            
            preview = input("\nVisa förhandsvisning av första frågan? (y/n): ").strip().lower()
            if preview == 'y':
                scraper.preview_formatting(successful_items[0])
        else:
            print("Inga framgångsrika extraheringar att visa")
    else:
        print("Ingen data kunde hämtas")

if __name__ == "__main__":
    main()
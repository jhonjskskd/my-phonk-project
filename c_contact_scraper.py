import requests
from bs4 import BeautifulSoup
import re

class ContactScraper:
    def __init__(self):
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9"
        }
        self.email_regex = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'

    def crawl_site_source(self, site_url):
        """Crawls HTML data deeply to uncover hidden communication variables and pixel data."""
        extracted_data = {"email": "Not Found", "whatsapp": "Not Found", "has_pixel": "No"}
        
        if not site_url or site_url == "Not Found" or not site_url.startswith("http"):
            return extracted_data

        try:
            # Short timeout window keeps Vercel from lingering on unresponsive domains
            response = requests.get(site_url, headers=self.headers, timeout=6)
            html_content = response.text
            soup = BeautifulSoup(html_content, "html.parser")
            lower_html = html_content.lower()

            # 1. PIXEL ANALYSIS: Verify if tracking scripts exist
            if "fbevents.js" in lower_html or "connect.facebook.net" in lower_html or "fbq(" in lower_html:
                extracted_data["has_pixel"] = "Yes"

            # 2. EMAIL HARVEST: Isolate clean email addresses from raw text
            all_emails = re.findall(self.email_regex, html_content)
            if all_emails:
                clean_emails = [
                    email for email in all_emails 
                    if not email.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', 'email.com'))
                ]
                if clean_emails:
                    extracted_data["email"] = clean_emails[0]

            # 3. WHATSAPP DETECT: Isolate direct chat links
            for anchor in soup.find_all("a", href=True):
                href = anchor["href"].lower().strip()
                if "wa.me/" in href or "api.whatsapp.com/send" in href or "whatsapp.com/biz/" in href:
                    phone_match = re.search(r'(?:wa\.me|phone=|send\?phone=)([^&?/ \s]+)', href)
                    if phone_match:
                        clean_num = re.sub(r'[^\d]', '', phone_match.group(1))
                        if clean_num:
                            extracted_data["whatsapp"] = f"+{clean_num}"
                            break

        except:
            # Fallback wrapper prevents network dropouts from crashing the execution loop
            pass
            
        return extracted_data


import requests
from bs4 import BeautifulSoup

class UdemyDomainDiscoverer:
    def __init__(self):
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
            "Referer": "https://www.udemy.com/"
        }

    def follow_redirects(self, initial_url):
        """Follows link shorteners to discover the true final destination domain."""
        try:
            response = requests.get(initial_url, headers=self.headers, timeout=5, allow_redirects=True)
            return response.url
        except:
            return initial_url

    def extract_external_assets(self, profile_url):
        """Scans the Udemy instructor bio layout for social links and portfolios."""
        discovered_assets = {
            "personal_website": "Not Found",
            "twitter_url": "Not Found",
            "linkedin_url": "Not Found"
        }
        try:
            response = requests.get(profile_url, headers=self.headers, timeout=10)
            if response.status_code != 200:
                return discovered_assets

            soup = BeautifulSoup(response.text, "html.parser")
            
            # Universal fallback sweep to catch links anywhere in the instructor profile block
            links_container = soup.find("div", class_="instructor-profile--links--") or soup.find("div", class_="main-content-context") or soup
            
            for anchor in links_container.find_all("a", href=True):
                href_raw = anchor["href"].strip()
                href_lower = href_raw.lower()
                
                if "twitter.com" in href_lower or "x.com" in href_lower:
                    discovered_assets["twitter_url"] = href_raw
                elif "linkedin.com" in href_lower:
                    discovered_assets["linkedin_url"] = href_raw
                elif "udemy.com" not in href_lower and "facebook.com" not in href_lower and "youtube.com" not in href_lower:
                    if href_raw.startswith("http"):
                        discovered_assets["personal_website"] = self.follow_redirects(href_raw)
                        
        except:
            pass
            
        return discovered_assets
                                    

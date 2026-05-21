import requests

class SerperLeadEngine:
    def __init__(self):
        self.api_key = "a564e2bd340fc24dbba7be5dc3db199fb1c5cbbf"
        self.url = "https://google.serper.dev/search"
        self.headers = {
            "X-API-KEY": self.api_key,
            "Content-Type": "application/json"
        }

    def discover_premium_leads(self, niche_keyword):
        print(f"📡 Mining leads for: {niche_keyword}")
        
        # Use a broad search to ensure we get results back
        query = f"site:udemy.com/user/ {niche_keyword}"
        payload = {"q": query, "num": 50}
        
        db_batch = []
        try:
            response = requests.post(self.url, headers=self.headers, json=payload, timeout=10)
            if response.status_code == 200:
                results = response.json().get("organic", [])
                
                for result in results:
                    title = result.get("title", "")
                    link = result.get("link", "").split("?")[0]
                    
                    # Basic validation: ensure it's a user profile
                    if "/user/" not in link.lower():
                        continue
                    
                    # Clean the name
                    name = title.split('|')[0].split('-')[0].split('—')[0].strip()
                    
                    # Define lead structure
                    lead = {
                        "instructor_name": name,
                        "primary_course_title": title,
                        "market_niche": niche_keyword,
                        "student_count": 1500,
                        "star_rating": 4.3,
                        "udemy_profile_url": link,
                        "business_email": "Not Found",
                        "whatsapp_number": "Not Found",
                        "has_meta_pixel": "No",
                        "pipeline_status": "PENDING_DISPATCH" # Force the pipeline to process this
                    }
                    db_batch.append(lead)
            
            print(f"✅ Harvested {len(db_batch)} leads.")
            return db_batch
        except Exception as e:
            print(f"Error: {e}")
            return []
            

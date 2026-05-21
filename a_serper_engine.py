import requests

class SerperLeadEngine:
    def __init__(self):
        """Initializes secure validation headers for your high-speed Google search gateway."""
        self.api_key = "a564e2bd340fc24dbba7be5dc3db199fb1c5cbbf"
        self.url = "https://google.serper.dev/search"
        self.headers = {
            "X-API-KEY": self.api_key,
            "Content-Type": "application/json"
        }

    def discover_premium_leads(self, niche_keyword):
        """Uses refined dorking targets to extract 50 striving international targets at once."""
        print(f"📡 Serper Query Fired: Mining high-volume targets for [{niche_keyword}]...")
        
        # Broad-match query to safely fetch profile structures indexed by Google
        query = f"site:udemy.com/user/ {niche_keyword}"
        
        payload = {
            "q": query,
            "num": 50  # Maximized to extract a massive wave of results per trigger
        }
        
        db_batch = []
        try:
            response = requests.post(self.url, headers=self.headers, json=payload, timeout=8)
            
            if response.status_code != 200:
                print(f"⚠️ Serper gateway error. Status code: {response.status_code}")
                return db_batch
                
            search_results = response.json().get("organic", [])
            
            for result in search_results:
                title_text = result.get("title", "")
                link_url = result.get("link", "").split("?")[0].strip()
                
                # Validation Guard: Must be a true individual profile link
                if "/user/" not in link_url.lower() or "courses" in link_url.lower():
                    continue

                # Isolate clean instructor name by dropping common platform layout clutter
                name = title_text
                for delimiter in ["|", "-", "—", ":"]:
                    if delimiter in name:
                        name = name.split(delimiter)[0]
                name = name.replace("Instructor", "").replace("Online Course", "").strip()
                
                if not name or name.lower() in ["udemy", "user"]:
                    continue

                # 📊 USD STRIVING CREATOR METRICS METADATA (100 to 3,000 range)
                estimated_students = 1650
                estimated_rating = 4.3

                lead_payload = {
                    "instructor_name": name,
                    "primary_course_title": title_text,
                    "market_niche": niche_keyword,
                    "student_count": estimated_students,
                    "star_rating": estimated_rating,
                    "udemy_profile_url": link_url,          # Raw link passed safely to the master array
                    "personal_website": "Not Found",
                    "twitter_url": "Not Found",
                    "linkedin_url": "Not Found",
                    "business_email": "Not Found",
                    "whatsapp_number": "Not Found",
                    "has_meta_pixel": "No",                 # Deficit assumed for high-conversion hooks
                    "pipeline_status": "PENDING_COPYWRITING"
                }
                
                db_batch.append(lead_payload)
                
            print(f"✅ Stage 1 Complete: Harvested {len(db_batch)} striving international leads.")
            
        except Exception as e:
            print(f"❌ Serper Engine Critical Exception: {str(e)}")
            
        return db_batch
            

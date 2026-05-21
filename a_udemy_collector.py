import requests

class UdemyMetricCollector:
    def __init__(self):
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            "Accept": "application/json, text/plain, */*",
            "Accept-Language": "en-US,en;q=0.9",
            "Referer": "https://www.udemy.com/"
        }
        self.api_url = "https://www.udemy.com/api-2.0/courses/"

    def fetch_udemy_pool(self, keyword, page=1):
        params = {
            "search": keyword,
            "page": page,
            "page_size": 10, # Kept light for maximum Vercel execution speed
            "fields[course]": "title,visible_instructors,rating,num_subscribers,url",
            "ordering": "relevance"
        }
        try:
            response = requests.get(self.api_url, headers=self.headers, params=params, timeout=10)
            if response.status_code == 200:
                return response.json().get("results", [])
            return []
        except:
            return []

    def process_raw_batch(self, raw_courses, keyword, current_db):
        existing_urls = {item["udemy_profile_url"] for item in current_db}
        for course in raw_courses:
            instructors = course.get("visible_instructors", [])
            if not instructors:
                continue
            instructor = instructors[0]
            profile_slug = instructor.get("url")
            full_profile_url = f"https://www.udemy.com{profile_slug}"
            
            if full_profile_url in existing_urls:
                continue
                
            current_db.append({
                "instructor_name": instructor.get("display_name"),
                "primary_course_title": course.get("title"),
                "market_niche": keyword,
                "student_count": course.get("num_subscribers", 0),
                "star_rating": round(course.get("rating", 0.0), 2),
                "udemy_profile_url": full_profile_url,
                "personal_website": "Not Found",
                "twitter_url": "Not Found",
                "linkedin_url": "Not Found",
                "business_email": "Not Found",
                "whatsapp_number": "Not Found",
                "has_meta_pixel": "Unknown",
                "pipeline_status": "PENDING_DOMAIN_DISCOVERY"
            })
            existing_urls.add(full_profile_url)
        return current_db, len(raw_courses)
              

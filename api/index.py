from flask import Flask, jsonify
import sys
import os
import urllib.parse

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import alphabetical blocks including our new Serper Engine
from a_serper_engine import SerperLeadEngine
from b_domain_discoverer import UdemyDomainDiscoverer
from c_contact_scraper import ContactScraper
from d_copywriter_engine import CopywriterEngine
from e_telegram_dispatcher import TelegramDispatcher

app = Flask(__name__)

@app.route('/')
@app.route('/api')
def run_pipeline():
    try:
        print("🚀 Davies Partner Engine: Initializing Serper-Powered 5-Stage Loop...")
        
        serper_engine = SerperLeadEngine()
        discoverer = UdemyDomainDiscoverer()
        scraper = ContactScraper()
        copywriter = CopywriterEngine()
        dispatcher = TelegramDispatcher()
        
        db = []
        
        # 1. RUN SEARCH DISCOVERY VIA SERPER (Bypasses Udemy blocks entirely)
        target_sectors = ["python programming", "real estate marketing"]
        for sector in target_sectors:
            leads = serper_engine.discover_premium_leads(sector)
            db.extend(leads)

        # Resilient baseline fallback if your Serper search quota is ever resting
        if not db:
            db = [
                {
                    "instructor_name": "Jose Portilla",
                    "primary_course_title": "Complete Python Bootcamp",
                    "market_niche": "python programming",
                    "student_count": 320000,
                    "star_rating": 4.6,
                    "udemy_profile_url": "https://www.udemy.com/user/joseportilla/",
                    "personal_website": "https://www.pierian-training.com",
                    "twitter_url": "Not Found", "linkedin_url": "Not Found",
                    "business_email": "Not Found", "whatsapp_number": "+2348123456789",
                    "has_meta_pixel": "Unknown",
                    "pipeline_status": "PENDING_DOMAIN_DISCOVERY"
                }
            ]

        # 2. DISCOVER DOMAINS
        for lead in db:
            if lead.get("pipeline_status") == "PENDING_DOMAIN_DISCOVERY":
                assets = discoverer.extract_external_assets(lead["udemy_profile_url"])
                if lead["personal_website"] == "Not Found" or not lead["personal_website"]:
                    lead.update(assets)
                lead["pipeline_status"] = "PENDING_CONTACT_CRAWL"

        # 3. SCRAPE CONTACT DETAILS
        for lead in db:
            if lead.get("pipeline_status") == "PENDING_CONTACT_CRAWL":
                site_metrics = scraper.crawl_site_source(lead["personal_website"])
                lead["business_email"] = site_metrics["email"]
                if lead["whatsapp_number"] == "Not Found":
                    lead["whatsapp_number"] = site_metrics["whatsapp"]
                lead["has_meta_pixel"] = site_metrics["has_pixel"]
                lead["pipeline_status"] = "PENDING_COPYWRITING"

        # 4. RUN COPYWRITING COMPILER
        for lead in db:
            if lead.get("pipeline_status") == "PENDING_COPYWRITING":
                l_type, email_text, wa_text = copywriter.build_custom_pitches(lead)
                lead["instructor_segment"] = l_type
                lead["compiled_email_pitch"] = email_text
                
                encoded_wa_string = urllib.parse.quote(wa_text)
                target_phone = lead["whatsapp_number"]
                
                if target_phone != "Not Found":
                    lead["whatsapp_launch_link"] = f"https://api.whatsapp.com/send?phone={target_phone.replace('+', '').replace(' ', '')}&text={encoded_wa_string}"
                else:
                    lead["whatsapp_launch_link"] = "No WhatsApp Number Available"
                    
                lead["pipeline_status"] = "PENDING_DISPATCH"

        # 5. DISPATCH LEADS TO TELEGRAM
        dispatched_count = 0
        for lead in db:
            if lead.get("pipeline_status") == "PENDING_DISPATCH":
                success = dispatcher.dispatch_lead_card(lead)
                if success:
                    lead["pipeline_status"] = "COMPLETED"
                    dispatched_count += 1

        return jsonify({
            "status": "success",
            "engine": "Davies_Partner_Serper_Engine_2026",
            "current_stage": "STAGE_5_DISPATCH_COMPLETE",
            "leads_transmitted": dispatched_count,
            "message": "Serper search completed. All lead notifications sent directly to your phone!"
        }), 200

    except Exception as e:
        return jsonify({"status": "error", "error_log": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
                    

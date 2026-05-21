import urllib.parse

class CopywriterEngine:
    def __init__(self):
        pass

    def build_custom_pitches(self, lead):
        """Injects metrics into advanced psychological templates based on performance standing."""
        name = lead["instructor_name"]
        topic = lead["market_niche"]
        students = lead["student_count"]
        pixel = lead["has_meta_pixel"]
        
        email_pitch = ""
        whatsapp_pitch = ""

        # --- BUCKET A: THE STRUGGLING CREATOR (Under 2,000 Students) ---
        if students < 2000:
            lead_type = "STRUGGLING"
            
            # Email Script Drafting
            email_pitch = (
                f"Subject: Your {topic} course is a hidden gem (but hidden from Udemy search)\n\n"
                f"Hi {name},\n\n"
                f"I was looking through the {topic} category and came across your course. Your syllabus and "
                f"delivery style are fantastic—easily on par with creators holding 20k+ enrollments. However, I noticed "
                f"you currently have only {students} students enrolled.\n\n"
                f"Here is the harsh reality of Udemy's search matrix: it aggressively buries newer courses without massive review volumes, "
                f"killing your organic traffic. You've built a stellar product; letting it sit waiting for discovery is a losing game.\n\n"
                f"I build automated external lead funnels on LinkedIn and X to locate students actively searching for help with {topic} "
                f"and route them directly to your page via your instructor coupons. This triggers the algorithm into pushing you up the ranks.\n\n"
                f"I've mapped out a quick 3-step blueprint to force outside traffic to your listing this week. Worth a 2-minute look if I send it over?\n\n"
                f"Best,\nDavies | Partner Engine"
            )
            
            # WhatsApp Script Drafting
            whatsapp_pitch = (
                f"Hi {name}, love your course content on Udemy! The production style is excellent, but the search system "
                f"is completely burying you because you have only {students} students. I built a quick 3-step strategy to "
                f"inject outside buyers from X/LinkedIn straight to your course using your instructor coupons. Open to taking a look?"
            )

        # --- BUCKET B: THE ELITE CREATOR (High Enrollment Volume) ---
        else:
            lead_type = "ELITE"
            pixel_notice = ""
            
            if pixel == "No":
                pixel_notice = "your landing page completely lacks a tracking pixel, meaning you lose hot student data daily."
            else:
                pixel_notice = "your social traffic pipelines aren't fully insulated outside of the Udemy environment."

            # Email Script Drafting
            email_pitch = (
                f"Subject: Quick note on your top-tier {topic} course (and the 63% revenue leak)\n\n"
                f"Hi {name},\n\n"
                f"I was analyzing top-performing assets in the {topic} ecosystem and went through your reviews. Brilliant work "
                f"on maintaining your high standing—it's rare to see students explicitly praising your material in 5-star feedback.\n\n"
                f"Because you are leading the market, I did a technical assessment of your off-platform footprint and spotted a major structural leak: "
                f"Right now, {pixel_notice} Worse, by staying entirely within Udemy's closed loop, you give up to 63% of your hard-earned revenue per sale to marketplace commissions.\n\n"
                f"Your top competitors are already establishing independent external pipelines on X and LinkedIn to recapture 100% of their traffic margins.\n\n"
                f"I build automated lead generation engines that capture these high-intent users on social platforms and bring them directly into your proprietary funnels.\n\n"
                f"I've mapped out a quick 3-step strategy to insulate your #1 spot and halt the platform tax. Open to seeing the text breakdown?\n\n"
                f"Best,\nDavies | Partner Engine"
            )
            
            # WhatsApp Script Drafting
            whatsapp_pitch = (
                f"Hi {name}, brilliant work leading the Udemy market for {topic}! I ran a quick assessment on your external layout "
                f"and noticed a massive revenue leak. Udemy is taking up to a 63% cut of your organic sales. I built an independent lead engine "
                f"concept for your course so you can keep 100% of your margins off-platform. Can I drop the 3-step breakdown here?"
            )

        return lead_type, email_pitch, whatsapp_pitch
      

import urllib.parse
import random
import re

class CopywriterEngine:
    def __init__(self):
        """Initializes psychological frameworks and variations to keep pitches unique."""
        # Casual email subject lines to bypass international spam filters
        self.subject_variations = [
            "Quick question regarding your \"{course}\" program",
            "Feedback on your {course} syllabus (+ question)",
            "Strategic bottleneck in your \"{course}\" setup?",
            "Quick note on your {course} student funnel"
        ]
        
        # Conversational text openings for mobile reading flow
        self.wa_openings = [
            "Hi {name}! Loved how you put together the syllabus for your \"{course}\" course on Udemy.",
            "Hey {name}—came across your \"{course}\" course while auditing the {niche} space. Great work on the content structure!",
            "Hi {name}, quick heads up. I was looking through your \"{course}\" course outline. The setup looks solid."
        ]

    def clean_course_title(self, raw_title):
        """Extracts a tight, natural-sounding course topic from noisy, long SEO titles."""
        try:
            # Strip common trailing clutter
            title = raw_title.split('|')[0].split('-')[0].split('—')[0].strip()
            
            # Remove aggressive marketplace keyword-stuffing phrases
            fluff_words = [
                "Complete", "The", "Bootcamp", "Course", "2026", "Masterclass", 
                "Training", "Beginner to Advanced", "Ultimate", "Guide", "For Beginners",
                "Certified", "Professional", "Introduction to", "With Projects"
            ]
            for word in fluff_words:
                title = re.sub(r'\b' + re.escape(word) + r'\b', '', title, flags=re.IGNORECASE)
                
            clean_title = " ".join(title.split())
            return clean_title if len(clean_title) > 3 else "Udemy specialization"
        except:
            return "online course"

    def build_custom_pitches(self, lead):
        """Generates deeply tailored, high-converting USD pitches referencing their exact course product."""
        name = lead["instructor_name"]
        raw_title = lead["primary_course_title"]
        niche = lead["market_niche"]
        students = lead["student_count"]
        pixel = lead["has_meta_pixel"]
        
        # Isolate the exact, naturally cleaned course asset name
        specific_course = self.clean_course_title(raw_title)

        # Dynamic problem identification based on specific tracking deficits
        if pixel == "No":
            defect_analysis = (
                f"your landing framework currently lacks an active Meta tracking pixel. "
                f"This means you are leaking valuable student data daily from hot prospects who click your external links "
                f"but bounce back without buying anything."
            )
        else:
            defect_analysis = (
                f"your entire student acquisition footprint is structurally locked inside Udemy's organic search loops. "
                f"By leaving your traffic channels uninsulated, you're highly exposed to unexpected algorithm adjustments."
            )

        # Choose randomized variations to prevent mass template blocks
        subject_line = random.choice(self.subject_variations).format(course=specific_course)
        wa_start = random.choice(self.wa_openings).format(name=name, course=specific_course, niche=niche)

        # --- PREMIUM HIGH-CONVERTING EMAIL ARCHITECTURE ---
        email_pitch = (
            f"Subject: {subject_line}\n\n"
            f"Hi {name},\n\n"
            f"I was auditing the {niche} ecosystem this week and spent some time going over your curriculum layout for \"{raw_title}\". "
            f"The progression of your lectures is highly intuitive, and it's clear you've built a stellar instructional asset.\n\n"
            f"However, analyzing your configuration from an external marketing perspective, I noticed a severe operational leak: {defect_analysis}\n\n"
            f"Since you already have a verified foundation with around {students:,} students, you've clearly proven market demand. "
            f"But relying exclusively on a closed marketplace means you are heavily subjected to platform rules, while handing over up to 63% of your organic sales to marketplace commissions.\n\n"
            f"I build automated lead generation engines designed specifically for technical creators. We actively track down high-intent clients across LinkedIn and X who are searching for solutions in the {niche} space, and guide them straight to your offers.\n\n"
            f"This gives you direct control over your traffic pipelines, isolates your brand from marketplace platform taxes, and keeps 100% of your margins. I’ve mapped out a quick 3-step acquisition blueprint built explicitly around your \"{specific_course}\" curriculum.\n\n"
            f"Would you be open to reviewing the technical text breakdown over the next couple of days?\n\n"
            f"Best regards,\n"
            f"Davies Demilade\n"
            f"Lead Generation Specialist | @DaviesPartner Solutions"
        )

        # --- PUNCHY, HIGH-CONVERTING WHATSAPP MOBI-SCRIPT ---
        whatsapp_pitch = (
            f"{wa_start} The problem is, relying 100% on Udemy's internal search algorithms means giving up a massive "
            f"chunk of your organic profit margins to marketplace fees. I mapped out a private 3-step client engine to scrape "
            f"high-intent buyers off LinkedIn/X and route them directly into your funnel so you keep 100% of the cash per sale. "
            f"Do you mind if I drop the quick text strategy breakdown right here?"
        )

        return "STRIVING_CREATOR", email_pitch, whatsapp_pitch
                

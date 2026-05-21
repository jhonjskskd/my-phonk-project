import requests

# 🛡️ DAVIES VERIFIED LIVE CONFIGURATION (2026)
BOT_TOKEN = "8673029559:AAF4zFJC80TERVUMTvZ9ieSMWM0K-2vWGTI"
CHAT_ID = "7909543900"

class TelegramDispatcher:
    def __init__(self):
        """Initializes the secure target gateway endpoint for your Telegram bot."""
        self.telegram_url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"

    def dispatch_lead_card(self, lead):
        """Filters, formats, and dispatches international striving creator leads 
        directly to your Telegram channel.
        """
        phone = lead.get("whatsapp_number", "Not Found")
        
        # 🚫 STAGE PANIC GUARD: Instantly drop any lead with a Nigerian (+234) phone layout
        if phone.startswith("+234") or phone.startswith("234"):
            print(f"⏩ Dropping {lead['instructor_name']} - Reason: Domestic Country Code detected.")
            return False

        name = lead["instructor_name"]
        niche = lead["market_niche"].upper()
        title = lead["primary_course_title"]
        students = lead["student_count"]
        rating = lead["star_rating"]
        email = lead["business_email"]
        pixel = lead["has_meta_pixel"]
        wa_link = lead["whatsapp_launch_link"]
        udemy_url = lead["udemy_profile_url"]
        email_pitch = lead.get("compiled_email_pitch", "No email pitch generated.")

        # Dynamic validation indicators for technical audits
        pixel_status = "✅ ACTIVE" if pixel == "Yes" else "❌ MISSING (Pixel Deficit Hook)"

        # HIGH-CONVERTING INTERNATIONAL TARGET LAYOUT
        message = (
            f"🚀 **STRIVING CREATOR FOUND (USD PROSPECT)**\n"
            "━━━━━━━━━━━━━━━━━━━━\n"
            f"👤 **Instructor:** {name}\n"
            f"📚 **Target Niche:** {niche}\n"
            f"📊 **Market Traction:** {students:,} Students | {rating} ⭐\n"
            f"🌐 **Meta Tracking Pixel:** {pixel_status}\n"
            "━━━━━━━━━━━━━━━━━━━━\n"
            f"📧 **Business Email:** `{email}`\n"
            f"📱 **WhatsApp ID:** `{phone if phone != 'Not Found' else 'Searching...'}`\n"
            "━━━━━━━━━━━━━━━━━━━━\n"
            f"🔗 [VIEW UDEMY PROFILE]({udemy_url})\n"
            "━━━━━━━━━━━━━━━━━━━━\n"
        )

        # Append actionable launch triggers based on contact availability
        if "http" in wa_link and phone != "Not Found" and phone != "1234567890":
            message += f"📥 [LAUNCH PITCH ON WHATSAPP]({wa_link})\n"
        else:
            # Alternate international action link if no phone is scraped yet
            message += f"📥 [PITCH DIRECTLY ON PROFILE]({udemy_url})\n"

        message += (
            "━━━━━━━━━━━━━━━━━━━━\n"
            "🛡️ *Davies | @DaviesPartner Engine 2026*"
        )

        payload = {
            "chat_id": CHAT_ID,
            "text": message,
            "parse_mode": "Markdown",
            "disable_web_page_preview": True  # Keeps layout clean without ugly preview boxes
        }

        try:
            response = requests.post(self.telegram_url, json=payload, timeout=8)
            if response.status_code == 200:
                print(f"📡 Lead card for [{name}] successfully transmitted to your phone.")
                return True
            else:
                print(f"⚠️ Telegram API rejected payload with status code: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Dispatch Sub-Engine Network Error: {str(e)}")
            return False
    

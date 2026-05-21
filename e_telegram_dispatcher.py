import requests

# 🛡️ 2026 DAVIES VERIFIED LIVE CONFIGURATION 
BOT_TOKEN = "8673029559:AAF4zFJC80TERVUMTvZ9ieSMWM0K-2vWGTI"
CHAT_ID = "7909543900"

class TelegramDispatcher:
    def __init__(self):
        """Initializes the secure target gateway endpoint for your Telegram bot."""
        self.telegram_url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"

    def dispatch_lead_card(self, lead):
        """Formats the collected lead dossier parameters into a premium Markdown layout 
        and dispatches it directly to your phone.
        """
        name = lead["instructor_name"]
        niche = lead["market_niche"].upper()
        title = lead["primary_course_title"]
        students = lead["student_count"]
        rating = lead["star_rating"]
        email = lead["business_email"]
        phone = lead["whatsapp_number"]
        pixel = lead["has_meta_pixel"]
        segment = lead["instructor_segment"]
        wa_link = lead["whatsapp_launch_link"]

        # Dynamic validation indicators for technical audits
        pixel_status = "✅ ACTIVE" if pixel == "Yes" else "❌ MISSING (Pixel Deficit Hook)"

        # PREMIUM DISPATCH AGENCY BRANDING LAYOUT
        message = (
            f"💎 **{segment} LEADER FOUND**\n"
            "━━━━━━━━━━━━━━━━━━━━\n"
            f"👤 **Instructor Name:** {name}\n"
            f"📚 **Target Niche:** {niche}\n"
            f"📊 **Market Traction:** {students:,} Students | {rating} ⭐\n"
            f"🌐 **Meta Tracking Pixel:** {pixel_status}\n"
            "━━━━━━━━━━━━━━━━━━━━\n"
            f"📧 **Business Email:** `{email}`\n"
            f"📱 **WhatsApp Number:** `{phone}`\n"
            "━━━━━━━━━━━━━━━━━━━━\n"
            f"📝 **Primary Course Title:**\n\"{title[:75]}...\"\n"
            "━━━━━━━━━━━━━━━━━━━━\n"
        )

        # Append actionable launch triggers if links are active
        if "http" in wa_link:
            message += f"📥 [LAUNCH PITCH ON WHATSAPP]({wa_link})\n"
        else:
            message += "📥 *Action Protocol:* No direct WhatsApp connection generated.\n"

        message += (
            "━━━━━━━━━━━━━━━━━━━━\n"
            "🛡️ *Davies | @DaviesPartner Engine 2026*"
        )

        payload = {
            "chat_id": CHAT_ID,
            "text": message,
            "parse_mode": "Markdown",
            "disable_web_page_preview": True # Keeps layout clean without ugly preview boxes
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

# Local sandbox verification execution code
if __name__ == "__main__":
    dispatcher = TelegramDispatcher()
    mock_lead = {
        "instructor_name": "Jose Portilla",
        "market_niche": "python programming",
        "primary_course_title": "Complete Python Bootcamp",
        "student_count": 320000,
        "star_rating": 4.6,
        "business_email": "Not Found",
        "whatsapp_number": "+2348123456789",
        "has_meta_pixel": "No",
        "instructor_segment": "ELITE",
        "whatsapp_launch_link": "https://api.whatsapp.com/send?phone=2348123456789&text=Test"
    }
    dispatcher.dispatch_lead_card(mock_lead)
    

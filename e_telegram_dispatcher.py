import requests

# --- 2026 DAVIES VERIFIED CONFIGURATION ---
BOT_TOKEN = "8673029559:AAF4zFJC80TERVUMTvZ9ieSMWM0K-2vWGTI"
CHAT_ID = "7909543900"

class TelegramDispatcher:
    def __init__(self):
        self.telegram_url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"

    def dispatch_lead_card(self, lead):
        """Constructs an agency-style layout and pushes it to your Telegram."""
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

        # Dynamic status markers
        pixel_status = "✅ ACTIVE" if pixel == "Yes" else "❌ MISSING (Pixel Deficit Hook)"

        # PREMIUM AGENCY BRANDED LAYOUT
        message = (
            f"💎 **{segment} LEADER FOUND**\n"
            "━━━━━━━━━━━━━━━━━━━━\n"
            f"👤 **Instructor:** {name}\n"
            f"📚 **Niche:** {niche}\n"
            f"📊 **Metrics:** {students:,} Students | {rating} ⭐\n"
            f"🌐 **Website Pixel:** {pixel_status}\n"
            "━━━━━━━━━━━━━━━━━━━━\n"
            f"📧 **Business Email:** `{email}`\n"
            f"📱 **WhatsApp ID:** `{phone}`\n"
            "━━━━━━━━━━━━━━━━━━━━\n"
            f"📝 **Primary Course:** \"{title[:60]}...\"\n"
            "━━━━━━━━━━━━━━━━━━━━\n"
        )

        if "http" in wa_link:
            message += f"📥 [LAUNCH PITCH ON WHATSAPP]({wa_link})\n"
        else:
            message += "📥 *WhatsApp:* No direct link available.\n"

        message += (
            "━━━━━━━━━━━━━━━━━━━━\n"
            "🛡️ *Davies | Partner Lead Engine 2026*"
        )

        payload = {
            "chat_id": CHAT_ID,
            "text": message,
            "parse_mode": "Markdown",
            "disable_web_page_preview": True
        }

        try:
            response = requests.post(self.telegram_url, json=payload, timeout=8)
            return response.status_code == 200
        except:
            return False

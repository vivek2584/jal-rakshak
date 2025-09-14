# Telegram Bot API configuration
# Get your bot token from @BotFather on Telegram
TELEGRAM_BOT_TOKEN = "8283985515:AAFEsXWeBiK9eNjCTDdsQhzv5VkH3GhrKlk"

# List of Telegram chat IDs to send alerts to
# To get chat IDs: send a message to your bot, then call https://api.telegram.org/bot<TOKEN>/getUpdates
TELEGRAM_CHAT_IDS = [
    "1129126139",
    "1456097608"
]

# Alert templates for different scenarios
# 🚨 To add a new alert type, add a new key-value pair below
ALERT_TEMPLATES = {
    "flood": "🚨 Flood Alert! Please move to higher ground immediately.",
    "contamination": "🔥 Contamination Alert! Evacuate the area immediately.",
    "thunderstorm": "⛈️ Thunderstorm Warning! Stay indoors and avoid open areas.",
    "lockdown": "🔒 Lockdown Alert! Please stay where you are and await further instructions.",
    "earthquake": "🌎 Earthquake Alert! Drop, Cover, and Hold On!"
}

# To add new alert templates:
# - Add a new entry to ALERT_TEMPLATES above, e.g.,
#   "tornado": "🌪️ Tornado Alert! Seek shelter immediately."

# List of recipient phone numbers (in E.164 format)
# Note: Phone numbers must be added to your WhatsApp Business account's allowed recipient list
RECIPIENT_PHONE_NUMBERS = [
    "+919996178315"
]

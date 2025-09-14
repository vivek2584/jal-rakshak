import requests
from config import TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_IDS, ALERT_TEMPLATES
from database import fetch_all_phone_numbers

# Telegram Bot API endpoint
TELEGRAM_API_URL = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"


def send_telegram_message(chat_id, message):
    """
    Send a Telegram message using the Bot API.
    Args:
        chat_id (str): Recipient's chat ID
        message (str): Message text to send
    Returns:
        bool: True if sent successfully, False otherwise
    """
    data = {
        "chat_id": chat_id,
        "text": message,
        "parse_mode": "HTML"  # Allows basic HTML formatting
    }
    
    try:
        response = requests.post(TELEGRAM_API_URL, data=data, timeout=10)
        if response.status_code == 200:
            result = response.json()
            if result.get("ok"):
                print(f"[SUCCESS] Telegram message sent to {chat_id}")
                return True
            else:
                print(f"[FAIL] Telegram API error: {result.get('description', 'Unknown error')}")
                return False
        else:
            print(f"[FAIL] HTTP error {response.status_code}: {response.text}")
            return False
    except Exception as e:
        print(f"[ERROR] Exception sending Telegram message to {chat_id}: {e}")
        return False


def broadcast_telegram_alert(alert_type):
    """
    Broadcast an alert to all Telegram contacts.
    Args:
        alert_type (str): Type of alert (must match a key in ALERT_TEMPLATES)
    """
    alert_type = alert_type.lower()
    if alert_type not in ALERT_TEMPLATES:
        print(f"[ERROR] Invalid alert type: '{alert_type}'. Available types: {list(ALERT_TEMPLATES.keys())}")
        return
    
    message = ALERT_TEMPLATES[alert_type]
    chat_ids = TELEGRAM_CHAT_IDS
    
    if not chat_ids:
        print("[WARN] No Telegram chat IDs configured.")
        return
    
    print(f"[INFO] Broadcasting '{alert_type}' alert to {len(chat_ids)} Telegram contacts...")
    for chat_id in chat_ids:
        send_telegram_message(chat_id, message)


def send_custom_telegram_message(message):
    """
    Send a custom message to all configured Telegram chat IDs.
    Args:
        message (str): Custom message to send
    """
    chat_ids = TELEGRAM_CHAT_IDS
    
    if not chat_ids:
        print("[WARN] No Telegram chat IDs configured.")
        return False
    
    success_count = 0
    for chat_id in chat_ids:
        if send_telegram_message(chat_id, message):
            success_count += 1
    
    return success_count > 0


if __name__ == "__main__":
    # Test manual trigger
    broadcast_telegram_alert("flood")

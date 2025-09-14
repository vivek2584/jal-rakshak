# Phone number management (no Supabase, using hardcoded list)
from config import RECIPIENT_PHONE_NUMBERS

def fetch_all_phone_numbers():
    """
    Return the list of recipient phone numbers from config.py.
    """
    return RECIPIENT_PHONE_NUMBERS

# To add or modify phone numbers:
# - Edit the RECIPIENT_PHONE_NUMBERS list in config.py
# - Ensure numbers are in international format (e.g., '+91XXXXXXXXXX')


from pathlib import Path
import os

from dotenv import load_dotenv
from twilio.rest import Client

# Load credentials from Backend/.env
load_dotenv(Path(__file__).resolve().parent / ".env")

sid = os.getenv("TWILIO_ACCOUNT_SID")
token = os.getenv("TWILIO_AUTH_TOKEN")
sender = os.getenv("TWILIO_FROM_NUMBER")

if not all([sid, token, sender]):
    raise SystemExit(
        "Twilio settings are missing. Check Backend/.env"
    )

phone = input(
    "Enter your verified phone number with country code (+91...): "
).strip()

try:
    client = Client(sid, token)

    message = client.messages.create(
        body="sms_internal_alerts",
        from_=sender,
        to=phone,
    )

    print("Message SID:", message.sid)
    print("Initial status:", message.status)

except Exception as error:
    print("SMS sending failed:", error)

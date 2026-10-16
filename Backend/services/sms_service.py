
import os
import re

from dotenv import load_dotenv
from twilio.rest import Client

load_dotenv()


def send_budget_alert(phone_number, estimated_bill, budget):
    """Send an SMS when the estimated monthly bill exceeds the budget."""

    account_sid = os.getenv("TWILIO_ACCOUNT_SID")
    auth_token = os.getenv("TWILIO_AUTH_TOKEN")
    from_number = os.getenv("TWILIO_FROM_NUMBER")

    if not account_sid or not auth_token or not from_number:
        raise RuntimeError(
            "SMS is not configured. Check Twilio credentials in Backend/.env."
        )

    phone_number = phone_number.strip()

    # Require international format, for example +919876543210.
    if not re.fullmatch(r"\+[1-9]\d{7,14}", phone_number):
        raise ValueError(
            "Enter a valid mobile number in international format, such as +919876543210."
        )

    if estimated_bill <= budget:
        return {
            "sent": False,
            "reason": "The estimated monthly bill does not exceed the budget."
        }

    message_body = (
        "Smart Energy Alert: Your estimated monthly electricity bill "
        f"is Rs. {estimated_bill:.2f}, exceeding your budget of "
        f"Rs. {budget:.2f}. Check your energy consumption dashboard."
    )

    client = Client(account_sid, auth_token)

    message = client.messages.create(
        body=message_body,
        from_=from_number,
        to=phone_number,
    )

    return {
        "sent": True,
        "message_sid": message.sid,
        "status": message.status,
    }

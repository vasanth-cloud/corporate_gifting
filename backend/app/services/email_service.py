import logging

logger = logging.getLogger("email_service")
logger.setLevel(logging.INFO)


class EmailService:
    @staticmethod
    def send_order_status_update(recipient_email: str, order_number: str, new_status: str):
        subject = f"Order #{order_number} Update: Status changed to {new_status}"
        body = f"Hello, your corporate gifting order #{order_number} status has been updated to '{new_status}'."
        logger.info(f"[EMAIL DISPATCH] To: {recipient_email} | Subject: {subject} | Body: {body}")
        print(f"📧 [Email Sent] To: {recipient_email} -> Status: {new_status}")
        return True

    @staticmethod
    def send_voucher_code(recipient_email: str, recipient_name: str, code: str, amount: float):
        subject = f"🎁 You have received a Corporate Gift Voucher worth ${amount:.2f}!"
        body = f"Hi {recipient_name},\nUse code {code} at http://localhost:5173/claim-gift to select your reward!"
        logger.info(f"[EMAIL DISPATCH] To: {recipient_email} | Subject: {subject}")
        print(f"🎁 [Voucher Sent] Code: {code} -> {recipient_email}")
        return True

    @staticmethod
    def send_email_with_attachment(recipient_email: str, subject: str, body: str, attachment_path: str = None):
        logger.info(f"[EMAIL DISPATCH] To: {recipient_email} | Subject: {subject} | Attachment: {attachment_path}")
        print(f"📧 [Email Sent with Attachment] To: {recipient_email} | Subject: {subject} | Attachment: {attachment_path}")
        return True
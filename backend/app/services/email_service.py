import smtplib

from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication


class EmailService:

    sender = "avasanth081@gmail.com"
    password = "czxj kmll hixc adlc"

    @staticmethod
    def send_email(to_email: str, subject: str, body: str):

        msg = MIMEText(body)

        msg["Subject"] = subject
        msg["From"] = EmailService.sender
        msg["To"] = to_email

        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(
                EmailService.sender,
                EmailService.password,
            )
            server.sendmail(
                EmailService.sender,
                to_email,
                msg.as_string(),
            )

    @staticmethod
    def send_email_with_attachment(
        to_email: str,
        subject: str,
        body: str,
        file_path: str,
    ):

        message = MIMEMultipart()

        message["From"] = EmailService.sender
        message["To"] = to_email
        message["Subject"] = subject

        message.attach(MIMEText(body, "plain"))

        with open(file_path, "rb") as file:
            attachment = MIMEApplication(file.read(), _subtype="pdf")
            attachment.add_header(
                "Content-Disposition",
                "attachment",
                filename=file_path.split("/")[-1],
            )
            message.attach(attachment)

        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(
                EmailService.sender,
                EmailService.password,
            )
            server.send_message(message)
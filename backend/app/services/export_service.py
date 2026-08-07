from io import BytesIO

from openpyxl import Workbook
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas


class ExportService:

    @staticmethod
    def excel(data, headers):

        wb = Workbook()
        ws = wb.active

        ws.append(headers)

        for row in data:
            ws.append(row)

        stream = BytesIO()
        wb.save(stream)
        stream.seek(0)

        return stream

    @staticmethod
    def pdf(title, data, headers):

        stream = BytesIO()

        pdf = canvas.Canvas(stream, pagesize=letter)

        pdf.setFont("Helvetica-Bold", 16)
        pdf.drawString(50, 760, title)

        y = 730

        pdf.setFont("Helvetica-Bold", 10)

        x = 40

        for h in headers:
            pdf.drawString(x, y, str(h))
            x += 100

        y -= 20

        pdf.setFont("Helvetica", 10)

        for row in data:

            x = 40

            for col in row:
                pdf.drawString(x, y, str(col))
                x += 100

            y -= 20

            if y < 40:
                pdf.showPage()
                y = 760

        pdf.save()

        stream.seek(0)

        return stream
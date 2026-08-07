from sqlalchemy.orm import Session

from app.repositories.report_repository import ReportRepository


class ReportService:

    @staticmethod
    def order_report(db: Session):
        return ReportRepository.order_report(db)

    @staticmethod
    def campaign_report(db: Session):
        return ReportRepository.campaign_report(db)

    @staticmethod
    def employee_report(db: Session):
        return ReportRepository.employee_report(db)

    @staticmethod
    def revenue_report(db: Session):
        return ReportRepository.revenue_report(db)
from decimal import Decimal

from pydantic import BaseModel


class OrderReport(BaseModel):
    total_orders: int
    pending_orders: int
    approved_orders: int
    processing_orders: int
    shipped_orders: int
    delivered_orders: int
    cancelled_orders: int
    total_revenue: Decimal


class CampaignReport(BaseModel):
    total_campaigns: int
    active_campaigns: int
    completed_campaigns: int


class EmployeeReport(BaseModel):
    total_employees: int


class RevenueReport(BaseModel):
    total_revenue: Decimal
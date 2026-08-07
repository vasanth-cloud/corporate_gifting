from pydantic import BaseModel


class DashboardResponse(BaseModel):
    total_companies: int
    total_employees: int
    total_vendors: int
    total_categories: int
    total_gifts: int
    total_campaigns: int
    total_orders: int
    pending_orders: int
    delivered_orders: int
    total_revenue: float
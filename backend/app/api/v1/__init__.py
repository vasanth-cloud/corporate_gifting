from fastapi import APIRouter

from app.api.v1.auth import router as auth_router
from app.api.v1.campaign import router as campaign_router
from app.api.v1.company import router as company_router
from app.api.v1.dashboard import router as dashboard_router
from app.api.v1.employee import router as employee_router
from app.api.v1.export import router as export_router
from app.api.v1.gift import router as gift_router
from app.api.v1.gift_category import router as category_router
from app.api.v1.invoice import router as invoice_router
from app.api.v1.orders import router as order_router
from app.api.v1.reports import router as report_router
from app.api.v1.upload import router as upload_router
from app.api.v1.vendor import router as vendor_router
from app.api.v1.bulk_upload import router as bulk_upload_router
from app.api.v1.payment import router as payment_router
from app.api.v1.voucher import router as voucher_router

api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(company_router)
api_router.include_router(employee_router)
api_router.include_router(vendor_router)
api_router.include_router(category_router)
api_router.include_router(gift_router)
api_router.include_router(campaign_router)
api_router.include_router(order_router)
api_router.include_router(dashboard_router)
api_router.include_router(report_router)
api_router.include_router(export_router)
api_router.include_router(invoice_router)
api_router.include_router(upload_router)
api_router.include_router(bulk_upload_router)
api_router.include_router(payment_router)
api_router.include_router(voucher_router)

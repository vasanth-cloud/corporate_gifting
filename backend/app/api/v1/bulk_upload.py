import csv
import io
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.core.permissions import require_roles
from app.models.user import User, UserRole
from app.models.employee import Employee

router = APIRouter(
    prefix="/employees",
    tags=["Employees Bulk Upload"],
)


@router.post("/bulk-csv")
async def bulk_upload_employees(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.SUPER_ADMIN,
            UserRole.COMPANY_ADMIN,
            UserRole.HR_MANAGER,
        )
    ),
):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are supported.")

    content = await file.read()
    text = content.decode("utf-8-sig")
    reader = csv.DictReader(io.StringIO(text))

    created_count = 0
    errors = []

    for idx, row in enumerate(reader, start=2):
        try:
            emp_code = row.get("employee_code") or f"EMP-{1000 + idx}"
            first_name = row.get("first_name", "").strip()
            last_name = row.get("last_name", "").strip()
            work_email = row.get("work_email", "").strip()
            department = row.get("department", "").strip()
            designation = row.get("designation", "").strip()
            
            raw_comp_id = row.get("company_id")
            company_id = int(raw_comp_id) if raw_comp_id else (current_user.company_id or 1)

            if not first_name or not work_email:
                errors.append(f"Row {idx}: missing first_name or work_email")
                continue

            existing = db.query(Employee).filter(Employee.work_email == work_email).first()
            if existing:
                errors.append(f"Row {idx}: Email {work_email} already exists")
                continue

            employee = Employee(
                employee_code=emp_code,
                first_name=first_name,
                last_name=last_name,
                work_email=work_email,
                department=department,
                designation=designation,
                company_id=company_id,
            )
            db.add(employee)
            created_count += 1
        except Exception as e:
            errors.append(f"Row {idx}: {str(e)}")

    db.commit()

    return {
        "message": f"Successfully imported {created_count} employees.",
        "created_count": created_count,
        "errors": errors,
    }

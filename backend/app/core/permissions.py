from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.models.user import User, UserRole


def require_roles(*roles: UserRole):
    def role_checker(
        current_user: User = Depends(get_current_user),
    ):
        if current_user.role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to perform this action.",
            )

        return current_user

    return role_checker


# Dedicated Role Dependencies
def require_super_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.SUPER_ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access Denied: Requires Super Admin permission.",
        )
    return current_user


def require_company_admin(current_user: User = Depends(get_current_user)):
    if current_user.role not in [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access Denied: Requires Company Admin permission.",
        )
    return current_user


def require_hr_manager(current_user: User = Depends(get_current_user)):
    if current_user.role not in [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.HR_MANAGER]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access Denied: Requires HR Manager permission.",
        )
    return current_user


def require_vendor(current_user: User = Depends(get_current_user)):
    if current_user.role not in [UserRole.SUPER_ADMIN, UserRole.VENDOR]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access Denied: Requires Vendor permission.",
        )
    return current_user


def require_employee(current_user: User = Depends(get_current_user)):
    if current_user.role not in [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.HR_MANAGER, UserRole.EMPLOYEE]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access Denied: Requires Employee permission.",
        )
    return current_user


# Strict Server-Side Data Ownership Verifiers (Multi-Tenant Isolation)

def verify_company_access(target_company_id: int, current_user: User):
    """
    Ensures that a user can only access data belonging to their own company.
    Super Admin bypasses company restrictions.
    """
    if current_user.role == UserRole.SUPER_ADMIN:
        return True

    if current_user.company_id is None or current_user.company_id != target_company_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Access Denied: Cannot access data for company_id={target_company_id}.",
        )
    return True


def verify_vendor_access(target_vendor_id: int, current_user: User):
    """
    Ensures that a vendor can only access data assigned to their vendor ID.
    Super Admin bypasses vendor restrictions.
    """
    if current_user.role == UserRole.SUPER_ADMIN:
        return True

    if current_user.role != UserRole.VENDOR or getattr(current_user, "vendor_id", None) != target_vendor_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Access Denied: Cannot access data for vendor_id={target_vendor_id}.",
        )
    return True


def verify_employee_access(target_employee_id: int, current_user: User):
    """
    Ensures an employee can only access their own record.
    Admins & HR within the same company can access employee records.
    """
    if current_user.role == UserRole.SUPER_ADMIN:
        return True

    if current_user.role in [UserRole.COMPANY_ADMIN, UserRole.HR_MANAGER]:
        # Handled by company_id verification
        return True

    if current_user.role == UserRole.EMPLOYEE:
        user_emp_id = getattr(current_user, "employee_id", None)
        if user_emp_id is not None and user_emp_id != target_employee_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access Denied: You can only view your own employee data.",
            )

    return True
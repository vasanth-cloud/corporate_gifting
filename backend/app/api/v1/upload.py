from fastapi import APIRouter, File, UploadFile, HTTPException
from pathlib import Path
import shutil
import uuid

router = APIRouter(
    prefix="/upload",
    tags=["Upload"],
)


BASE_DIR = Path("uploads")
BASE_DIR.mkdir(exist_ok=True)


def save_file(file: UploadFile, folder: str):
    extension = file.filename.split(".")[-1].lower()

    allowed_extensions = {
        "jpg",
        "jpeg",
        "png",
        "gif",
        "webp",
    }

    if extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail="Only image files are allowed",
        )

    folder_path = BASE_DIR / folder
    folder_path.mkdir(parents=True, exist_ok=True)

    filename = f"{uuid.uuid4()}.{extension}"

    file_path = folder_path / filename

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {
        "filename": filename,
        "url": f"/uploads/{folder}/{filename}"
    }


@router.post("/company")
def upload_company_logo(file: UploadFile = File(...)):
    return save_file(file, "companies")


@router.post("/gift")
def upload_gift_image(file: UploadFile = File(...)):
    return save_file(file, "gifts")


@router.post("/employee")
def upload_employee_image(file: UploadFile = File(...)):
    return save_file(file, "employees")
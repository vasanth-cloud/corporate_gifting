from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import decode_token
from app.repositories.user_repository import UserRepository

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/v1/auth/login"
)


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
    )

    try:
        print("=" * 50)
        print("TOKEN:", token)

        payload = decode_token(token)
        print("PAYLOAD:", payload)

        user_id = payload.get("sub")
        print("USER ID:", user_id)

        if user_id is None:
            print("SUB IS NONE")
            raise credentials_exception

        user = UserRepository.get_by_id(db, int(user_id))
        print("USER:", user)

        if user is None:
            print("USER NOT FOUND")
            raise credentials_exception

        print("AUTH SUCCESS")
        print("=" * 50)

        return user

    except JWTError as e:
        print("JWT ERROR:", e)
        raise credentials_exception

    except Exception as e:
        print("GENERAL ERROR:", e)
        raise credentials_exception
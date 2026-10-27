from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import User, Topic, Mastery
from app.schemas.schemas import UserRegister, UserLogin, TokenResponse, UserOut, UserUpdate, UserRoleUpdate
from app.auth import get_password_hash, verify_password, create_access_token, get_current_user, get_current_super_admin

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    # Check if user already exists
    existing = db.query(User).filter(User.phone_or_email == user_in.phone_or_email.strip()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this phone or email already exists."
        )

    # Disallow public Super Admin registration
    if user_in.role == "super_admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Public registration for Super Admin accounts is not permitted."
        )

    # Create new user
    hashed_pwd = get_password_hash(user_in.password)
    user = User(
        name=user_in.name.strip(),
        phone_or_email=user_in.phone_or_email.strip(),
        password_hash=hashed_pwd,
        role=user_in.role,
        class_level=user_in.class_level if user_in.role == "student" else None,
        language=user_in.language
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # If student, initialize 0.0 mastery scores for existing topics of their class level
    if user.role == "student":
        topics = db.query(Topic).filter(Topic.class_level == user.class_level).all()
        for t in topics:
            mastery = Mastery(student_id=user.id, topic_id=t.id, score=0.0)
            db.add(mastery)
        db.commit()

    # Generate token
    token = create_access_token(data={"sub": str(user.id), "role": user.role})
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserOut.from_orm(user)
    )


@router.post("/login", response_model=TokenResponse)
def login(creds: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.phone_or_email == creds.phone_or_email.strip()).first()
    if not user or not verify_password(creds.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials. Please verify your phone/email and password."
        )

    # Validate that user belongs to one of the 4 approved roles
    approved_roles = {"student", "teacher", "parent", "super_admin", "admin"}
    if user.role not in approved_roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account role is deactivated or not permitted in the 4-role active system."
        )

    token = create_access_token(data={"sub": str(user.id), "role": user.role})
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserOut.from_orm(user)
    )


@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return UserOut.from_orm(current_user)


@router.patch("/me", response_model=UserOut)
def update_me(
    update_data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if update_data.language:
        current_user.language = update_data.language
    if update_data.class_level:
        current_user.class_level = update_data.class_level
    if update_data.name:
        current_user.name = update_data.name.strip()

    db.commit()
    db.refresh(current_user)
    return UserOut.from_orm(current_user)


# --- SUPER ADMIN USER & ROLE MANAGEMENT ---
@router.get("/users")
def get_all_users(
    current_admin: User = Depends(get_current_super_admin),
    db: Session = Depends(get_db)
):
    """Super Admin: List all platform users and their roles."""
    users = db.query(User).order_by(User.id.asc()).all()
    return [
        {
            "id": u.id,
            "name": u.name,
            "phone_or_email": u.phone_or_email,
            "role": u.role,
            "class_level": u.class_level,
            "language": u.language,
            "created_at": u.created_at
        }
        for u in users
    ]


@router.patch("/users/{user_id}/role")
def update_user_role(
    user_id: int,
    role_data: UserRoleUpdate,
    current_admin: User = Depends(get_current_super_admin),
    db: Session = Depends(get_db)
):
    """Super Admin: Safely update a user's role to one of the 4 approved roles."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    approved_roles = {"student", "teacher", "parent", "super_admin"}
    if role_data.role not in approved_roles:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid role. Only {list(approved_roles)} are permitted."
        )

    user.role = role_data.role
    db.commit()
    db.refresh(user)

    return {
        "message": f"User {user.name} role updated to {user.role}",
        "user": {
            "id": user.id,
            "name": user.name,
            "phone_or_email": user.phone_or_email,
            "role": user.role
        }
    }

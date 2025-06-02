# backend/src/models/user.py
from sqlalchemy import Column, Integer, String, TIMESTAMP, func
from .base import Base  # Mengimpor Base dari base.py dalam package yang sama

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=func.now())

    def __repr__(self):
        return f"<User(username='{self.username}', email='{self.email}')>"
# backend/src/models/account.py
from sqlalchemy import Column, Integer, String, Float, ForeignKey
from src.models.base import Base

class Account(Base):
    __tablename__ = 'accounts'
    id       = Column(Integer, primary_key=True, autoincrement=True)
    user_id  = Column(Integer, ForeignKey('users.id'), nullable=False)
    name     = Column(String(100), nullable=False)
    balance  = Column(Float, default=0.0)
    def __repr__(self):
        return f"<Account(id={self.id})>" # Ganti dengan representasi yang lebih baik
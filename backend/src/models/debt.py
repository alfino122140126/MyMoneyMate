# backend/src/models/debt.py
from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from src.models.base import Base
from .base import Base, DBSession

class Debt(Base):
    __tablename__ = 'debts'
    id          = Column(Integer, primary_key=True, autoincrement=True)
    user_id     = Column(Integer, ForeignKey('users.id'), nullable=False)
    counterparty= Column(String(100), nullable=False)
    amount      = Column(Float, nullable=False)
    is_paid     = Column(Integer, default=0)  # 0 = belum, 1 = sudah
    due_date    = Column(DateTime(timezone=True))
    description = Column(String(255))

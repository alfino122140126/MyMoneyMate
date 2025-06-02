# backend/src/models/transaction.py
from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from src.models.base import Base
from .base import Base, DBSession

class Transaction(Base):
    __tablename__ = 'transactions'
    id         = Column(Integer, primary_key=True, autoincrement=True)
    account_id = Column(Integer, ForeignKey('accounts.id'), nullable=False)
    amount     = Column(Float, nullable=False)
    type       = Column(String(10), nullable=False)  # 'income' atau 'expense'
    category   = Column(String(50))
    timestamp  = Column(DateTime(timezone=True), server_default=func.now())
    description= Column(String(255))
    def __repr__(self):
        return f"<Transaction(id={self.id})>" # Ganti dengan representasi yang lebih baia
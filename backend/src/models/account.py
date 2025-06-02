# backend/src/models/account.py
from sqlalchemy import Column, Integer, String, Float, ForeignKey
from src.models.base import Base
from .base import Base, DBSession

class Account(Base):
    __tablename__ = 'accounts'
    id       = Column(Integer, primary_key=True, autoincrement=True)
    user_id  = Column(Integer, ForeignKey('users.id'), nullable=False)
    name     = Column(String(100), nullable=False)
    balance  = Column(Float, default=0.0)

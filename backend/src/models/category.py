# backend/src/models/category.py
from sqlalchemy import Column, Integer, String, ForeignKey
from src.models.base import Base
from .base import Base, DBSession

class Category(Base):
    __tablename__ = 'categories'
    id      = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    name    = Column(String(50), nullable=False)
    type    = Column(String(10), nullable=False)  # 'income' atau 'expense'

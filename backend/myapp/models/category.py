from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from .meta import Base

class Category(Base):
    __tablename__ = 'categories'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    
    transactions = relationship("Transaction", back_populates="category")
    user = relationship("User", back_populates="categories")
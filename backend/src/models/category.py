# backend/src/models/category.py
from sqlalchemy import Column, Integer, String, ForeignKey # Tambahkan tipe data lain sesuai kebutuhan
# from sqlalchemy.orm import relationship
from .base import Base

class Category(Base):
    __tablename__ = "categories" # Nama tabel harus sesuai

    id = Column(Integer, primary_key=True, index=True)
    # LENGKAPI KOLOM-KOLOM BERIKUT SESUAI TABEL 'categories' ANDA:
    # Contoh:
    # name = Column(String(100), unique=True, nullable=False) # Mungkin unik per user
    # user_id = Column(Integer, ForeignKey("users.id")) # Opsional, jika kategori per user
    # type = Column(String(50)) # Misalnya 'income' atau 'expense'
    
    # transactions = relationship("Transaction", back_populates="category")

    def __repr__(self):
        return f"<Category(id={self.id}, name='{self.name if hasattr(self, 'name') else ''}')>"
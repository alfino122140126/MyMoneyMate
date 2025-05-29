from sqlalchemy import Column, Integer, String, Numeric, Date, ForeignKey
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import relationship
from datetime import date as date_type # Import Date from datetime module
from passlib.context import CryptContext

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    username = Column(String, nullable=False)
    email = Column(String, nullable=False)
    password = Column(String, nullable=False)

    transactions = relationship('Transaction', back_populates='user')
    debts = relationship('Debt', back_populates='user')
    recurring_expenses = relationship('RecurringExpense', back_populates='user')

    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    def set_password(self, password):
        self.password = self.pwd_context.hash(password)

    def check_password(self, password):
        return self.pwd_context.verify(password, self.password)

    def __repr__(self):
        return f"<User(id={self.id}, username='{self.username}', email='{self.email}')>"

    def to_dict(self):
        """Returns a dictionary representation of the user, excluding password."""
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            # Password is not included for security
        }

class Category(Base):
    __tablename__ = 'categories'

    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, nullable=False)

    transactions = relationship('Transaction', back_populates='category')

    def __repr__(self):
        return f"<Category(id={self.id}, name='{self.name}')>"

    def to_dict(self):
        """Returns a dictionary representation of the category."""
        return {
            'id': self.id,
            'name': self.name,
        }

class Transaction(Base):
    __tablename__ = 'transactions'

    id = Column(Integer, primary_key=True)
    description = Column(String, nullable=False)
    amount = Column(Numeric, nullable=False)
    date = Column(Date, nullable=False, default=date_type.today)
    type = Column(String, nullable=False) # e.g., 'income', 'expense'
    category_id = Column(Integer, ForeignKey('categories.id'), nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)

    category = relationship('Category', back_populates='transactions')
    user = relationship('User', back_populates='transactions')

    def __repr__(self):
        return f"<Transaction(id={self.id}, description='{self.description}', amount={self.amount}, date={self.date}, type='{self.type}')>"

    def to_dict(self):
        """Returns a dictionary representation of the transaction."""
        return {
            'id': self.id,
            'description': self.description,
            'amount': float(self.amount), # Convert Numeric to float
            'date': self.date.strftime('%Y-%m-%d') if self.date else None, # Format date
            'type': self.type,
            'category_id': self.category_id,
            'user_id': self.user_id,
        }
class Debt(Base):
    __tablename__ = 'debts'

    id = Column(Integer, primary_key=True)
    description = Column(String, nullable=False)
    amount = Column(Numeric, nullable=False)
    type = Column(String, nullable=False) # e.g., 'owe', 'owed'
    party = Column(String, nullable=False) # Person or entity name
    due_date = Column(Date, nullable=True) # Nullable if no specific due date
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)

    user = relationship('User', back_populates='debts')

    def __repr__(self):
        return f"<Debt(id={self.id}, description='{self.description}', amount={self.amount}, type='{self.type}', party='{self.party}')>"

    def to_dict(self):
        """Returns a dictionary representation of the debt."""
        return {
            'id': self.id,
            'description': self.description,
            'amount': float(self.amount), # Convert Numeric to float
            'type': self.type,
            'party': self.party,
            'due_date': self.due_date.strftime('%Y-%m-%d') if self.due_date else None, # Format date
            'user_id': self.user_id,
        }
class RecurringExpense(Base):
    __tablename__ = 'recurring_expenses'

    id = Column(Integer, primary_key=True)
    description = Column(String, nullable=False)
    amount = Column(Numeric, nullable=False)
    frequency = Column(String, nullable=False) # e.g., 'daily', 'weekly', 'monthly', 'yearly'
    next_due_date = Column(Date, nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)

class Debt(Base):
    def to_dict(self):
        """Returns a dictionary representation of the recurring expense."""
        return {
            'id': self.id,
            'description': self.description,
            'amount': float(self.amount), # Convert Numeric to float
            'frequency': self.frequency,
            'next_due_date': self.next_due_date.strftime('%Y-%m-%d') if self.next_due_date else None, # Format date
            'user_id': self.user_id,
        }

    __tablename__ = 'debts'

    id = Column(Integer, primary_key=True)
    description = Column(String, nullable=False)
    amount = Column(Numeric, nullable=False)
    type = Column(String, nullable=False) # e.g., 'owe', 'owed'
    party = Column(String, nullable=False) # Person or entity name
    due_date = Column(Date, nullable=True) # Nullable if no specific due date
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)

    user = relationship('User', back_populates='debts')

    def __repr__(self):
        return f"<Debt(id={self.id}, description='{self.description}', amount={self.amount}, type='{self.type}', party='{self.party}')>"

class RecurringExpense(Base):
    __tablename__ = 'recurring_expenses'

    id = Column(Integer, primary_key=True)
    description = Column(String, nullable=False)
    amount = Column(Numeric, nullable=False)
    frequency = Column(String, nullable=False) # e.g., 'daily', 'weekly', 'monthly', 'yearly'
    next_due_date = Column(Date, nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)

    user = relationship('User', back_populates='recurring_expenses')

    def __repr__(self):
        return f"<RecurringExpense(id={self.id}, description='{self.description}', amount={self.amount}, frequency='{self.frequency}')>"

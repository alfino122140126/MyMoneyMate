from pyramid_restful.viewsets import CRUDViewSet
from pyramid.view import view_config
from pyramid.security import Authenticated
from sqlalchemy.exc import SQLAlchemyError
from ..models import RecurringExpense
from .. import DBSession

class RecurringExpenseViewSet(CRUDViewSet):
    def create(self):
        """
        Create a new recurring expense for the authenticated user.
        """
        if self.request.authenticated_userid is None:
            self.request.response.status = 403
            return {'error': 'Authentication required'}

        try:
            data = self.request.json_body if self.request.json_body else {}
            user_id = self.request.authenticated_userid['id'] # Assuming authenticated_userid is a dict with 'id'

            # Basic validation (you might want more robust validation)
            if not all(k in data for k in ('description', 'amount', 'frequency', 'next_due_date')):
                self.request.response.status = 400
                return {'error': 'Missing required fields'}

            recurring_expense = RecurringExpense(
                description=data['description'],
                amount=data['amount'],
                frequency=data['frequency'],
                next_due_date=data['next_due_date'],
                user_id=user_id
            )

            DBSession.add(recurring_expense)
            DBSession.flush() # Ensure the object gets an ID

            self.request.response.status = 201
            return recurring_expense.to_dict() # Assuming you have a to_dict method in your model

        except SQLAlchemyError as e:
            self.request.response.status = 500
            return {'error': 'Database error', 'details': str(e)}
        except Exception as e:
            self.request.response.status = 400
            return {'error': 'Invalid data', 'details': str(e)}

    def list(self):
        """
        List all recurring expenses for the authenticated user.
        """
        if self.request.authenticated_userid is None:
            self.request.response.status = 403
            return {'error': 'Authentication required'}

        try:
            user_id = self.request.authenticated_userid['id']
            recurring_expenses = DBSession.query(RecurringExpense).filter_by(user_id=user_id).all()
            return [re.to_dict() for re in recurring_expenses] # Assuming to_dict method
        except SQLAlchemyError as e:
            self.request.response.status = 500
            return {'error': 'Database error', 'details': str(e)}
        except Exception as e:
            self.request.response.status = 500
            return {'error': 'An unexpected error occurred', 'details': str(e)}


    def retrieve(self, id):
        """
        Retrieve a single recurring expense by ID for the authenticated user.
        """
        if self.request.authenticated_userid is None:
            self.request.response.status = 403
            return {'error': 'Authentication required'}

        try:
            user_id = self.request.authenticated_userid['id']
            recurring_expense = DBSession.query(RecurringExpense).filter_by(id=id, user_id=user_id).first()

            if recurring_expense is None:
                self.request.response.status = 404
                return {'error': 'Recurring expense not found or does not belong to the user'}

            return recurring_expense.to_dict()
        except SQLAlchemyError as e:
            self.request.response.status = 500
            return {'error': 'Database error', 'details': str(e)}
        except Exception as e:
            self.request.response.status = 500
            return {'error': 'An unexpected error occurred', 'details': str(e)}

    def update(self, id):
        """
        Update an existing recurring expense by ID for the authenticated user.
        """
        if self.request.authenticated_userid is None:
            self.request.response.status = 403
            return {'error': 'Authentication required'}

        try:
            user_id = self.request.authenticated_userid['id']
            recurring_expense = DBSession.query(RecurringExpense).filter_by(id=id, user_id=user_id).first()

            if recurring_expense is None:
                self.request.response.status = 404
                return {'error': 'Recurring expense not found or does not belong to the user'}
            data = self.request.json_body if self.request.json_body else {}
            data = self.request.json_body
            for key, value in data.items():
                if hasattr(recurring_expense, key):
                    setattr(recurring_expense, key, value)

            DBSession.merge(recurring_expense) # Use merge for updates
            DBSession.flush()

            return recurring_expense.to_dict()

        except SQLAlchemyError as e:
            self.request.response.status = 500
            return {'error': 'Database error', 'details': str(e)}
        except Exception as e:
            self.request.response.status = 400
            return {'error': 'Invalid data', 'details': str(e)}

    def delete(self, id):
        """
        Delete a recurring expense by ID for the authenticated user.
        """
        if self.request.authenticated_userid is None:
            self.request.response.status = 403
            return {'error': 'Authentication required'}

        try:
            user_id = self.request.authenticated_userid['id']
            recurring_expense = DBSession.query(RecurringExpense).filter_by(id=id, user_id=user_id).first()

            if recurring_expense is None:
                self.request.response.status = 404
                return {'error': 'Recurring expense not found or does not belong to the user'}

            DBSession.delete(recurring_expense)
            DBSession.flush()

            self.request.response.status = 204 # No content on successful delete
            return {}

        except SQLAlchemyError as e:
            self.request.response.status = 500
            return {'error': 'Database error', 'details': str(e)}
        except Exception as e:
            self.request.response.status = 500
            return {'error': 'An unexpected error occurred', 'details': str(e)}
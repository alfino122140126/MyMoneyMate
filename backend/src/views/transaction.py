from pyramid_restful.viewsets import CRUDViewSet
from pyramid.view import view_config
from pyramid.response import Response
from pyramid.httpexceptions import HTTPNotFound, HTTPForbidden
from ..models import Transaction, User, Category
from sqlalchemy.exc import SQLAlchemyError
import datetime

class TransactionViewSet(CRUDViewSet):

    def create(self, request):
        """Creates a new transaction associated with the authenticated user."""
        if not request.authenticated_userid:
            return HTTPForbidden()

        try:
            data = request.json_body
            user = request.dbsession.query(User).filter_by(id=request.authenticated_userid).first()
            if not user:
                 return HTTPForbidden() # Should not happen if authentication is working

            category_id = data.get('category_id')
            category = None
            if category_id:
                category = request.dbsession.query(Category).filter_by(id=category_id).first()
                if not category:
                     return Response(json_body={'error': 'Category not found'}, status=404)

            # Convert date string to Date object
            date_str = data.get('date')
            transaction_date = None
            if date_str:
                try:
                    transaction_date = datetime.datetime.strptime(date_str, '%Y-%m-%d').date()
                except ValueError:
                    return Response(json_body={'error': 'Invalid date format. Use YYYY-MM-DD'}, status=400)

            new_transaction = Transaction(
                description=data.get('description'),
                amount=data.get('amount'),
                date=transaction_date,
                type=data.get('type'),
                user_id=user.id,
                category_id=category_id if category else None
            )

            request.dbsession.add(new_transaction)
            request.dbsession.flush() # To get the new transaction ID

            return Response(json_body=new_transaction.to_dict(), status=201)

        except SQLAlchemyError:
            return Response(json_body={'error': 'Failed to create transaction'}, status=500)
        except Exception as e:
             return Response(json_body={'error': str(e)}, status=400)


    def retrieve(self, request, id):
        """Retrieves a single transaction for the authenticated user."""
        if not request.authenticated_userid:
            return HTTPForbidden()

        transaction = request.dbsession.query(Transaction).filter_by(id=id, user_id=request.authenticated_userid).first()
        if not transaction:
            return HTTPNotFound()
        return Response(json_body=transaction.to_dict())

    def list(self, request):
        """Lists all transactions for the authenticated user."""
        if not request.authenticated_userid:
            return HTTPForbidden()

        transactions = request.dbsession.query(Transaction).filter_by(user_id=request.authenticated_userid).all()
        return Response(json_body=[t.to_dict() for t in transactions])

    def update(self, request, id):
        """Updates an existing transaction for the authenticated user."""
        if not request.authenticated_userid:
            return HTTPForbidden()

        transaction = request.dbsession.query(Transaction).filter_by(id=id, user_id=request.authenticated_userid).first()
        if not transaction:
            return HTTPNotFound()

        try:
            data = request.json_body
            # Update fields if they exist in the request data
            if 'description' in data:
                transaction.description = data['description']
            if 'amount' in data:
                transaction.amount = data['amount']
            if 'date' in data:
                # Handle date update
                date_str = data['date']
                if date_str:
                    try:
                        transaction.date = datetime.datetime.strptime(date_str, '%Y-%m-%d').date()
                    except ValueError:
                        return Response(json_body={'error': 'Invalid date format for update. Use YYYY-MM-DD'}, status=400)
                else:
                     transaction.date = None # Or handle as required

            if 'type' in data:
                transaction.type = data['type']

            if 'category_id' in data:
                 category_id = data['category_id']
                 category = None
                 if category_id:
                     category = request.dbsession.query(Category).filter_by(id=category_id).first()
                     if not category:
                          return Response(json_body={'error': 'Category not found'}, status=404)
                 transaction.category_id = category_id if category else None

            request.dbsession.flush()
            return Response(json_body=transaction.to_dict())

        except SQLAlchemyError:
            return Response(json_body={'error': 'Failed to update transaction'}, status=500)
        except Exception as e:
             return Response(json_body={'error': str(e)}, status=400)


    def destroy(self, request, id):
        """Deletes a transaction for the authenticated user."""
        if not request.authenticated_userid:
            return HTTPForbidden()

        transaction = request.dbsession.query(Transaction).filter_by(id=id, user_id=request.authenticated_userid).first()
        if not transaction:
            return HTTPNotFound()

        try:
            request.dbsession.delete(transaction)
            request.dbsession.flush()
            return Response(status=204)
        except SQLAlchemyError:
            return Response(json_body={'error': 'Failed to delete transaction'}, status=500)
from pyramid_restful.viewsets import CRUDViewSet
from pyramid.view import view_config
from pyramid.response import Response
from pyramid.httpexceptions import HTTPNotFound, HTTPForbidden
from ..models import Transaction, User, Category
from sqlalchemy.exc import SQLAlchemyError

class TransactionViewSet(CRUDViewSet):

    def create(self, request):
        """Creates a new transaction associated with the authenticated user."""
        if not request.authenticated_userid:
            return HTTPForbidden()

        try:
            data = request.json_body
            user = request.dbsession.query(User).filter_by(id=request.authenticated_userid).first()
            if not user:
                 return HTTPForbidden() # Should not happen if authentication is working

            category_id = data.get('category_id')
            category = None
            if category_id:
                category = request.dbsession.query(Category).filter_by(id=category_id).first()
                if not category:
                     return Response(json_body={'error': 'Category not found'}, status=404)


            new_transaction = Transaction(
                description=data.get('description'),
                amount=data.get('amount'),
                date=data.get('date'),
                type=data.get('type'),
                user_id=user.id,
                category_id=category_id if category else None
            )

            request.dbsession.add(new_transaction)
            request.dbsession.flush() # To get the new transaction ID

            return Response(json_body=new_transaction.to_dict(), status=201)

        except SQLAlchemyError:
            return Response(json_body={'error': 'Failed to create transaction'}, status=500)
        except Exception as e:
             return Response(json_body={'error': str(e)}, status=400)


    def retrieve(self, request, id):
        """Retrieves a single transaction for the authenticated user."""
        if not request.authenticated_userid:
            return HTTPForbidden()

        transaction = request.dbsession.query(Transaction).filter_by(id=id, user_id=request.authenticated_userid).first()
        if not transaction:
            return HTTPNotFound()
        return Response(json_body=transaction.to_dict())

    def list(self, request):
        """Lists all transactions for the authenticated user."""
        if not request.authenticated_userid:
            return HTTPForbidden()

        transactions = request.dbsession.query(Transaction).filter_by(user_id=request.authenticated_userid).all()
        return Response(json_body=[t.to_dict() for t in transactions])

    def update(self, request, id):
        """Updates an existing transaction for the authenticated user."""
        if not request.authenticated_userid:
            return HTTPForbidden()

        transaction = request.dbsession.query(Transaction).filter_by(id=id, user_id=request.authenticated_userid).first()
        if not transaction:
            return HTTPNotFound()

        try:
            data = request.json_body
            if 'description' in data:
                transaction.description = data['description']
            if 'amount' in data:
                transaction.amount = data['amount']
            if 'date' in data:
                transaction.date = data['date']
            if 'type' in data:
                transaction.type = data['type']
            if 'category_id' in data:
                 category_id = data['category_id']
                 category = None
                 if category_id:
                     category = request.dbsession.query(Category).filter_by(id=category_id).first()
                     if not category:
                          return Response(json_body={'error': 'Category not found'}, status=404)
                 transaction.category_id = category_id if category else None


            request.dbsession.flush()
            return Response(json_body=transaction.to_dict())

        except SQLAlchemyError:
            return Response(json_body={'error': 'Failed to update transaction'}, status=500)
        except Exception as e:
             return Response(json_body={'error': str(e)}, status=400)


    def destroy(self, request, id):
        """Deletes a transaction for the authenticated user."""
        if not request.authenticated_userid:
            return HTTPForbidden()

        transaction = request.dbsession.query(Transaction).filter_by(id=id, user_id=request.authenticated_userid).first()
        if not transaction:
            return HTTPNotFound()

        try:
            request.dbsession.delete(transaction)
            request.dbsession.flush()
            return Response(status=204)
        except SQLAlchemyError:
            return Response(json_body={'error': 'Failed to delete transaction'}, status=500)
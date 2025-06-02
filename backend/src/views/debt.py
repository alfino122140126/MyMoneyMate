from pyramid_restful.viewsets import CRUDViewSet
from sqlalchemy.exc import SQLAlchemyError
from pyramid.response import Response
from pyramid.request import Request
from pyramid.view import view_config
from ..models import Debt, User
from .. import DBSession  # Assuming DBSession is defined in __init__.py

class DebtViewSet(CRUDViewSet):
 def create(self, request: Request):
 if not request.authenticated_userid:
 return Response(json_body={'message': 'Authentication required'}, status=401)

 try:
 data = request.json_body
 user = DBSession.query(User).filter_by(id=request.authenticated_userid).first()
 if not user:
 return Response(json_body={'message': 'User not found'}, status=404)

 new_debt = Debt(
 description=data.get('description'),
 amount=data.get('amount'),
 type=data.get('type'),
 party=data.get('party'),
 due_date=data.get('due_date'), # Assuming date is in a parseable format
 user_id=user.id
 )
 DBSession.add(new_debt)
 DBSession.flush() # Get the ID before commit
 return Response(json_body=new_debt.to_dict(), status=201)
 except SQLAlchemyError as e:
 request.dbsession.rollback()
 return Response(json_body={'message': str(e)}, status=500)
 except Exception as e:
 return Response(json_body={'message': str(e)}, status=400)

 def list(self, request: Request):
 if not request.authenticated_userid:
 return Response(json_body={'message': 'Authentication required'}, status=401)

 try:
 debts = DBSession.query(Debt).filter_by(user_id=request.authenticated_userid).all()
 return Response(json_body=[debt.to_dict() for debt in debts], status=200)
 except SQLAlchemyError as e:
 return Response(json_body={'message': str(e)}, status=500)

 def retrieve(self, request: Request, id: int):
 if not request.authenticated_userid:
 return Response(json_body={'message': 'Authentication required'}, status=401)

 try:
 debt = DBSession.query(Debt).filter_by(id=id, user_id=request.authenticated_userid).first()
 if debt:
 return Response(json_body=debt.to_dict(), status=200)
 return Response(json_body={'message': 'Debt not found'}, status=404)
 except SQLAlchemyError as e:
 return Response(json_body={'message': str(e)}, status=500)

 def update(self, request: Request, id: int):
 if not request.authenticated_userid:
 return Response(json_body={'message': 'Authentication required'}, status=401)

 try:
 debt = DBSession.query(Debt).filter_by(id=id, user_id=request.authenticated_userid).first()
 if debt:
 data = request.json_body
 for key, value in data.items():
 if hasattr(debt, key):
 setattr(debt, key, value)
 DBSession.flush()
 return Response(json_body=debt.to_dict(), status=200)
 return Response(json_body={'message': 'Debt not found'}, status=404)
 except SQLAlchemyError as e:
 request.dbsession.rollback()
 return Response(json_body={'message': str(e)}, status=500)
 except Exception as e:
 return Response(json_body={'message': str(e)}, status=400)

 def destroy(self, request: Request, id: int):
 if not request.authenticated_userid:
 return Response(json_body={'message': 'Authentication required'}, status=401)

 try:
 debt = DBSession.query(Debt).filter_by(id=id, user_id=request.authenticated_userid).first()
 if debt:
 DBSession.delete(debt)
 DBSession.flush()
 return Response(json_body={'message': 'Debt deleted'}, status=200)
 return Response(json_body={'message': 'Debt not found'}, status=404)
 except SQLAlchemyError as e:
 request.dbsession.rollback()
 return Response(json_body={'message': str(e)}, status=500)
from pyramid_restful.viewsets import CRUDViewSet
from sqlalchemy.exc import SQLAlchemyError
from pyramid.response import Response
from pyramid.request import Request
from pyramid.view import view_config
from ..models import Debt, User
from .. import DBSession  # Assuming DBSession is defined in __init__.py

class DebtViewSet(CRUDViewSet):
    def create(self, request: Request):
        if not request.authenticated_userid: # Fix indent
            return Response(json_body={'message': 'Authentication required'}, status=401)

        try:
            data = request.json_body
            user = DBSession.query(User).filter_by(id=request.authenticated_userid).first()
            if not user:
                return Response(json_body={'message': 'User not found'}, status=404)

            new_debt = Debt(
                description=data.get('description'),
                amount=data.get('amount'),
                type=data.get('type'),
                party=data.get('party'),
                due_date=data.get('due_date'), # Assuming date is in a parseable format
                user_id=user.id
            )
            DBSession.add(new_debt)
            DBSession.flush() # Get the ID before commit
            return Response(json_body=new_debt.to_dict(), status=201)
        except SQLAlchemyError as e:
            request.dbsession.rollback()
            return Response(json_body={'message': str(e)}, status=500)
        except Exception as e:
            return Response(json_body={'message': str(e)}, status=400)

    def list(self, request: Request):
        if not request.authenticated_userid:
            return Response(json_body={'message': 'Authentication required'}, status=401)

        try:
            debts = DBSession.query(Debt).filter_by(user_id=request.authenticated_userid).all()
            return Response(json_body=[debt.to_dict() for debt in debts], status=200)
        except SQLAlchemyError as e:
            return Response(json_body={'message': str(e)}, status=500)

    def retrieve(self, request: Request, id: int):
        if not request.authenticated_userid:
            return Response(json_body={'message': 'Authentication required'}, status=401)

        try:
            debt = DBSession.query(Debt).filter_by(id=id, user_id=request.authenticated_userid).first()
            if debt:
                return Response(json_body=debt.to_dict(), status=200)
            return Response(json_body={'message': 'Debt not found'}, status=404)
        except SQLAlchemyError as e:
            return Response(json_body={'message': str(e)}, status=500)

    def update(self, request: Request, id: int):
        if not request.authenticated_userid:
            return Response(json_body={'message': 'Authentication required'}, status=401)

        try:
            debt = DBSession.query(Debt).filter_by(id=id, user_id=request.authenticated_userid).first()
            if debt:
                data = request.json_body
                for key, value in data.items():
                    if hasattr(debt, key):
                        setattr(debt, key, value)
                DBSession.flush()
                return Response(json_body=debt.to_dict(), status=200)
            return Response(json_body={'message': 'Debt not found'}, status=404)
        except SQLAlchemyError as e:
            request.dbsession.rollback()
            return Response(json_body={'message': str(e)}, status=500)
        except Exception as e:
             return Response(json_body={'message': str(e)}, status=400)


    def destroy(self, request: Request, id: int):
        if not request.authenticated_userid:
            return Response(json_body={'message': 'Authentication required'}, status=401)

        try:
            debt = DBSession.query(Debt).filter_by(id=id, user_id=request.authenticated_userid).first()
            if debt:
                DBSession.delete(debt)
                DBSession.flush()
                return Response(json_body={'message': 'Debt deleted'}, status=200)
            return Response(json_body={'message': 'Debt not found'}, status=404)
        except SQLAlchemyError as e:
            request.dbsession.rollback()
from pyramid_restful.viewsets import APIViewSet
from sqlalchemy.exc import SQLAlchemyError
from pyramid.response import Response
from pyramid.request import Request, authenticated_userid
from backend.src.models import User  # Assuming User model is in backend.src.models
from sqlalchemy import inspect


class UserViewSet(APIViewSet):

    def list(self, request: Request):
        """
        List all users.
        GET /users
        """
        if not authenticated_userid(request):
            return Response(json_body={'error': 'Authentication required'}, status=403)

        try:
            users = request.dbsession.query(User).all()
            user_list = [
                {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email
                } for user in users
            ]
            return Response(json_body=user_list, status=200)
        except SQLAlchemyError:
            return Response(json_body={'error': 'Internal server error'}, status=500)

    def retrieve(self, request: Request, id=None):
        """
        Retrieve a single user by ID.
        GET /users/{id}
        """
        if not authenticated_userid(request):
            return Response(json_body={'error': 'Authentication required'}, status=403)

        try:
            user = request.dbsession.query(User).filter_by(id=id).first()
            if user:
                user_data = {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email
                }
                return Response(json_body=user_data, status=200)
            else:
                return Response(json_body={'error': 'User not found'}, status=404)
        except SQLAlchemyError:
            return Response(json_body={'error': 'Internal server error'}, status=500)

    def update(self, request: Request, id=None):
        """
        Update an existing user by ID.
        PUT /users/{id}
        """
        if not authenticated_userid(request):
            return Response(json_body={'error': 'Authentication required'}, status=403)

        try:
            user = request.dbsession.query(User).filter_by(id=id).first()
            if not user:
                return Response(json_body={'error': 'User not found'}, status=404)

            data = request.json_body
            user.username = data.get('username', user.username)
            user.email = data.get('email', user.email)

                'id': user.id,
                'username': user.username,
                'email': user.email
            }
            return Response(json_body=user_data, status=200)
        except SQLAlchemyError:
            request.dbsession.rollback()
        except Exception:
            return Response(json_body={'error': 'Invalid request body'}, status=400)

    def destroy(self, request: Request, id=None):
        """
        Delete a user by ID.
        DELETE /users/{id}
        """
        if not authenticated_userid(request):
            return Response(json_body={'error': 'Authentication required'}, status=403)

        try:
            user = request.dbsession.query(User).filter_by(id=id).first()
            if not user:
                return Response(json_body={'error': 'User not found'}, status=404)

            request.dbsession.delete(user)
            return Response(json_body={'message': 'User deleted successfully'}, status=200)
        except SQLAlchemyError:
            request.dbsession.rollback()
            return Response(json_body={'error': 'Internal server error'}, status=500)
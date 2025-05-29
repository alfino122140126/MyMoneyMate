from pyramid_restful.viewsets import CRUDViewSet
from pyramid.response import Response
from pyramid.request import Request
from pyramid.httpexceptions import HTTPForbidden
from sqlalchemy.exc import IntegrityError
from ..models import Category
from .. import DBSession

class CategoryViewSet(CRUDViewSet):

    def __init__(self, request: Request):
        self.request = request
        self.DBSession = request.dbsession # Assuming DBSession is available via request

    def create(self, request: Request):
        if not request.authenticated_userid:
            return HTTPForbidden()

        try:
            category_data = request.json_body
            category = Category(name=category_data['name'])
            self.DBSession.add(category)
            self.DBSession.flush()
            return Response(json_body={"id": category.id, "name": category.name}, status=201)
        except KeyError:
            return Response(json_body={"error": "Missing category name"}, status=400)
        except IntegrityError:
            self.DBSession.rollback()
            return Response(json_body={"error": "Category with this name already exists"}, status=409)
        except Exception:
            self.DBSession.rollback()
            return Response(json_body={"error": "An error occurred"}, status=500)

    def list(self, request: Request):
        if not request.authenticated_userid:
            return HTTPForbidden()

        categories = self.DBSession.query(Category).all()
        return Response(json_body=[{"id": cat.id, "name": cat.name} for cat in categories])

    def retrieve(self, request: Request, id: int):
        if not request.authenticated_userid:
            return HTTPForbidden()

        category = self.DBSession.query(Category).filter_by(id=id).first()
        if category:
            return Response(json_body={"id": category.id, "name": category.name})
        return Response(json_body={"error": "Category not found"}, status=404)

    def update(self, request: Request, id: int):
        if not request.authenticated_userid:
            return HTTPForbidden()

        category = self.DBSession.query(Category).filter_by(id=id).first()
        if not category:
            return Response(json_body={"error": "Category not found"}, status=404)

        try:
            category_data = request.json_body
            category.name = category_data.get('name', category.name)
            self.DBSession.flush()
            return Response(json_body={"id": category.id, "name": category.name})
        except KeyError:
            return Response(json_body={"error": "Missing category name"}, status=400)
        except IntegrityError:
            self.DBSession.rollback()
            return Response(json_body={"error": "Category with this name already exists"}, status=409)
        except Exception:
            self.DBSession.rollback()
            return Response(json_body={"error": "An error occurred"}, status=500)

    def destroy(self, request: Request, id: int):
        if not request.authenticated_userid:
            return HTTPForbidden()

        category = self.DBSession.query(Category).filter_by(id=id).first()
        if not category:
            return Response(json_body={"error": "Category not found"}, status=404)

        try:
            self.DBSession.delete(category)
            self.DBSession.flush()
            return Response(status=204)
        except Exception:
            self.DBSession.rollback()
            return Response(json_body={"error": "An error occurred"}, status=500)
from pyramid_restful.viewsets import CRUDViewSet
from pyramid.response import Response
from pyramid.request import Request
from pyramid.httpexceptions import HTTPForbidden
from sqlalchemy.exc import IntegrityError
from ..models import Category
from .. import DBSession

class CategoryViewSet(CRUDViewSet):

    def __init__(self, request: Request):
        self.request = request
        self.DBSession = request.dbsession # Assuming DBSession is available via request

    def create(self, request: Request):
        if not request.authenticated_userid:
            return HTTPForbidden()

        try:
            category_data = request.json_body
            category = Category(name=category_data['name'])
            self.DBSession.add(category)
            self.DBSession.flush()
            return Response(json_body={"id": category.id, "name": category.name}, status=201)
        except KeyError:
            return Response(json_body={"error": "Missing category name"}, status=400)
        except IntegrityError:
            self.DBSession.rollback()
            return Response(json_body={"error": "Category with this name already exists"}, status=409)
        except Exception:
            self.DBSession.rollback()
            return Response(json_body={"error": "An error occurred"}, status=500)

    def list(self, request: Request):
        if not request.authenticated_userid:
            return HTTPForbidden()

        categories = self.DBSession.query(Category).all()
        return Response(json_body=[{"id": cat.id, "name": cat.name} for cat in categories])

    def retrieve(self, request: Request, id: int):
        if not request.authenticated_userid:
            return HTTPForbidden()

        category = self.DBSession.query(Category).filter_by(id=id).first()
        if category:
            return Response(json_body={"id": category.id, "name": category.name})
        return Response(json_body={"error": "Category not found"}, status=404)

    def update(self, request: Request, id: int):
        if not request.authenticated_userid:
            return HTTPForbidden()

        category = self.DBSession.query(Category).filter_by(id=id).first()
        if not category:
            return Response(json_body={"error": "Category not found"}, status=404)

        try:
            category_data = request.json_body
            category.name = category_data.get('name', category.name)
            self.DBSession.flush()
            return Response(json_body={"id": category.id, "name": category.name})
        except KeyError:
            return Response(json_body={"error": "Missing category name"}, status=400)
        except IntegrityError:
            self.DBSession.rollback()
            return Response(json_body={"error": "Category with this name already exists"}, status=409)
        except Exception:
            self.DBSession.rollback()
            return Response(json_body={"error": "An error occurred"}, status=500)

    def destroy(self, request: Request, id: int):
        if not request.authenticated_userid:
            return HTTPForbidden()

        category = self.DBSession.query(Category).filter_by(id=id).first()
        if not category:
            return Response(json_body={"error": "Category not found"}, status=404)

        try:
            self.DBSession.delete(category)
            self.DBSession.flush()
            return Response(status=204)
        except Exception:
            self.DBSession.rollback()
            return Response(json_body={"error": "An error occurred"}, status=500)
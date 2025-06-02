from pyramid.view import view_config
from pyramid.httpexceptions import HTTPNotFound, HTTPBadRequest, HTTPCreated, HTTPNoContent

from ..models.category import Category

@view_config(route_name='get_categories', renderer='json', permission='view')
def get_categories(request):
    user_id = request.authenticated_userid
    categories = request.dbsession.query(Category).filter_by(user_id=user_id).all()
    
    result = []
    for category in categories:
        result.append({
            'id': category.id,
            'name': category.name
        })
    
    return result

@view_config(route_name='get_category', renderer='json', permission='view')
def get_category(request):
    user_id = request.authenticated_userid
    category_id = request.matchdict['id']
    
    category = request.dbsession.query(Category).filter_by(
        id=category_id, user_id=user_id).first()
    
    if not category:
        raise HTTPNotFound(json={'error': 'Category not found'})
    
    return {
        'id': category.id,
        'name': category.name
    }

@view_config(route_name='add_category', renderer='json', permission='view')
def add_category(request):
    user_id = request.authenticated_userid
    data = request.json_body
    
    # Validate required fields
    if 'name' not in data:
        raise HTTPBadRequest(json={'error': 'Name is required'})
    
    # Create new category
    new_category = Category(
        user_id=user_id,
        name=data['name']
    )
    
    request.dbsession.add(new_category)
    request.dbsession.flush()
    
    return HTTPCreated(json={
        'id': new_category.id,
        'name': new_category.name
    })

@view_config(route_name='update_category', renderer='json', permission='view')
def update_category(request):
    user_id = request.authenticated_userid
    category_id = request.matchdict['id']
    data = request.json_body
    
    # Find the category
    category = request.dbsession.query(Category).filter_by(
        id=category_id, user_id=user_id).first()
    
    if not category:
        raise HTTPNotFound(json={'error': 'Category not found'})
    
    # Update fields
    if 'name' in data:
        category.name = data['name']
    
    request.dbsession.flush()
    
    return {
        'id': category.id,
        'name': category.name
    }

@view_config(route_name='delete_category', renderer='json', permission='view')
def delete_category(request):
    user_id = request.authenticated_userid
    category_id = request.matchdict['id']
    
    # Find the category
    category = request.dbsession.query(Category).filter_by(
        id=category_id, user_id=user_id).first()
    
    if not category:
        raise HTTPNotFound(json={'error': 'Category not found'})
    
    # Delete the category
    request.dbsession.delete(category)
    
    return HTTPNoContent()
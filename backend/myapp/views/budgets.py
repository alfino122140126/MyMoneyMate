from pyramid.view import view_config
from pyramid.httpexceptions import HTTPNotFound, HTTPBadRequest, HTTPCreated, HTTPNoContent
from datetime import datetime

from ..models.budget import Budget

@view_config(route_name='get_budgets', renderer='json', permission='view')
def get_budgets(request):
    user_id = request.authenticated_userid
    budgets = request.dbsession.query(Budget).filter_by(user_id=user_id).all()
    
    result = []
    for budget in budgets:
        result.append({
            'id': budget.id,
            'total': budget.total,
            'start_date': budget.start_date.isoformat() if budget.start_date else None,
            'end_date': budget.end_date.isoformat() if budget.end_date else None
        })
    
    return result

@view_config(route_name='get_budget', renderer='json', permission='view')
def get_budget(request):
    user_id = request.authenticated_userid
    budget_id = request.matchdict['id']
    
    budget = request.dbsession.query(Budget).filter_by(
        id=budget_id, user_id=user_id).first()
    
    if not budget:
        raise HTTPNotFound(json={'error': 'Budget not found'})
    
    return {
        'id': budget.id,
        'total': budget.total,
        'start_date': budget.start_date.isoformat() if budget.start_date else None,
        'end_date': budget.end_date.isoformat() if budget.end_date else None
    }

@view_config(route_name='add_budget', renderer='json', permission='view')
def add_budget(request):
    user_id = request.authenticated_userid
    data = request.json_body
    
    # Validate required fields
    required_fields = ['total', 'start_date', 'end_date']
    for field in required_fields:
        if field not in data:
            raise HTTPBadRequest(json={'error': f'{field} is required'})
    
    # Parse dates
    try:
        start_date = datetime.fromisoformat(data['start_date'].replace('Z', '+00:00'))
        end_date = datetime.fromisoformat(data['end_date'].replace('Z', '+00:00'))
    except ValueError:
        raise HTTPBadRequest(json={'error': 'Invalid date format'})
    
    # Validate date range
    if end_date <= start_date:
        raise HTTPBadRequest(json={'error': 'End date must be after start date'})
    
    # Create new budget
    new_budget = Budget(
        user_id=user_id,
        total=data['total'],
        start_date=start_date,
        end_date=end_date
    )
    
    request.dbsession.add(new_budget)
    request.dbsession.flush()
    
    return HTTPCreated(json={
        'id': new_budget.id,
        'total': new_budget.total,
        'start_date': new_budget.start_date.isoformat(),
        'end_date': new_budget.end_date.isoformat()
    })

@view_config(route_name='update_budget', renderer='json', permission='view')
def update_budget(request):
    user_id = request.authenticated_userid
    budget_id = request.matchdict['id']
    data = request.json_body
    
    # Find the budget
    budget = request.dbsession.query(Budget).filter_by(
        id=budget_id, user_id=user_id).first()
    
    if not budget:
        raise HTTPNotFound(json={'error': 'Budget not found'})
    
    # Update fields
    if 'total' in data:
        budget.total = data['total']
    
    if 'start_date' in data:
        try:
            budget.start_date = datetime.fromisoformat(data['start_date'].replace('Z', '+00:00'))
        except ValueError:
            raise HTTPBadRequest(json={'error': 'Invalid start date format'})
    
    if 'end_date' in data:
        try:
            budget.end_date = datetime.fromisoformat(data['end_date'].replace('Z', '+00:00'))
        except ValueError:
            raise HTTPBadRequest(json={'error': 'Invalid end date format'})
    
    # Validate date range
    if budget.end_date <= budget.start_date:
        raise HTTPBadRequest(json={'error': 'End date must be after start date'})
    
    request.dbsession.flush()
    
    return {
        'id': budget.id,
        'total': budget.total,
        'start_date': budget.start_date.isoformat(),
        'end_date': budget.end_date.isoformat()
    }

@view_config(route_name='delete_budget', renderer='json', permission='view')
def delete_budget(request):
    user_id = request.authenticated_userid
    budget_id = request.matchdict['id']
    
    # Find the budget
    budget = request.dbsession.query(Budget).filter_by(
        id=budget_id, user_id=user_id).first()
    
    if not budget:
        raise HTTPNotFound(json={'error': 'Budget not found'})
    
    # Delete the budget
    request.dbsession.delete(budget)
    
    return HTTPNoContent()
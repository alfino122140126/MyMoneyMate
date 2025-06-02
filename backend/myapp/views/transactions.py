from pyramid.view import view_config
from pyramid.httpexceptions import HTTPNotFound, HTTPBadRequest, HTTPCreated, HTTPNoContent
from datetime import datetime

from ..models.transaction import Transaction

@view_config(route_name='get_transactions', renderer='json', permission='view')
def get_transactions(request):
    user_id = request.authenticated_userid
    transactions = request.dbsession.query(Transaction).filter_by(user_id=user_id).all()
    
    result = []
    for tx in transactions:
        result.append({
            'id': tx.id,
            'amount': tx.amount,
            'description': tx.description,
            'date': tx.date.isoformat() if tx.date else None,
            'category_id': tx.category_id
        })
    
    return result

@view_config(route_name='get_transaction', renderer='json', permission='view')
def get_transaction(request):
    user_id = request.authenticated_userid
    transaction_id = request.matchdict['id']
    
    transaction = request.dbsession.query(Transaction).filter_by(
        id=transaction_id, user_id=user_id).first()
    
    if not transaction:
        raise HTTPNotFound(json={'error': 'Transaction not found'})
    
    return {
        'id': transaction.id,
        'amount': transaction.amount,
        'description': transaction.description,
        'date': transaction.date.isoformat() if transaction.date else None,
        'category_id': transaction.category_id
    }

@view_config(route_name='add_transaction', renderer='json', permission='view')
def add_transaction(request):
    user_id = request.authenticated_userid
    data = request.json_body
    
    # Validate required fields
    if 'amount' not in data:
        raise HTTPBadRequest(json={'error': 'Amount is required'})
    
    # Parse date if provided
    date = datetime.utcnow()
    if 'date' in data and data['date']:
        try:
            date = datetime.fromisoformat(data['date'].replace('Z', '+00:00'))
        except ValueError:
            raise HTTPBadRequest(json={'error': 'Invalid date format'})
    
    # Create new transaction
    new_transaction = Transaction(
        user_id=user_id,
        amount=data['amount'],
        description=data.get('description', ''),
        date=date,
        category_id=data.get('category_id')
    )
    
    request.dbsession.add(new_transaction)
    request.dbsession.flush()
    
    return HTTPCreated(json={
        'id': new_transaction.id,
        'amount': new_transaction.amount,
        'description': new_transaction.description,
        'date': new_transaction.date.isoformat() if new_transaction.date else None,
        'category_id': new_transaction.category_id
    })

@view_config(route_name='update_transaction', renderer='json', permission='view')
def update_transaction(request):
    user_id = request.authenticated_userid
    transaction_id = request.matchdict['id']
    data = request.json_body
    
    # Find the transaction
    transaction = request.dbsession.query(Transaction).filter_by(
        id=transaction_id, user_id=user_id).first()
    
    if not transaction:
        raise HTTPNotFound(json={'error': 'Transaction not found'})
    
    # Update fields
    if 'amount' in data:
        transaction.amount = data['amount']
    
    if 'description' in data:
        transaction.description = data['description']
    
    if 'date' in data and data['date']:
        try:
            transaction.date = datetime.fromisoformat(data['date'].replace('Z', '+00:00'))
        except ValueError:
            raise HTTPBadRequest(json={'error': 'Invalid date format'})
    
    if 'category_id' in data:
        transaction.category_id = data['category_id']
    
    request.dbsession.flush()
    
    return {
        'id': transaction.id,
        'amount': transaction.amount,
        'description': transaction.description,
        'date': transaction.date.isoformat() if transaction.date else None,
        'category_id': transaction.category_id
    }

@view_config(route_name='delete_transaction', renderer='json', permission='view')
def delete_transaction(request):
    user_id = request.authenticated_userid
    transaction_id = request.matchdict['id']
    
    # Find the transaction
    transaction = request.dbsession.query(Transaction).filter_by(
        id=transaction_id, user_id=user_id).first()
    
    if not transaction:
        raise HTTPNotFound(json={'error': 'Transaction not found'})
    
    # Delete the transaction
    request.dbsession.delete(transaction)
    
    return HTTPNoContent()
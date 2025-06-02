import pytest
from datetime import datetime
from pyramid import testing
from pyramid.httpexceptions import HTTPNotFound, HTTPBadRequest

from myapp.views.transactions import (
    get_transactions, get_transaction, add_transaction,
    update_transaction, delete_transaction
)

class TestTransactionViews:
    
    def test_get_transactions(self, dummy_request, test_user, test_transaction):
        # Set authenticated user
        dummy_request.authenticated_userid = test_user.id
        
        response = get_transactions(dummy_request)
        
        assert isinstance(response, list)
        assert len(response) == 1
        assert response[0]['id'] == test_transaction.id
        assert response[0]['amount'] == 100.0
        assert response[0]['description'] == 'Test Transaction'
        assert 'date' in response[0]
        assert response[0]['category_id'] == test_transaction.category_id
    
    def test_get_transaction(self, dummy_request, test_user, test_transaction):
        # Set authenticated user and transaction ID
        dummy_request.authenticated_userid = test_user.id
        dummy_request.matchdict = {'id': test_transaction.id}
        
        response = get_transaction(dummy_request)
        
        assert response['id'] == test_transaction.id
        assert response['amount'] == 100.0
        assert response['description'] == 'Test Transaction'
        assert 'date' in response
        assert response['category_id'] == test_transaction.category_id
    
    def test_get_transaction_not_found(self, dummy_request, test_user):
        # Set authenticated user and non-existent transaction ID
        dummy_request.authenticated_userid = test_user.id
        dummy_request.matchdict = {'id': 999}  # Non-existent ID
        
        with pytest.raises(HTTPNotFound) as excinfo:
            get_transaction(dummy_request)
        
        assert 'error' in excinfo.value.json
        assert 'not found' in excinfo.value.json['error']
    
    def test_add_transaction(self, dummy_request, test_user, test_category):
        # Set authenticated user and transaction data
        dummy_request.authenticated_userid = test_user.id
        dummy_request.json_body = {
            'amount': 200.0,
            'description': 'New Transaction',
            'category_id': test_category.id
        }
        
        response = add_transaction(dummy_request)
        
        assert response.status_code == 201
        assert 'id' in response.json
        assert response.json['amount'] == 200.0
        assert response.json['description'] == 'New Transaction'
        assert 'date' in response.json
        assert response.json['category_id'] == test_category.id
    
    def test_add_transaction_missing_amount(self, dummy_request, test_user):
        # Set authenticated user and incomplete transaction data
        dummy_request.authenticated_userid = test_user.id
        dummy_request.json_body = {
            'description': 'New Transaction'
            # Missing amount
        }
        
        with pytest.raises(HTTPBadRequest) as excinfo:
            add_transaction(dummy_request)
        
        assert 'error' in excinfo.value.json
        assert 'Amount is required' in excinfo.value.json['error']
    
    def test_update_transaction(self, dummy_request, test_user, test_transaction):
        # Set authenticated user, transaction ID, and update data
        dummy_request.authenticated_userid = test_user.id
        dummy_request.matchdict = {'id': test_transaction.id}
        dummy_request.json_body = {
            'amount': 150.0,
            'description': 'Updated Transaction'
        }
        
        response = update_transaction(dummy_request)
        
        assert response['id'] == test_transaction.id
        assert response['amount'] == 150.0
        assert response['description'] == 'Updated Transaction'
        assert 'date' in response
        assert response['category_id'] == test_transaction.category_id
    
    def test_update_transaction_not_found(self, dummy_request, test_user):
        # Set authenticated user, non-existent transaction ID, and update data
        dummy_request.authenticated_userid = test_user.id
        dummy_request.matchdict = {'id': 999}  # Non-existent ID
        dummy_request.json_body = {
            'amount': 150.0
        }
        
        with pytest.raises(HTTPNotFound) as excinfo:
            update_transaction(dummy_request)
        
        assert 'error' in excinfo.value.json
        assert 'not found' in excinfo.value.json['error']
    
    def test_delete_transaction(self, dummy_request, test_user, test_transaction):
        # Set authenticated user and transaction ID
        dummy_request.authenticated_userid = test_user.id
        dummy_request.matchdict = {'id': test_transaction.id}
        
        response = delete_transaction(dummy_request)
        
        assert response.status_code == 204
        
        # Verify transaction was deleted
        from myapp.models.transaction import Transaction
        transaction = dummy_request.dbsession.query(Transaction).filter_by(id=test_transaction.id).first()
        assert transaction is None
    
    def test_delete_transaction_not_found(self, dummy_request, test_user):
        # Set authenticated user and non-existent transaction ID
        dummy_request.authenticated_userid = test_user.id
        dummy_request.matchdict = {'id': 999}  # Non-existent ID
        
        with pytest.raises(HTTPNotFound) as excinfo:
            delete_transaction(dummy_request)
        
        assert 'error' in excinfo.value.json
        assert 'not found' in excinfo.value.json['error']
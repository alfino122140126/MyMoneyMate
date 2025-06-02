# backend/src/routes.py
def includeme(config):
    config.add_route('health', '/health') 
    config.add_route('auth_register', '/api/auth/register')
    config.add_route('auth_login', '/api/auth/login')
    
    # Tambahkan rute-rute lain untuk fitur Anda di sini nanti
    # Contoh:
    # config.add_route('list_transactions', '/api/transactions')
    # config.add_route('get_transaction', '/api/transactions/{id}')
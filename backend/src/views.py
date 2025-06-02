# backend/src/views.py
from pyramid.view import view_config
from pyramid.request import Request
from pyramid.httpexceptions import (
    HTTPBadRequest,
    HTTPConflict,
    HTTPCreated,
    HTTPInternalServerError,
    HTTPUnauthorized 
)
import jwt
import os
import datetime

# Impor model dari src.models (yang sekarang mengambil dari file masing-masing via src/models/__init__.py)
from src.models import User 
# Jika Anda menggunakan model lain di views, impor juga di sini, contoh:
# from src.models import Account 

from passlib.context import CryptContext
from sqlalchemy.exc import IntegrityError
from sqlalchemy import or_

# Konfigurasi Passlib untuk hashing password
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT_SECRET akan diambil dari environment variable
JWT_SECRET = os.getenv('JWT_SECRET') 

@view_config(route_name='health', renderer='json', request_method='GET')
def health_view(request: Request):
    return {'status': 'ok'}

@view_config(route_name='auth_register', renderer='json', request_method='POST')
def register(request: Request):
    try:
        data = request.json_body
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        if not all([username, email, password]):
            request.response.status_code = HTTPBadRequest.code 
            return {'error': 'Username, email, dan password dibutuhkan.'}

        if len(password) < 6:
            request.response.status_code = HTTPBadRequest.code
            return {'error': 'Password minimal harus 6 karakter.'}
        if "@" not in email or "." not in email: 
            request.response.status_code = HTTPBadRequest.code
            return {'error': 'Format email tidak valid.'}
        if len(username) < 3:
            request.response.status_code = HTTPBadRequest.code
            return {'error': 'Username minimal harus 3 karakter.'}

        try:
            existing_user = request.db.query(User).filter(
                or_(User.username == username, User.email == email)
            ).first()
        except Exception as db_err:
            print(f"Database error saat cek existing user: {db_err}")
            raise HTTPInternalServerError(json_body={'error': 'Kesalahan pada server saat memvalidasi data.'})

        if existing_user:
            error_message = "Username atau email sudah digunakan."
            if existing_user.username == username and existing_user.email == email:
                error_message = "Username dan Email sudah digunakan."
            elif existing_user.username == username:
                error_message = "Username sudah digunakan."
            elif existing_user.email == email:
                error_message = "Email sudah digunakan."
            
            request.response.status_code = HTTPConflict.code
            return {'error': error_message}

        hashed_password = pwd_context.hash(password)
        new_user = User(
            username=username,
            email=email,
            hashed_password=hashed_password
        )
        
        try:
            request.db.add(new_user)
            request.db.flush() 
        except IntegrityError as e: 
            request.db.rollback() 
            print(f"IntegrityError saat registrasi (kemungkinan race condition): {e.orig}") 
            request.response.status_code = HTTPConflict.code
            return {'error': 'Username atau email sudah ada (konflik data).'}
        except Exception as db_add_err:
            request.db.rollback()
            print(f"Database error saat menambah user baru: {db_add_err}")
            raise HTTPInternalServerError(json_body={'error': 'Kesalahan pada server saat menyimpan pengguna.'})
        
        request.response.status_code = HTTPCreated.code
        return {
            'message': 'Registrasi berhasil!',
            'user': { 
                'id': new_user.id, 
                'username': new_user.username,
                'email': new_user.email,
                'created_at': new_user.created_at.isoformat() if new_user.created_at else None
            }
        }

    except HTTPBadRequest as e: 
        request.response.status_code = e.status_code
        return e.json_body
    except HTTPConflict as e: 
        request.response.status_code = e.status_code
        return e.json_body
    except Exception as e: 
        if hasattr(request.db, 'is_active') and request.db.is_active:
             request.db.rollback()
        print(f"Error internal tidak terduga saat registrasi: {type(e).__name__}: {e}") 
        if not isinstance(e, (HTTPBadRequest, HTTPConflict, HTTPCreated, HTTPInternalServerError, HTTPUnauthorized)):
            request.response.status_code = HTTPInternalServerError.code
            return {'error': 'Terjadi kesalahan internal pada server.'}
        raise

@view_config(route_name='auth_login', renderer='json', request_method='POST')
def login(request: Request):
    current_jwt_secret = JWT_SECRET 
    if not current_jwt_secret:
        print("KRITIS: JWT_SECRET tidak diset di environment aplikasi!") 
        raise HTTPInternalServerError(json_body={'error': 'Konfigurasi server penting tidak lengkap.'})

    try:
        data = request.json_body
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            raise HTTPUnauthorized(json_body={'error': 'Email dan password dibutuhkan.'})

        try:
            user_from_db = request.db.query(User).filter(User.email == email).first()
        except Exception as db_err:
            print(f"Database error saat login mencari user: {db_err}")
            raise HTTPInternalServerError(json_body={'error': 'Kesalahan server saat mengambil data pengguna.'})

        if not user_from_db or not pwd_context.verify(password, user_from_db.hashed_password):
            raise HTTPUnauthorized(json_body={'error': 'Email atau password salah.'})
        
        user_id_from_db = user_from_db.id 

        payload = {
            'user_id': user_id_from_db,
            'email': user_from_db.email, 
            'iat': datetime.datetime.utcnow(),
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1) 
        }
        access_token = jwt.encode(payload, current_jwt_secret, algorithm='HS256')
        
        return {'access_token': access_token, 'user_id': user_id_from_db, 'email': user_from_db.email}

    except HTTPUnauthorized as e:
        request.response.status_code = e.status_code
        return e.json_body
    except Exception as e:
        print(f"Error internal saat login: {type(e).__name__}: {e}")
        request.response.status_code = HTTPInternalServerError.code 
        return {'error': 'Terjadi kesalahan internal saat mencoba login.'}
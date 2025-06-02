# Financial Management Backend API

A RESTful API built with Python Pyramid framework for managing personal finances, including transactions, budgets, and categories.

## Features

- User authentication with JWT tokens
- Transaction management (create, read, update, delete)
- Budget tracking
- Category organization
- RESTful API endpoints
- SQLAlchemy ORM integration
- CORS support for frontend integration

## Project Structure

```
backend/
├── setup.py                # Package configuration
├── development.ini         # Development configuration
├── requirements.txt        # Python dependencies
├── myapp/                  # Application package
│   ├── __init__.py         # Package initialization
│   ├── models/             # SQLAlchemy models
│   ├── views/              # View functions for API endpoints
│   ├── scripts/            # Utility scripts
│   ├── routes.py           # Route definitions
│   └── security.py         # Authentication configuration
└── tests/                  # Test package
    ├── conftest.py         # Test fixtures
    ├── test_auth.py        # Authentication tests
    ├── test_transactions.py # Transaction tests
    ├── test_budgets.py     # Budget tests
    └── test_categories.py  # Category tests
```

## Installation

1. Create a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install the package in development mode:
   ```
   pip install -e .
   ```

3. Initialize the database:
   ```
   initialize_db development.ini --reset-db
   ```

4. Start the development server:
   ```
   pserve development.ini --reload
   ```

## Environment Variables

- `PYRAMID_SETTINGS`: Path to configuration file (default: development.ini)
- `JWT_SECRET`: Secret key for JWT token generation
- `DATABASE_URL`: Database connection URL (overrides sqlalchemy.url in .ini file)

## API Endpoints

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and get JWT token

### Transactions

- `GET /transactions` - Get all transactions for the authenticated user
- `POST /transactions` - Create a new transaction
- `GET /transactions/{id}` - Get a specific transaction
- `PUT /transactions/{id}` - Update a transaction
- `DELETE /transactions/{id}` - Delete a transaction

### Budgets

- `GET /budgets` - Get all budgets for the authenticated user
- `POST /budgets` - Create a new budget
- `GET /budgets/{id}` - Get a specific budget
- `PUT /budgets/{id}` - Update a budget
- `DELETE /budgets/{id}` - Delete a budget

### Categories

- `GET /categories` - Get all categories for the authenticated user
- `POST /categories` - Create a new category
- `GET /categories/{id}` - Get a specific category
- `PUT /categories/{id}` - Update a category
- `DELETE /categories/{id}` - Delete a category

## Running Tests

```
pytest --cov=myapp
```

## Deployment

For production deployment, use a proper WSGI server like Gunicorn or Waitress:

```
pip install waitress
waitress-serve --port=8000 myapp:main
```

With Nginx as a reverse proxy for handling SSL/TLS termination and serving static files.
# MealMate Backend API

FastAPI-based backend for the MealMate recipe management application.

## Features

- **Recipe Management**: CRUD operations for recipes from Indian Food Dataset
- **User Authentication**: JWT-based authentication with registration/login
- **Smart Pantry**: Track ingredients and find matching recipes
- **Meal Planning**: Create and manage weekly meal plans
- **Search & Filtering**: Advanced recipe search with multiple filters
- **Favorites & Ratings**: User can favorite and rate recipes

## Quick Start

### Prerequisites

- Python 3.8+
- pip

### Installation

1. **Automated Setup** (Recommended):
```bash
cd backend
python setup.py
```

2. **Manual Setup**:
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Unix/MacOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create directories
mkdir logs uploads
```

### Configuration

1. Copy the environment file:
```bash
cp .env.example .env
```

2. Edit `.env` with your configuration (the default values should work for development)

### Database Setup

Load the Indian Food Dataset:
```bash
python -m app.scripts.load_dataset
```

### Running the Server

```bash
# Method 1: Direct
python main.py

# Method 2: Using uvicorn
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- **API**: http://localhost:8000
- **Documentation**: http://localhost:8000/docs
- **Alternative Docs**: http://localhost:8000/redoc

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - Logout user

### Recipes
- `GET /api/v1/recipes/` - Get recipes with filtering
- `GET /api/v1/recipes/{id}` - Get specific recipe
- `POST /api/v1/recipes/{id}/favorite` - Toggle favorite
- `POST /api/v1/recipes/{id}/rate` - Rate recipe
- `GET /api/v1/recipes/cuisines/list` - Get available cuisines

### Users
- `GET /api/v1/users/me` - Get current user profile
- `PUT /api/v1/users/me` - Update user profile

### Pantry
- `GET /api/v1/pantry/items` - Get pantry items
- `POST /api/v1/pantry/items` - Add pantry item
- `DELETE /api/v1/pantry/items/{id}` - Remove pantry item

### Meal Plans
- `GET /api/v1/meal-plans/` - Get meal plans
- `POST /api/v1/meal-plans/` - Create meal plan
- `GET /api/v1/meal-plans/{id}` - Get specific meal plan
- `POST /api/v1/meal-plans/{id}/items` - Add meal to plan

### Search
- `GET /api/v1/search/recipes` - Search recipes
- `GET /api/v1/search/recipes/by-pantry` - Find recipes by pantry
- `GET /api/v1/search/ingredients` - Search ingredients

## Project Structure

```
backend/
├── app/
│   ├── api/v1/endpoints/     # API route handlers
│   ├── core/                 # Core functionality (config, database, security)
│   ├── models/               # SQLAlchemy models
│   ├── schemas/              # Pydantic schemas
│   ├── scripts/              # Utility scripts
│   └── main.py              # FastAPI application
├── logs/                     # Log files
├── uploads/                  # File uploads
├── main.py                   # Application entry point
├── requirements.txt          # Python dependencies
└── setup.py                 # Setup script
```

## Development

### Code Style

```bash
# Format code
black app/
isort app/

# Lint code
flake8 app/
mypy app/
```

### Testing

```bash
pytest
```

### Database Migrations

```bash
# Generate migration
alembic revision --autogenerate -m "Description"

# Apply migration
alembic upgrade head
```

## Environment Variables

Key environment variables (see `.env.example` for full list):

- `DATABASE_URL`: Database connection string
- `SECRET_KEY`: JWT secret key (must be 32+ characters)
- `FRONTEND_URL`: Frontend URL for CORS
- `DATASET_PATH`: Path to the Indian Food Dataset CSV

## Troubleshooting

### Common Issues

1. **Import Errors**: Make sure virtual environment is activated
2. **Database Errors**: Ensure SQLite permissions or PostgreSQL connection
3. **Dataset Loading**: Verify CSV file path in `DATASET_PATH`
4. **CORS Issues**: Check `ALLOWED_ORIGINS` in configuration

### Logs

Check logs in `logs/mealmate.log` for detailed error information.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes
4. Add tests
5. Submit a pull request

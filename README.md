# Meal Mate 🍽️

A comprehensive meal planning and recipe management application that helps users discover recipes based on their pantry ingredients, plan meals, and track their cooking journey.

## Features

- **Smart Pantry Management**: Add ingredients to your pantry and get recipe suggestions
- **Recipe Discovery**: Find recipes based on available ingredients using ML-powered matching
- **Meal Planning**: Plan your weekly meals with nutritional optimization
- **Favorites System**: Save and organize your favorite recipes
- **Cuisine Explorer**: Discover recipes by cuisine type
- **Nutritional Analysis**: Get detailed nutritional information for recipes
- **User Authentication**: Secure user accounts with JWT authentication

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Radix UI** components
- **React Router** for navigation
- **TanStack Query** for data fetching
- **React Hook Form** for form handling

### Backend
- **FastAPI** with Python
- **SQLAlchemy** with async support
- **SQLite** (development) / **PostgreSQL** (production)
- **JWT** authentication
- **Pydantic** for data validation
- **Scikit-learn** for ML models

### ML Models
- **Recipe-Pantry Matching Engine**: TF-IDF + Cosine Similarity
- **Recipe Recommendation System**: Collaborative filtering
- **Meal Planning Optimizer**: Nutritional optimization
- **Nutritional Analysis Engine**: Ingredient nutrition mapping

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Python 3.11+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd meal-mate
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

5. **Start the development servers**

   Frontend (Terminal 1):
   ```bash
   npm run dev
   ```

   Backend (Terminal 2):
   ```bash
   cd backend
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

## Project Structure

```
meal-mate/
├── src/                    # Frontend source code
│   ├── components/        # Reusable UI components
│   ├── pages/            # Page components
│   ├── lib/              # Utility functions and API clients
│   ├── hooks/            # Custom React hooks
│   └── ...
├── backend/               # Backend source code
│   ├── app/              # FastAPI application
│   │   ├── routers/     # API route handlers
│   │   ├── services/    # Business logic and ML services
│   │   ├── models.py    # Database models
│   │   └── ...
│   └── requirements.txt  # Python dependencies
├── ml_models/            # Trained ML models and data
├── datasets/             # CSV data files
└── ...
```

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/pantry/` - Get user's pantry items
- `POST /api/pantry/` - Add pantry item
- `DELETE /api/pantry/{id}` - Remove pantry item
- `GET /api/pantry/recipes` - Get matching recipes
- `GET /api/search/recipes` - Search recipes
- `GET /api/favorites/` - Get user's favorites
- `POST /api/favorites/` - Add favorite recipe
- `DELETE /api/favorites/{id}` - Remove favorite

## ML Models

The application uses several pre-trained ML models:

1. **Recipe-Pantry Matching**: Matches pantry ingredients with recipes using TF-IDF vectorization
2. **Recipe Recommendation**: Collaborative filtering for personalized recommendations
3. **Meal Planning**: Optimizes meal plans based on nutritional requirements
4. **Nutritional Analysis**: Maps ingredients to nutritional data

## Development

### Frontend Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

### Backend Development
```bash
cd backend
uvicorn app.main:app --reload    # Start development server
python -m pytest                 # Run tests (when implemented)
```

### Database Migrations
```bash
cd backend
alembic upgrade head            # Apply migrations
alembic revision --autogenerate -m "description"  # Create new migration
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Recipe data sourced from various culinary websites
- Nutritional data from USDA Food Database
- ML models trained on curated recipe datasets
- UI components from Radix UI and Tailwind CSS


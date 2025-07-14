# MealMate

A modern recipe management application with React frontend and FastAPI backend, featuring authentic Indian recipes.

## 🚀 Features

- **Recipe Management**: Browse 50,000+ authentic Indian recipes
- **Smart Pantry**: Track ingredients and get recipe suggestions
- **Meal Planning**: Plan weekly meals and generate shopping lists
- **User Authentication**: Secure registration and login
- **Advanced Search**: Filter by cuisine, difficulty, time, and ingredients
- **Favorites & Ratings**: Save and rate your favorite recipes

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **shadcn/ui** for components
- **React Router** for navigation
- **React Query** for data fetching

### Backend
- **FastAPI** with Python
- **SQLAlchemy** for database ORM
- **JWT** authentication
- **Pydantic** for data validation
- **SQLite/PostgreSQL** support

## 📋 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- Python 3.8+
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/nukuldhake/Meal-Mate.git
cd Meal-Mate
```

### 2. Backend Setup

```bash
cd backend

# Automated setup (recommended)
python setup.py

# OR Manual setup
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your settings

# Load the dataset
python -m app.scripts.load_dataset

# Start the backend server
python main.py
```

Backend will be available at: http://localhost:8000

### 3. Frontend Setup

```bash
# In a new terminal, from project root
npm install

# Configure environment
cp .env.example .env
# Edit .env if needed (default should work)

# Start the frontend
npm run dev
```

Frontend will be available at: http://localhost:5173

## 📖 API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🗂️ Project Structure

```
mealmate/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/            # API routes
│   │   ├── core/           # Core functionality
│   │   ├── models/         # Database models
│   │   ├── schemas/        # Pydantic schemas
│   │   └── scripts/        # Utility scripts
│   ├── requirements.txt
│   └── main.py
├── src/                    # React frontend
│   ├── components/         # Reusable components
│   ├── pages/             # Page components
│   ├── lib/               # Utilities and API client
│   ├── contexts/          # React contexts
│   └── hooks/             # Custom hooks
├── public/                # Static assets
└── Cleaned_Indian_Food_Dataset.csv
```

## 🔧 Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Backend
- `python main.py` - Start backend server
- `python -m app.scripts.load_dataset` - Load recipe dataset
- `python setup.py` - Automated setup

## 🌟 Key Features Explained

### Smart Pantry
- Add ingredients you have at home
- Get recipe suggestions based on available ingredients
- Track expiration dates and quantities

### Recipe Discovery
- Browse 50,000+ authentic Indian recipes
- Filter by cuisine (North Indian, South Indian, Gujarati, etc.)
- Search by ingredients, cooking time, or difficulty

### Meal Planning
- Plan weekly meals
- Auto-generate meal plans based on preferences
- Create shopping lists from meal plans

### User Experience
- Responsive design for all devices
- Dark/light theme support
- Offline recipe viewing
- Recipe favorites and ratings

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests if applicable
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📝 Development Guidelines

- Follow TypeScript best practices
- Use conventional commit messages
- Add tests for new features
- Update documentation as needed

## 🐛 Troubleshooting

### Common Issues

1. **Backend won't start**: Check Python version and virtual environment
2. **Frontend build errors**: Clear node_modules and reinstall
3. **Database errors**: Ensure dataset is loaded correctly
4. **CORS issues**: Check backend CORS configuration

### Getting Help

- Check the [Issues](https://github.com/nukuldhake/Meal-Mate/issues) page
- Review the API documentation at `/docs`
- Check logs in `backend/logs/mealmate.log`

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Indian Food Dataset for providing authentic recipes
- shadcn/ui for beautiful components
- FastAPI and React communities for excellent documentation

---

**Happy Cooking! 🍳**

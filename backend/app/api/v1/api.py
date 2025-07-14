"""
Main API router for version 1
"""

from fastapi import APIRouter

from app.api.v1.endpoints import auth, users, recipes, pantry, meal_plans, search

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(recipes.router, prefix="/recipes", tags=["recipes"])
api_router.include_router(pantry.router, prefix="/pantry", tags=["pantry"])
api_router.include_router(meal_plans.router, prefix="/meal-plans", tags=["meal-plans"])
api_router.include_router(search.router, prefix="/search", tags=["search"])

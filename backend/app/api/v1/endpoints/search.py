"""
Search endpoints for recipes and ingredients
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, func

from app.core.database import get_db
from app.core.dependencies import get_current_user_optional
from app.models.user import User
from app.models.recipe import Recipe, Ingredient
from app.models.pantry import PantryItem

router = APIRouter()


@router.get("/recipes")
async def search_recipes(
    query: str = Query(..., min_length=2, description="Search query"),
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """
    Search recipes by name, ingredients, or cuisine
    """
    search_filter = or_(
        Recipe.name.ilike(f"%{query}%"),
        Recipe.cuisine.ilike(f"%{query}%"),
        Recipe.description.ilike(f"%{query}%"),
        Recipe.instructions.ilike(f"%{query}%")
    )
    
    recipes = db.query(Recipe).filter(
        and_(Recipe.is_active == True, search_filter)
    ).limit(20).all()
    
    return {"recipes": recipes, "total": len(recipes)}


@router.get("/recipes/by-pantry")
async def search_recipes_by_pantry(
    current_user: User = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """
    Find recipes based on user's pantry ingredients
    """
    if not current_user:
        return {"recipes": [], "message": "Login required to use pantry matching"}
    
    # Get user's pantry ingredients
    pantry_ingredients = db.query(PantryItem.ingredient_id).filter(
        PantryItem.user_id == current_user.id
    ).subquery()
    
    # Find recipes that use these ingredients
    # This is a simplified version - you might want to implement more sophisticated matching
    recipes = db.query(Recipe).join(Recipe.ingredients).filter(
        Ingredient.id.in_(pantry_ingredients)
    ).distinct().limit(20).all()
    
    return {"recipes": recipes, "total": len(recipes)}


@router.get("/ingredients")
async def search_ingredients(
    query: str = Query(..., min_length=2, description="Search query"),
    db: Session = Depends(get_db)
):
    """
    Search ingredients
    """
    ingredients = db.query(Ingredient).filter(
        Ingredient.name.ilike(f"%{query}%")
    ).limit(20).all()
    
    return {"ingredients": ingredients, "total": len(ingredients)}

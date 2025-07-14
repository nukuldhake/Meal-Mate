"""
Recipe endpoints for managing recipes from the Indian Food Dataset
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, func

from app.core.database import get_db
from app.core.dependencies import get_current_user_optional, get_current_user
from app.models.user import User
from app.models.recipe import Recipe, Ingredient, UserFavoriteRecipe, CookingHistory
from app.schemas.recipe import (
    RecipeResponse,
    RecipeCreate,
    RecipeUpdate,
    RecipeSearchFilters,
    RecipeSearchResponse,
    RecipeRating,
    IngredientResponse
)

router = APIRouter()


@router.get("/", response_model=RecipeSearchResponse)
async def get_recipes(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    cuisine: Optional[str] = Query(None, description="Filter by cuisine"),
    difficulty: Optional[str] = Query(None, regex=r'^(easy|medium|hard)$'),
    max_time: Optional[int] = Query(None, ge=1, le=1440, description="Maximum cooking time in minutes"),
    meal_type: Optional[str] = Query(None, regex=r'^(breakfast|lunch|dinner|snack)$'),
    spice_level: Optional[str] = Query(None, regex=r'^(mild|medium|hot|very_hot)$'),
    vegetarian: Optional[bool] = Query(None, description="Filter vegetarian recipes"),
    search: Optional[str] = Query(None, description="Search in recipe names and ingredients"),
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """
    Get recipes with filtering and pagination
    """
    # Build query
    query = db.query(Recipe).filter(Recipe.is_active == True)
    
    # Apply filters
    if cuisine:
        query = query.filter(Recipe.cuisine.ilike(f"%{cuisine}%"))
    
    if difficulty:
        query = query.filter(Recipe.difficulty == difficulty)
    
    if max_time:
        query = query.filter(Recipe.total_time_mins <= max_time)
    
    if meal_type:
        query = query.filter(Recipe.meal_type == meal_type)
    
    if spice_level:
        query = query.filter(Recipe.spice_level == spice_level)
    
    if vegetarian is not None:
        if vegetarian:
            query = query.filter(Recipe.tags.contains("vegetarian"))
        else:
            query = query.filter(~Recipe.tags.contains("vegetarian"))
    
    if search:
        search_filter = or_(
            Recipe.name.ilike(f"%{search}%"),
            Recipe.description.ilike(f"%{search}%"),
            Recipe.instructions.ilike(f"%{search}%")
        )
        query = query.filter(search_filter)
    
    # Get total count
    total_count = query.count()
    
    # Apply pagination
    offset = (page - 1) * page_size
    recipes = query.offset(offset).limit(page_size).all()
    
    # Add favorite status for authenticated users
    recipe_responses = []
    for recipe in recipes:
        recipe_dict = recipe.__dict__.copy()
        recipe_dict['ingredients'] = []  # Will be populated separately if needed
        
        if current_user:
            is_favorite = db.query(UserFavoriteRecipe).filter(
                and_(
                    UserFavoriteRecipe.user_id == current_user.id,
                    UserFavoriteRecipe.recipe_id == recipe.id
                )
            ).first() is not None
            recipe_dict['is_favorite'] = is_favorite
        else:
            recipe_dict['is_favorite'] = None
        
        recipe_responses.append(RecipeResponse(**recipe_dict))
    
    # Calculate pagination info
    total_pages = (total_count + page_size - 1) // page_size
    
    return RecipeSearchResponse(
        recipes=recipe_responses,
        total_count=total_count,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
        filters_applied=RecipeSearchFilters(
            cuisine=cuisine,
            difficulty=difficulty,
            max_time=max_time,
            meal_type=meal_type,
            spice_level=spice_level,
            vegetarian=vegetarian,
            query=search
        )
    )


@router.get("/{recipe_id}", response_model=RecipeResponse)
async def get_recipe(
    recipe_id: int,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """
    Get a specific recipe by ID
    """
    recipe = db.query(Recipe).filter(
        and_(Recipe.id == recipe_id, Recipe.is_active == True)
    ).first()
    
    if not recipe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipe not found"
        )
    
    # Increment view count
    recipe.view_count += 1
    db.commit()
    
    # Get recipe ingredients
    ingredients = []
    for ingredient in recipe.ingredients:
        # Get quantity and unit from the association table
        # This is a simplified version - you might need to adjust based on your exact schema
        ingredients.append({
            "ingredient_id": ingredient.id,
            "ingredient_name": ingredient.name,
            "quantity": None,  # You'll need to get this from the association table
            "unit": None       # You'll need to get this from the association table
        })
    
    recipe_dict = recipe.__dict__.copy()
    recipe_dict['ingredients'] = ingredients
    
    # Check if user has favorited this recipe
    if current_user:
        is_favorite = db.query(UserFavoriteRecipe).filter(
            and_(
                UserFavoriteRecipe.user_id == current_user.id,
                UserFavoriteRecipe.recipe_id == recipe.id
            )
        ).first() is not None
        recipe_dict['is_favorite'] = is_favorite
    else:
        recipe_dict['is_favorite'] = None
    
    return RecipeResponse(**recipe_dict)


@router.post("/{recipe_id}/favorite")
async def toggle_favorite_recipe(
    recipe_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Toggle favorite status for a recipe
    """
    recipe = db.query(Recipe).filter(
        and_(Recipe.id == recipe_id, Recipe.is_active == True)
    ).first()
    
    if not recipe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipe not found"
        )
    
    # Check if already favorited
    existing_favorite = db.query(UserFavoriteRecipe).filter(
        and_(
            UserFavoriteRecipe.user_id == current_user.id,
            UserFavoriteRecipe.recipe_id == recipe_id
        )
    ).first()
    
    if existing_favorite:
        # Remove from favorites
        db.delete(existing_favorite)
        recipe.favorite_count = max(0, recipe.favorite_count - 1)
        is_favorite = False
        message = "Recipe removed from favorites"
    else:
        # Add to favorites
        new_favorite = UserFavoriteRecipe(
            user_id=current_user.id,
            recipe_id=recipe_id
        )
        db.add(new_favorite)
        recipe.favorite_count += 1
        is_favorite = True
        message = "Recipe added to favorites"
    
    db.commit()
    
    return {
        "message": message,
        "is_favorite": is_favorite,
        "favorite_count": recipe.favorite_count
    }


@router.post("/{recipe_id}/rate")
async def rate_recipe(
    recipe_id: int,
    rating_data: RecipeRating,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Rate a recipe
    """
    recipe = db.query(Recipe).filter(
        and_(Recipe.id == recipe_id, Recipe.is_active == True)
    ).first()
    
    if not recipe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipe not found"
        )
    
    # Check if user has already rated this recipe
    existing_rating = db.query(CookingHistory).filter(
        and_(
            CookingHistory.user_id == current_user.id,
            CookingHistory.recipe_id == recipe_id,
            CookingHistory.rating.isnot(None)
        )
    ).first()
    
    if existing_rating:
        # Update existing rating
        old_rating = existing_rating.rating
        existing_rating.rating = rating_data.rating
        existing_rating.notes = rating_data.review
        
        # Recalculate average rating
        total_rating = (recipe.rating_average * recipe.rating_count) - old_rating + rating_data.rating
        recipe.rating_average = total_rating / recipe.rating_count
    else:
        # Create new rating
        new_rating = CookingHistory(
            user_id=current_user.id,
            recipe_id=recipe_id,
            rating=rating_data.rating,
            notes=rating_data.review
        )
        db.add(new_rating)
        
        # Update recipe rating
        total_rating = (recipe.rating_average * recipe.rating_count) + rating_data.rating
        recipe.rating_count += 1
        recipe.rating_average = total_rating / recipe.rating_count
    
    db.commit()
    
    return {
        "message": "Recipe rated successfully",
        "rating": rating_data.rating,
        "average_rating": round(recipe.rating_average, 2),
        "total_ratings": recipe.rating_count
    }


@router.get("/cuisines/list")
async def get_cuisines(db: Session = Depends(get_db)):
    """
    Get list of all available cuisines
    """
    cuisines = db.query(Recipe.cuisine).filter(Recipe.is_active == True).distinct().all()
    return {"cuisines": [cuisine[0] for cuisine in cuisines if cuisine[0]]}


@router.get("/ingredients/search")
async def search_ingredients(
    query: str = Query(..., min_length=2, description="Search query for ingredients"),
    limit: int = Query(10, ge=1, le=50, description="Maximum number of results"),
    db: Session = Depends(get_db)
):
    """
    Search for ingredients
    """
    ingredients = db.query(Ingredient).filter(
        Ingredient.name.ilike(f"%{query}%")
    ).limit(limit).all()
    
    return {"ingredients": [IngredientResponse.from_orm(ingredient) for ingredient in ingredients]}

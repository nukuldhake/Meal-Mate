"""
Recipe schemas for API validation
"""

from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict, Any
from datetime import datetime


class IngredientBase(BaseModel):
    """Base ingredient schema"""
    name: str = Field(..., min_length=1, max_length=200)
    category: Optional[str] = Field(None, max_length=100)


class IngredientCreate(IngredientBase):
    """Schema for ingredient creation"""
    common_units: Optional[List[str]] = None
    calories_per_100g: Optional[float] = Field(None, ge=0)
    protein_per_100g: Optional[float] = Field(None, ge=0)
    carbs_per_100g: Optional[float] = Field(None, ge=0)
    fat_per_100g: Optional[float] = Field(None, ge=0)
    storage_tips: Optional[str] = None
    shelf_life_days: Optional[int] = Field(None, ge=0)


class IngredientResponse(IngredientBase):
    """Schema for ingredient response"""
    id: int
    common_units: Optional[List[str]] = None
    calories_per_100g: Optional[float] = None
    protein_per_100g: Optional[float] = None
    carbs_per_100g: Optional[float] = None
    fat_per_100g: Optional[float] = None
    storage_tips: Optional[str] = None
    shelf_life_days: Optional[int] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


class RecipeIngredient(BaseModel):
    """Schema for recipe ingredients with quantities"""
    ingredient_id: int
    ingredient_name: str
    quantity: Optional[str] = None
    unit: Optional[str] = None


class RecipeBase(BaseModel):
    """Base recipe schema"""
    name: str = Field(..., min_length=1, max_length=500)
    cuisine: str = Field(..., min_length=1, max_length=100)
    instructions: str = Field(..., min_length=10)
    description: Optional[str] = Field(None, max_length=2000)


class RecipeCreate(RecipeBase):
    """Schema for recipe creation"""
    translated_name: Optional[str] = Field(None, max_length=500)
    total_time_mins: Optional[int] = Field(None, ge=1, le=1440)  # Max 24 hours
    prep_time_mins: Optional[int] = Field(None, ge=0, le=720)   # Max 12 hours
    cook_time_mins: Optional[int] = Field(None, ge=0, le=720)   # Max 12 hours
    difficulty: Optional[str] = Field("medium", regex=r'^(easy|medium|hard)$')
    servings: Optional[int] = Field(4, ge=1, le=20)
    image_url: Optional[str] = Field(None, max_length=1000)
    tags: Optional[List[str]] = None
    meal_type: Optional[str] = Field(None, regex=r'^(breakfast|lunch|dinner|snack)$')
    spice_level: Optional[str] = Field(None, regex=r'^(mild|medium|hot|very_hot)$')
    ingredients: List[RecipeIngredient] = []
    
    # Nutritional information
    calories_per_serving: Optional[float] = Field(None, ge=0)
    protein_grams: Optional[float] = Field(None, ge=0)
    carbs_grams: Optional[float] = Field(None, ge=0)
    fat_grams: Optional[float] = Field(None, ge=0)


class RecipeUpdate(BaseModel):
    """Schema for recipe updates"""
    name: Optional[str] = Field(None, min_length=1, max_length=500)
    cuisine: Optional[str] = Field(None, min_length=1, max_length=100)
    instructions: Optional[str] = Field(None, min_length=10)
    description: Optional[str] = Field(None, max_length=2000)
    total_time_mins: Optional[int] = Field(None, ge=1, le=1440)
    prep_time_mins: Optional[int] = Field(None, ge=0, le=720)
    cook_time_mins: Optional[int] = Field(None, ge=0, le=720)
    difficulty: Optional[str] = Field(None, regex=r'^(easy|medium|hard)$')
    servings: Optional[int] = Field(None, ge=1, le=20)
    image_url: Optional[str] = Field(None, max_length=1000)
    tags: Optional[List[str]] = None
    meal_type: Optional[str] = Field(None, regex=r'^(breakfast|lunch|dinner|snack)$')
    spice_level: Optional[str] = Field(None, regex=r'^(mild|medium|hot|very_hot)$')
    ingredients: Optional[List[RecipeIngredient]] = None


class RecipeResponse(RecipeBase):
    """Schema for recipe response"""
    id: int
    translated_name: Optional[str] = None
    total_time_mins: Optional[int] = None
    prep_time_mins: Optional[int] = None
    cook_time_mins: Optional[int] = None
    difficulty: str
    servings: int
    ingredient_count: Optional[int] = None
    image_url: Optional[str] = None
    original_url: Optional[str] = None
    tags: Optional[List[str]] = None
    meal_type: Optional[str] = None
    spice_level: Optional[str] = None
    
    # Nutritional information
    calories_per_serving: Optional[float] = None
    protein_grams: Optional[float] = None
    carbs_grams: Optional[float] = None
    fat_grams: Optional[float] = None
    
    # Statistics
    view_count: int
    favorite_count: int
    rating_average: float
    rating_count: int
    
    # Status
    is_active: bool
    is_verified: bool
    
    # Timestamps
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    # Relationships
    ingredients: List[RecipeIngredient] = []
    is_favorite: Optional[bool] = None  # Set based on current user
    
    class Config:
        from_attributes = True


class RecipeSearchFilters(BaseModel):
    """Schema for recipe search filters"""
    query: Optional[str] = None
    cuisine: Optional[str] = None
    difficulty: Optional[str] = Field(None, regex=r'^(easy|medium|hard)$')
    max_time: Optional[int] = Field(None, ge=1, le=1440)
    meal_type: Optional[str] = Field(None, regex=r'^(breakfast|lunch|dinner|snack)$')
    spice_level: Optional[str] = Field(None, regex=r'^(mild|medium|hot|very_hot)$')
    tags: Optional[List[str]] = None
    ingredients: Optional[List[str]] = None  # Available ingredients
    max_missing_ingredients: Optional[int] = Field(None, ge=0)
    min_rating: Optional[float] = Field(None, ge=0, le=5)
    vegetarian: Optional[bool] = None
    vegan: Optional[bool] = None
    gluten_free: Optional[bool] = None


class RecipeSearchResponse(BaseModel):
    """Schema for recipe search response"""
    recipes: List[RecipeResponse]
    total_count: int
    page: int
    page_size: int
    total_pages: int
    filters_applied: RecipeSearchFilters


class RecipeRating(BaseModel):
    """Schema for recipe rating"""
    rating: int = Field(..., ge=1, le=5)
    review: Optional[str] = Field(None, max_length=1000)


class RecipeStats(BaseModel):
    """Schema for recipe statistics"""
    total_recipes: int
    recipes_by_cuisine: Dict[str, int]
    recipes_by_difficulty: Dict[str, int]
    recipes_by_meal_type: Dict[str, int]
    average_cooking_time: float
    most_popular_ingredients: List[Dict[str, Any]]

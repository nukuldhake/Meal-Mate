"""
Recipe models based on the Indian Food Dataset
"""

from sqlalchemy import Column, Integer, String, Text, Float, DateTime, Boolean, ForeignKey, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


# Association table for recipe ingredients
recipe_ingredients = Table(
    'recipe_ingredients',
    Base.metadata,
    Column('recipe_id', Integer, ForeignKey('recipes.id'), primary_key=True),
    Column('ingredient_id', Integer, ForeignKey('ingredients.id'), primary_key=True),
    Column('quantity', String(100), nullable=True),
    Column('unit', String(50), nullable=True)
)


class Recipe(Base):
    """Recipe model based on the Indian Food Dataset"""
    
    __tablename__ = "recipes"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Basic recipe information from dataset
    name = Column(String(500), nullable=False, index=True)
    translated_name = Column(String(500), nullable=True)
    cuisine = Column(String(100), nullable=False, index=True)
    total_time_mins = Column(Integer, nullable=True)
    prep_time_mins = Column(Integer, nullable=True)
    cook_time_mins = Column(Integer, nullable=True)
    
    # Instructions and description
    instructions = Column(Text, nullable=False)
    description = Column(Text, nullable=True)
    
    # Recipe metadata
    difficulty = Column(String(50), default="medium")  # easy, medium, hard
    servings = Column(Integer, default=4)
    ingredient_count = Column(Integer, nullable=True)
    
    # Images and media
    image_url = Column(String(1000), nullable=True)
    original_url = Column(String(1000), nullable=True)
    
    # Nutritional information (optional)
    calories_per_serving = Column(Float, nullable=True)
    protein_grams = Column(Float, nullable=True)
    carbs_grams = Column(Float, nullable=True)
    fat_grams = Column(Float, nullable=True)
    
    # Recipe tags and categories
    tags = Column(Text, nullable=True)  # JSON string for tags like "vegetarian", "vegan", "gluten-free"
    meal_type = Column(String(100), nullable=True)  # breakfast, lunch, dinner, snack
    spice_level = Column(String(50), nullable=True)  # mild, medium, hot, very_hot
    
    # Recipe statistics
    view_count = Column(Integer, default=0)
    favorite_count = Column(Integer, default=0)
    rating_average = Column(Float, default=0.0)
    rating_count = Column(Integer, default=0)
    
    # Status and moderation
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    ingredients = relationship("Ingredient", secondary=recipe_ingredients, back_populates="recipes")
    favorites = relationship("UserFavoriteRecipe", back_populates="recipe", cascade="all, delete-orphan")
    cooking_history = relationship("CookingHistory", back_populates="recipe", cascade="all, delete-orphan")
    meal_plan_items = relationship("MealPlanItem", back_populates="recipe")
    
    def __repr__(self):
        return f"<Recipe(id={self.id}, name='{self.name}', cuisine='{self.cuisine}')>"


class Ingredient(Base):
    """Ingredient model for recipe components"""
    
    __tablename__ = "ingredients"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False, unique=True, index=True)
    category = Column(String(100), nullable=True, index=True)  # vegetables, spices, grains, etc.
    common_units = Column(Text, nullable=True)  # JSON string of common units
    
    # Nutritional information per 100g
    calories_per_100g = Column(Float, nullable=True)
    protein_per_100g = Column(Float, nullable=True)
    carbs_per_100g = Column(Float, nullable=True)
    fat_per_100g = Column(Float, nullable=True)
    
    # Storage and shelf life
    storage_tips = Column(Text, nullable=True)
    shelf_life_days = Column(Integer, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    recipes = relationship("Recipe", secondary=recipe_ingredients, back_populates="ingredients")
    pantry_items = relationship("PantryItem", back_populates="ingredient")
    
    def __repr__(self):
        return f"<Ingredient(id={self.id}, name='{self.name}', category='{self.category}')>"


class UserFavoriteRecipe(Base):
    """User's favorite recipes"""
    
    __tablename__ = "user_favorite_recipes"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    recipe_id = Column(Integer, ForeignKey("recipes.id"), nullable=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="favorite_recipes")
    recipe = relationship("Recipe", back_populates="favorites")
    
    def __repr__(self):
        return f"<UserFavoriteRecipe(user_id={self.user_id}, recipe_id={self.recipe_id})>"


class CookingHistory(Base):
    """Track user's cooking history"""
    
    __tablename__ = "cooking_history"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    recipe_id = Column(Integer, ForeignKey("recipes.id"), nullable=False)
    
    # Cooking details
    cooked_at = Column(DateTime(timezone=True), server_default=func.now())
    rating = Column(Integer, nullable=True)  # 1-5 stars
    notes = Column(Text, nullable=True)
    cooking_time_actual = Column(Integer, nullable=True)  # actual time taken
    
    # Relationships
    user = relationship("User", back_populates="cooking_history")
    recipe = relationship("Recipe", back_populates="cooking_history")
    
    def __repr__(self):
        return f"<CookingHistory(user_id={self.user_id}, recipe_id={self.recipe_id}, rating={self.rating})>"

"""
Meal planning models
"""

from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Date, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class MealPlan(Base):
    """Weekly meal plans for users"""
    
    __tablename__ = "meal_plans"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Plan details
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    
    # Date range
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    
    # Status
    is_active = Column(Boolean, default=True)
    is_completed = Column(Boolean, default=False)
    
    # Auto-generation settings
    is_auto_generated = Column(Boolean, default=False)
    generation_preferences = Column(Text, nullable=True)  # JSON string
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="meal_plans")
    meal_items = relationship("MealPlanItem", back_populates="meal_plan", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<MealPlan(id={self.id}, name='{self.name}', user_id={self.user_id})>"


class MealPlanItem(Base):
    """Individual meals in a meal plan"""
    
    __tablename__ = "meal_plan_items"
    
    id = Column(Integer, primary_key=True, index=True)
    meal_plan_id = Column(Integer, ForeignKey("meal_plans.id"), nullable=False)
    recipe_id = Column(Integer, ForeignKey("recipes.id"), nullable=True)
    
    # Meal details
    meal_date = Column(Date, nullable=False)
    meal_type = Column(String(50), nullable=False)  # breakfast, lunch, dinner, snack
    meal_name = Column(String(200), nullable=True)  # Custom meal name if no recipe
    
    # Serving information
    planned_servings = Column(Integer, default=1)
    actual_servings = Column(Integer, nullable=True)
    
    # Status
    is_cooked = Column(Boolean, default=False)
    is_skipped = Column(Boolean, default=False)
    
    # Notes
    notes = Column(Text, nullable=True)
    prep_notes = Column(Text, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    cooked_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    meal_plan = relationship("MealPlan", back_populates="meal_items")
    recipe = relationship("Recipe", back_populates="meal_plan_items")
    
    def __repr__(self):
        return f"<MealPlanItem(id={self.id}, meal_date={self.meal_date}, meal_type='{self.meal_type}')>"


class MealPlanTemplate(Base):
    """Reusable meal plan templates"""
    
    __tablename__ = "meal_plan_templates"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # Null for system templates
    
    # Template details
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String(100), nullable=True)  # weight_loss, muscle_gain, vegetarian, etc.
    
    # Template configuration
    duration_days = Column(Integer, default=7)
    target_calories_per_day = Column(Integer, nullable=True)
    dietary_restrictions = Column(Text, nullable=True)  # JSON string
    
    # Visibility
    is_public = Column(Boolean, default=False)
    is_system_template = Column(Boolean, default=False)
    
    # Usage statistics
    usage_count = Column(Integer, default=0)
    rating_average = Column(Float, default=0.0)
    rating_count = Column(Integer, default=0)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User")
    template_items = relationship("MealPlanTemplateItem", back_populates="template", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<MealPlanTemplate(id={self.id}, name='{self.name}')>"


class MealPlanTemplateItem(Base):
    """Items in a meal plan template"""
    
    __tablename__ = "meal_plan_template_items"
    
    id = Column(Integer, primary_key=True, index=True)
    template_id = Column(Integer, ForeignKey("meal_plan_templates.id"), nullable=False)
    recipe_id = Column(Integer, ForeignKey("recipes.id"), nullable=True)
    
    # Template item details
    day_number = Column(Integer, nullable=False)  # 1-7 for weekly templates
    meal_type = Column(String(50), nullable=False)
    meal_name = Column(String(200), nullable=True)
    servings = Column(Integer, default=1)
    
    # Alternative options
    alternative_recipe_ids = Column(Text, nullable=True)  # JSON array of recipe IDs
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    template = relationship("MealPlanTemplate", back_populates="template_items")
    recipe = relationship("Recipe")
    
    def __repr__(self):
        return f"<MealPlanTemplateItem(id={self.id}, day={self.day_number}, meal_type='{self.meal_type}')>"

"""
Meal plan schemas for API validation
"""

from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import date, datetime


class MealPlanBase(BaseModel):
    """Base meal plan schema"""
    name: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    start_date: date
    end_date: date
    
    @validator('end_date')
    def end_date_after_start_date(cls, v, values):
        if 'start_date' in values and v <= values['start_date']:
            raise ValueError('End date must be after start date')
        return v


class MealPlanCreate(MealPlanBase):
    """Schema for creating meal plans"""
    is_auto_generated: Optional[bool] = False
    generation_preferences: Optional[dict] = None


class MealPlanUpdate(BaseModel):
    """Schema for updating meal plans"""
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    is_active: Optional[bool] = None


class MealPlanResponse(MealPlanBase):
    """Schema for meal plan response"""
    id: int
    user_id: int
    is_active: bool
    is_completed: bool
    is_auto_generated: bool
    generation_preferences: Optional[dict] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class MealPlanItemBase(BaseModel):
    """Base meal plan item schema"""
    meal_date: date
    meal_type: str = Field(..., regex=r'^(breakfast|lunch|dinner|snack)$')
    planned_servings: int = Field(1, ge=1, le=20)
    notes: Optional[str] = Field(None, max_length=1000)
    prep_notes: Optional[str] = Field(None, max_length=1000)


class MealPlanItemCreate(MealPlanItemBase):
    """Schema for creating meal plan items"""
    recipe_id: Optional[int] = None
    meal_name: Optional[str] = Field(None, max_length=200)
    
    @validator('meal_name')
    def meal_name_or_recipe_required(cls, v, values):
        if not v and not values.get('recipe_id'):
            raise ValueError('Either meal_name or recipe_id must be provided')
        return v


class MealPlanItemUpdate(BaseModel):
    """Schema for updating meal plan items"""
    meal_date: Optional[date] = None
    meal_type: Optional[str] = Field(None, regex=r'^(breakfast|lunch|dinner|snack)$')
    recipe_id: Optional[int] = None
    meal_name: Optional[str] = Field(None, max_length=200)
    planned_servings: Optional[int] = Field(None, ge=1, le=20)
    actual_servings: Optional[int] = Field(None, ge=0, le=20)
    is_cooked: Optional[bool] = None
    is_skipped: Optional[bool] = None
    notes: Optional[str] = Field(None, max_length=1000)
    prep_notes: Optional[str] = Field(None, max_length=1000)


class MealPlanItemResponse(MealPlanItemBase):
    """Schema for meal plan item response"""
    id: int
    meal_plan_id: int
    recipe_id: Optional[int] = None
    recipe_name: Optional[str] = None
    recipe_image_url: Optional[str] = None
    meal_name: Optional[str] = None
    actual_servings: Optional[int] = None
    is_cooked: bool
    is_skipped: bool
    created_at: datetime
    cooked_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class MealPlanTemplateBase(BaseModel):
    """Base meal plan template schema"""
    name: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    category: Optional[str] = Field(None, max_length=100)
    duration_days: int = Field(7, ge=1, le=30)
    target_calories_per_day: Optional[int] = Field(None, ge=500, le=5000)
    dietary_restrictions: Optional[List[str]] = None


class MealPlanTemplateCreate(MealPlanTemplateBase):
    """Schema for creating meal plan templates"""
    is_public: Optional[bool] = False


class MealPlanTemplateResponse(MealPlanTemplateBase):
    """Schema for meal plan template response"""
    id: int
    user_id: Optional[int] = None
    is_public: bool
    is_system_template: bool
    usage_count: int
    rating_average: float
    rating_count: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class MealPlanTemplateItemBase(BaseModel):
    """Base meal plan template item schema"""
    day_number: int = Field(..., ge=1, le=30)
    meal_type: str = Field(..., regex=r'^(breakfast|lunch|dinner|snack)$')
    servings: int = Field(1, ge=1, le=20)


class MealPlanTemplateItemCreate(MealPlanTemplateItemBase):
    """Schema for creating meal plan template items"""
    recipe_id: Optional[int] = None
    meal_name: Optional[str] = Field(None, max_length=200)
    alternative_recipe_ids: Optional[List[int]] = None


class MealPlanTemplateItemResponse(MealPlanTemplateItemBase):
    """Schema for meal plan template item response"""
    id: int
    template_id: int
    recipe_id: Optional[int] = None
    recipe_name: Optional[str] = None
    meal_name: Optional[str] = None
    alternative_recipe_ids: Optional[List[int]] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


class WeeklyMealPlan(BaseModel):
    """Schema for weekly meal plan view"""
    week_start: date
    week_end: date
    meals: dict  # Organized by day and meal type
    total_recipes: int
    missing_meals: int


class MealPlanStats(BaseModel):
    """Schema for meal plan statistics"""
    total_plans: int
    active_plans: int
    completed_plans: int
    total_meals_planned: int
    meals_cooked: int
    favorite_meal_types: dict
    most_used_recipes: List[dict]

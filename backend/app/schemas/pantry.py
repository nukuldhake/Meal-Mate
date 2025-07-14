"""
Pantry schemas for API validation
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import date, datetime


class PantryItemBase(BaseModel):
    """Base pantry item schema"""
    quantity: float = Field(..., gt=0)
    unit: str = Field(..., min_length=1, max_length=50)
    expiration_date: Optional[date] = None
    storage_location: Optional[str] = Field(None, max_length=100)
    notes: Optional[str] = Field(None, max_length=500)


class PantryItemCreate(PantryItemBase):
    """Schema for creating pantry items"""
    ingredient_name: str = Field(..., min_length=1, max_length=200)
    purchase_date: Optional[date] = None
    low_stock_threshold: Optional[float] = Field(None, gt=0)


class PantryItemUpdate(BaseModel):
    """Schema for updating pantry items"""
    quantity: Optional[float] = Field(None, gt=0)
    unit: Optional[str] = Field(None, min_length=1, max_length=50)
    expiration_date: Optional[date] = None
    storage_location: Optional[str] = Field(None, max_length=100)
    notes: Optional[str] = Field(None, max_length=500)
    low_stock_threshold: Optional[float] = Field(None, gt=0)


class PantryItemResponse(PantryItemBase):
    """Schema for pantry item response"""
    id: int
    ingredient_id: int
    ingredient_name: str
    ingredient_category: Optional[str] = None
    purchase_date: Optional[date] = None
    is_expired: bool
    is_low_stock: bool
    low_stock_threshold: Optional[float] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class ShoppingListBase(BaseModel):
    """Base shopping list schema"""
    name: str = Field(..., min_length=1, max_length=200)


class ShoppingListCreate(ShoppingListBase):
    """Schema for creating shopping lists"""
    pass


class ShoppingListResponse(ShoppingListBase):
    """Schema for shopping list response"""
    id: int
    user_id: int
    is_completed: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class ShoppingListItemBase(BaseModel):
    """Base shopping list item schema"""
    quantity: float = Field(..., gt=0)
    unit: str = Field(..., min_length=1, max_length=50)
    estimated_price: Optional[float] = Field(None, ge=0)
    notes: Optional[str] = Field(None, max_length=500)
    brand_preference: Optional[str] = Field(None, max_length=200)


class ShoppingListItemCreate(ShoppingListItemBase):
    """Schema for creating shopping list items"""
    ingredient_name: str = Field(..., min_length=1, max_length=200)


class ShoppingListItemUpdate(BaseModel):
    """Schema for updating shopping list items"""
    quantity: Optional[float] = Field(None, gt=0)
    unit: Optional[str] = Field(None, min_length=1, max_length=50)
    estimated_price: Optional[float] = Field(None, ge=0)
    actual_price: Optional[float] = Field(None, ge=0)
    notes: Optional[str] = Field(None, max_length=500)
    brand_preference: Optional[str] = Field(None, max_length=200)
    is_purchased: Optional[bool] = None


class ShoppingListItemResponse(ShoppingListItemBase):
    """Schema for shopping list item response"""
    id: int
    shopping_list_id: int
    ingredient_id: int
    ingredient_name: str
    is_purchased: bool
    actual_price: Optional[float] = None
    created_at: datetime
    purchased_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class PantryStats(BaseModel):
    """Schema for pantry statistics"""
    total_items: int
    items_by_category: dict
    expired_items: int
    low_stock_items: int
    items_expiring_soon: int  # Within 7 days

"""
Pantry management models
"""

from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey, Date
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class PantryItem(Base):
    """User's pantry items for smart recipe matching"""
    
    __tablename__ = "pantry_items"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    ingredient_id = Column(Integer, ForeignKey("ingredients.id"), nullable=False)
    
    # Quantity and storage
    quantity = Column(Float, nullable=False)
    unit = Column(String(50), nullable=False)  # kg, g, pieces, cups, etc.
    
    # Expiration and freshness
    expiration_date = Column(Date, nullable=True)
    purchase_date = Column(Date, nullable=True)
    is_expired = Column(Boolean, default=False)
    
    # Storage location
    storage_location = Column(String(100), nullable=True)  # fridge, pantry, freezer
    
    # Notes and reminders
    notes = Column(String(500), nullable=True)
    low_stock_threshold = Column(Float, nullable=True)
    is_low_stock = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="pantry_items")
    ingredient = relationship("Ingredient", back_populates="pantry_items")
    
    def __repr__(self):
        return f"<PantryItem(id={self.id}, user_id={self.user_id}, ingredient='{self.ingredient.name if self.ingredient else 'Unknown'}', quantity={self.quantity} {self.unit})>"


class ShoppingList(Base):
    """Shopping list for missing ingredients"""
    
    __tablename__ = "shopping_lists"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(200), nullable=False)
    
    # Status
    is_completed = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    user = relationship("User")
    items = relationship("ShoppingListItem", back_populates="shopping_list", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<ShoppingList(id={self.id}, name='{self.name}', user_id={self.user_id})>"


class ShoppingListItem(Base):
    """Individual items in a shopping list"""
    
    __tablename__ = "shopping_list_items"
    
    id = Column(Integer, primary_key=True, index=True)
    shopping_list_id = Column(Integer, ForeignKey("shopping_lists.id"), nullable=False)
    ingredient_id = Column(Integer, ForeignKey("ingredients.id"), nullable=False)
    
    # Item details
    quantity = Column(Float, nullable=False)
    unit = Column(String(50), nullable=False)
    estimated_price = Column(Float, nullable=True)
    
    # Status
    is_purchased = Column(Boolean, default=False)
    actual_price = Column(Float, nullable=True)
    
    # Notes
    notes = Column(String(500), nullable=True)
    brand_preference = Column(String(200), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    purchased_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    shopping_list = relationship("ShoppingList", back_populates="items")
    ingredient = relationship("Ingredient")
    
    def __repr__(self):
        return f"<ShoppingListItem(id={self.id}, ingredient='{self.ingredient.name if self.ingredient else 'Unknown'}', quantity={self.quantity} {self.unit})>"

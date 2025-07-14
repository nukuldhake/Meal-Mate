"""
Pantry management endpoints
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import and_

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.pantry import PantryItem
from app.models.recipe import Ingredient

router = APIRouter()


@router.get("/items")
async def get_pantry_items(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get user's pantry items
    """
    items = db.query(PantryItem).filter(
        PantryItem.user_id == current_user.id
    ).all()
    
    return {"items": items}


@router.post("/items")
async def add_pantry_item(
    ingredient_name: str,
    quantity: float,
    unit: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Add item to pantry
    """
    # Find or create ingredient
    ingredient = db.query(Ingredient).filter(
        Ingredient.name.ilike(f"%{ingredient_name}%")
    ).first()
    
    if not ingredient:
        ingredient = Ingredient(name=ingredient_name.lower())
        db.add(ingredient)
        db.flush()
    
    # Check if item already exists in pantry
    existing_item = db.query(PantryItem).filter(
        and_(
            PantryItem.user_id == current_user.id,
            PantryItem.ingredient_id == ingredient.id
        )
    ).first()
    
    if existing_item:
        # Update quantity
        existing_item.quantity += quantity
        db.commit()
        return {"message": "Pantry item updated", "item": existing_item}
    else:
        # Create new pantry item
        pantry_item = PantryItem(
            user_id=current_user.id,
            ingredient_id=ingredient.id,
            quantity=quantity,
            unit=unit
        )
        db.add(pantry_item)
        db.commit()
        db.refresh(pantry_item)
        
        return {"message": "Item added to pantry", "item": pantry_item}


@router.delete("/items/{item_id}")
async def remove_pantry_item(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Remove item from pantry
    """
    item = db.query(PantryItem).filter(
        and_(
            PantryItem.id == item_id,
            PantryItem.user_id == current_user.id
        )
    ).first()
    
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pantry item not found"
        )
    
    db.delete(item)
    db.commit()
    
    return {"message": "Item removed from pantry"}

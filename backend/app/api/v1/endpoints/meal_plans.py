"""
Meal planning endpoints
"""

from typing import List
from datetime import date, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import and_

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.meal_plan import MealPlan, MealPlanItem

router = APIRouter()


@router.get("/")
async def get_meal_plans(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get user's meal plans
    """
    meal_plans = db.query(MealPlan).filter(
        MealPlan.user_id == current_user.id
    ).all()
    
    return {"meal_plans": meal_plans}


@router.post("/")
async def create_meal_plan(
    name: str,
    start_date: date,
    end_date: date,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new meal plan
    """
    meal_plan = MealPlan(
        user_id=current_user.id,
        name=name,
        start_date=start_date,
        end_date=end_date
    )
    
    db.add(meal_plan)
    db.commit()
    db.refresh(meal_plan)
    
    return {"message": "Meal plan created", "meal_plan": meal_plan}


@router.get("/{plan_id}")
async def get_meal_plan(
    plan_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a specific meal plan with items
    """
    meal_plan = db.query(MealPlan).filter(
        and_(
            MealPlan.id == plan_id,
            MealPlan.user_id == current_user.id
        )
    ).first()
    
    if not meal_plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Meal plan not found"
        )
    
    return {"meal_plan": meal_plan, "items": meal_plan.meal_items}


@router.post("/{plan_id}/items")
async def add_meal_plan_item(
    plan_id: int,
    meal_date: date,
    meal_type: str,
    recipe_id: int = None,
    meal_name: str = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Add item to meal plan
    """
    meal_plan = db.query(MealPlan).filter(
        and_(
            MealPlan.id == plan_id,
            MealPlan.user_id == current_user.id
        )
    ).first()
    
    if not meal_plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Meal plan not found"
        )
    
    meal_item = MealPlanItem(
        meal_plan_id=plan_id,
        recipe_id=recipe_id,
        meal_date=meal_date,
        meal_type=meal_type,
        meal_name=meal_name
    )
    
    db.add(meal_item)
    db.commit()
    db.refresh(meal_item)
    
    return {"message": "Meal added to plan", "item": meal_item}

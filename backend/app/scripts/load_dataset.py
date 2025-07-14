"""
Script to load the Indian Food Dataset CSV into the database
"""

import pandas as pd
import re
import json
from sqlalchemy.orm import Session
from loguru import logger

from app.core.database import get_db_session
from app.core.config import settings
from app.models.recipe import Recipe, Ingredient, recipe_ingredients
from app.models.user import User


def clean_ingredient_name(ingredient: str) -> str:
    """Clean and normalize ingredient names"""
    if not ingredient or pd.isna(ingredient):
        return ""
    
    # Remove quantities and units from ingredient names
    ingredient = str(ingredient).strip()
    
    # Remove common quantity patterns
    patterns_to_remove = [
        r'\d+\s*(tablespoon|tbsp|teaspoon|tsp|cup|cups|kg|g|ml|l|pieces?|inch|inches)',
        r'\d+\s*-\s*\d+',
        r'\d+/\d+',
        r'\d+\.\d+',
        r'^\d+\s+',
        r'\s*-\s*(to taste|as required|as needed|optional).*$',
        r'\s*\([^)]*\)\s*',  # Remove content in parentheses
    ]
    
    for pattern in patterns_to_remove:
        ingredient = re.sub(pattern, '', ingredient, flags=re.IGNORECASE)
    
    # Clean up extra spaces and punctuation
    ingredient = re.sub(r'\s+', ' ', ingredient)
    ingredient = ingredient.strip(' ,-')
    
    return ingredient.lower()


def extract_cooking_time(time_str: str) -> tuple:
    """Extract prep and cook time from total time"""
    if not time_str or pd.isna(time_str):
        return None, None, None
    
    try:
        total_time = int(time_str)
        # Estimate prep time as 25% of total time, cook time as 75%
        prep_time = max(5, int(total_time * 0.25))
        cook_time = total_time - prep_time
        return total_time, prep_time, cook_time
    except (ValueError, TypeError):
        return None, None, None


def determine_difficulty(total_time: int, ingredient_count: int) -> str:
    """Determine recipe difficulty based on time and ingredient count"""
    if not total_time or not ingredient_count:
        return "medium"
    
    # Simple heuristic for difficulty
    if total_time <= 30 and ingredient_count <= 8:
        return "easy"
    elif total_time >= 90 or ingredient_count >= 15:
        return "hard"
    else:
        return "medium"


def determine_meal_type(recipe_name: str, cuisine: str) -> str:
    """Determine meal type based on recipe name and cuisine"""
    name_lower = recipe_name.lower()
    
    breakfast_keywords = ['breakfast', 'poha', 'upma', 'dosa', 'idli', 'paratha', 'toast']
    snack_keywords = ['snack', 'chaat', 'pakora', 'samosa', 'bhel', 'vada']
    
    if any(keyword in name_lower for keyword in breakfast_keywords):
        return "breakfast"
    elif any(keyword in name_lower for keyword in snack_keywords):
        return "snack"
    else:
        return "lunch"  # Default to lunch for main dishes


def determine_spice_level(ingredients: str, instructions: str) -> str:
    """Determine spice level based on ingredients and instructions"""
    content = f"{ingredients} {instructions}".lower()
    
    hot_keywords = ['red chilli', 'green chilli', 'chili', 'hot', 'spicy', 'garam masala']
    mild_keywords = ['mild', 'less spice', 'no chilli']
    
    hot_count = sum(1 for keyword in hot_keywords if keyword in content)
    mild_count = sum(1 for keyword in mild_keywords if keyword in content)
    
    if mild_count > 0:
        return "mild"
    elif hot_count >= 3:
        return "very_hot"
    elif hot_count >= 2:
        return "hot"
    elif hot_count >= 1:
        return "medium"
    else:
        return "mild"


def extract_tags(ingredients: str, instructions: str, recipe_name: str) -> list:
    """Extract tags based on ingredients and recipe content"""
    content = f"{ingredients} {instructions} {recipe_name}".lower()
    tags = []
    
    # Dietary tags
    if not any(meat in content for meat in ['chicken', 'mutton', 'fish', 'egg', 'meat']):
        tags.append("vegetarian")
    
    if not any(dairy in content for dairy in ['milk', 'cream', 'butter', 'ghee', 'paneer', 'cheese', 'yogurt']):
        tags.append("vegan")
    
    if not any(gluten in content for gluten in ['wheat', 'flour', 'bread', 'roti']):
        tags.append("gluten-free")
    
    # Cooking method tags
    if any(method in content for method in ['fried', 'fry', 'deep fry']):
        tags.append("fried")
    
    if any(method in content for method in ['baked', 'bake', 'oven']):
        tags.append("baked")
    
    if any(method in content for method in ['steamed', 'steam']):
        tags.append("steamed")
    
    # Special tags
    if any(quick in content for quick in ['quick', 'instant', 'fast']):
        tags.append("quick")
    
    return tags


def load_dataset():
    """Load the Indian Food Dataset into the database"""
    logger.info("Starting dataset loading process...")
    
    # Read the CSV file
    try:
        df = pd.read_csv(settings.DATASET_PATH)
        logger.info(f"Loaded {len(df)} recipes from CSV")
    except Exception as e:
        logger.error(f"Error reading CSV file: {e}")
        return
    
    db = get_db_session()
    
    try:
        # Clear existing data (optional - comment out if you want to keep existing data)
        logger.info("Clearing existing recipe data...")
        db.query(recipe_ingredients).delete()
        db.query(Recipe).delete()
        db.query(Ingredient).delete()
        db.commit()
        
        # Track ingredients to avoid duplicates
        ingredient_cache = {}
        
        # Process each recipe
        for index, row in df.iterrows():
            try:
                # Extract basic recipe information
                name = row.get('TranslatedRecipeName', '').strip()
                if not name:
                    continue
                
                cuisine = row.get('Cuisine', 'Indian').strip()
                instructions = row.get('TranslatedInstructions', '').strip()
                ingredients_raw = row.get('TranslatedIngredients', '')
                cleaned_ingredients = row.get('Cleaned-Ingredients', '')
                image_url = row.get('image-url', '')
                original_url = row.get('URL', '')
                ingredient_count = row.get('Ingredient-count', 0)
                
                # Extract time information
                total_time, prep_time, cook_time = extract_cooking_time(row.get('TotalTimeInMins'))
                
                # Determine recipe properties
                difficulty = determine_difficulty(total_time, ingredient_count)
                meal_type = determine_meal_type(name, cuisine)
                spice_level = determine_spice_level(ingredients_raw, instructions)
                tags = extract_tags(ingredients_raw, instructions, name)
                
                # Create recipe
                recipe = Recipe(
                    name=name,
                    translated_name=name,  # Same as name for this dataset
                    cuisine=cuisine,
                    instructions=instructions,
                    description=f"Authentic {cuisine} recipe for {name}",
                    total_time_mins=total_time,
                    prep_time_mins=prep_time,
                    cook_time_mins=cook_time,
                    difficulty=difficulty,
                    servings=4,  # Default serving size
                    ingredient_count=ingredient_count,
                    image_url=image_url if image_url else None,
                    original_url=original_url if original_url else None,
                    tags=json.dumps(tags),
                    meal_type=meal_type,
                    spice_level=spice_level,
                    is_active=True,
                    is_verified=True
                )
                
                db.add(recipe)
                db.flush()  # Get the recipe ID
                
                # Process ingredients
                if cleaned_ingredients:
                    ingredient_list = [ing.strip() for ing in cleaned_ingredients.split(',')]
                    
                    for ingredient_name in ingredient_list:
                        if not ingredient_name:
                            continue
                        
                        cleaned_name = clean_ingredient_name(ingredient_name)
                        if not cleaned_name:
                            continue
                        
                        # Get or create ingredient
                        if cleaned_name in ingredient_cache:
                            ingredient = ingredient_cache[cleaned_name]
                        else:
                            ingredient = db.query(Ingredient).filter(
                                Ingredient.name == cleaned_name
                            ).first()
                            
                            if not ingredient:
                                # Determine ingredient category
                                category = "other"
                                if any(spice in cleaned_name for spice in ['powder', 'masala', 'seeds', 'leaves']):
                                    category = "spices"
                                elif any(veg in cleaned_name for veg in ['onion', 'tomato', 'potato', 'carrot']):
                                    category = "vegetables"
                                elif any(grain in cleaned_name for grain in ['rice', 'wheat', 'flour']):
                                    category = "grains"
                                elif any(dairy in cleaned_name for dairy in ['milk', 'cream', 'butter']):
                                    category = "dairy"
                                
                                ingredient = Ingredient(
                                    name=cleaned_name,
                                    category=category
                                )
                                db.add(ingredient)
                                db.flush()
                            
                            ingredient_cache[cleaned_name] = ingredient
                        
                        # Add to recipe (using raw SQL for association table)
                        db.execute(
                            recipe_ingredients.insert().values(
                                recipe_id=recipe.id,
                                ingredient_id=ingredient.id
                            )
                        )
                
                if index % 100 == 0:
                    logger.info(f"Processed {index + 1} recipes...")
                    db.commit()
            
            except Exception as e:
                logger.error(f"Error processing recipe {index}: {e}")
                continue
        
        # Final commit
        db.commit()
        logger.info(f"Successfully loaded {len(df)} recipes into the database")
        
        # Print summary statistics
        recipe_count = db.query(Recipe).count()
        ingredient_count = db.query(Ingredient).count()
        logger.info(f"Database now contains {recipe_count} recipes and {ingredient_count} ingredients")
        
    except Exception as e:
        logger.error(f"Error during dataset loading: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    load_dataset()

/**
 * API client for MealMate backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// Types
export interface User {
  id: number;
  email: string;
  username: string;
  full_name: string;
  bio?: string;
  profile_image?: string;
  cooking_skill_level: string;
  dietary_preferences?: string[];
  favorite_cuisines?: string[];
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  last_login?: string;
}

export interface Recipe {
  id: number;
  name: string;
  cuisine: string;
  instructions: string;
  description?: string;
  translated_name?: string;
  total_time_mins?: number;
  prep_time_mins?: number;
  cook_time_mins?: number;
  difficulty: 'easy' | 'medium' | 'hard';
  servings: number;
  ingredient_count?: number;
  image_url?: string;
  original_url?: string;
  tags?: string[];
  meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  spice_level?: 'mild' | 'medium' | 'hot' | 'very_hot';
  calories_per_serving?: number;
  protein_grams?: number;
  carbs_grams?: number;
  fat_grams?: number;
  view_count: number;
  favorite_count: number;
  rating_average: number;
  rating_count: number;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at?: string;
  ingredients: RecipeIngredient[];
  is_favorite?: boolean;
}

export interface RecipeIngredient {
  ingredient_id: number;
  ingredient_name: string;
  quantity?: string;
  unit?: string;
}

export interface Ingredient {
  id: number;
  name: string;
  category?: string;
  common_units?: string[];
  calories_per_100g?: number;
  protein_per_100g?: number;
  carbs_per_100g?: number;
  fat_per_100g?: number;
  storage_tips?: string;
  shelf_life_days?: number;
  created_at: string;
}

export interface PantryItem {
  id: number;
  ingredient_id: number;
  ingredient_name: string;
  ingredient_category?: string;
  quantity: number;
  unit: string;
  expiration_date?: string;
  storage_location?: string;
  notes?: string;
  is_expired: boolean;
  is_low_stock: boolean;
  low_stock_threshold?: number;
  created_at: string;
  updated_at?: string;
}

export interface MealPlan {
  id: number;
  user_id: number;
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  is_completed: boolean;
  is_auto_generated: boolean;
  generation_preferences?: any;
  created_at: string;
  updated_at?: string;
}

export interface MealPlanItem {
  id: number;
  meal_plan_id: number;
  recipe_id?: number;
  recipe_name?: string;
  recipe_image_url?: string;
  meal_name?: string;
  meal_date: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  planned_servings: number;
  actual_servings?: number;
  is_cooked: boolean;
  is_skipped: boolean;
  notes?: string;
  prep_notes?: string;
  created_at: string;
  cooked_at?: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  full_name: string;
  password: string;
  confirm_password: string;
}

export interface RecipeSearchFilters {
  query?: string;
  cuisine?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  max_time?: number;
  meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  spice_level?: 'mild' | 'medium' | 'hot' | 'very_hot';
  tags?: string[];
  ingredients?: string[];
  max_missing_ingredients?: number;
  min_rating?: number;
  vegetarian?: boolean;
  vegan?: boolean;
  gluten_free?: boolean;
}

export interface RecipeSearchResponse {
  recipes: Recipe[];
  total_count: number;
  page: number;
  page_size: number;
  total_pages: number;
  filters_applied: RecipeSearchFilters;
}

// API Client Class
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('access_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('access_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  // Authentication
  async login(credentials: LoginCredentials): Promise<AuthTokens> {
    const tokens = await this.request<AuthTokens>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    this.setToken(tokens.access_token);
    localStorage.setItem('refresh_token', tokens.refresh_token);
    return tokens;
  }

  async register(userData: RegisterData): Promise<User> {
    return this.request<User>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      this.clearToken();
    }
  }

  // Users
  async getCurrentUser(): Promise<User> {
    return this.request<User>('/users/me');
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    return this.request<User>('/users/me', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Recipes
  async getRecipes(params: {
    page?: number;
    page_size?: number;
    cuisine?: string;
    difficulty?: string;
    max_time?: number;
    meal_type?: string;
    spice_level?: string;
    vegetarian?: boolean;
    search?: string;
  } = {}): Promise<RecipeSearchResponse> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    return this.request<RecipeSearchResponse>(`/recipes/?${searchParams}`);
  }

  async getRecipe(id: number): Promise<Recipe> {
    return this.request<Recipe>(`/recipes/${id}`);
  }

  async toggleFavoriteRecipe(id: number): Promise<{ message: string; is_favorite: boolean; favorite_count: number }> {
    return this.request(`/recipes/${id}/favorite`, { method: 'POST' });
  }

  async rateRecipe(id: number, rating: number, review?: string): Promise<any> {
    return this.request(`/recipes/${id}/rate`, {
      method: 'POST',
      body: JSON.stringify({ rating, review }),
    });
  }

  async getCuisines(): Promise<{ cuisines: string[] }> {
    return this.request<{ cuisines: string[] }>('/recipes/cuisines/list');
  }

  // Pantry
  async getPantryItems(): Promise<{ items: PantryItem[] }> {
    return this.request<{ items: PantryItem[] }>('/pantry/items');
  }

  async addPantryItem(ingredientName: string, quantity: number, unit: string): Promise<any> {
    return this.request('/pantry/items', {
      method: 'POST',
      body: JSON.stringify({
        ingredient_name: ingredientName,
        quantity,
        unit,
      }),
    });
  }

  async removePantryItem(itemId: number): Promise<{ message: string }> {
    return this.request(`/pantry/items/${itemId}`, { method: 'DELETE' });
  }

  // Meal Plans
  async getMealPlans(): Promise<{ meal_plans: MealPlan[] }> {
    return this.request<{ meal_plans: MealPlan[] }>('/meal-plans/');
  }

  async createMealPlan(name: string, startDate: string, endDate: string): Promise<any> {
    return this.request('/meal-plans/', {
      method: 'POST',
      body: JSON.stringify({
        name,
        start_date: startDate,
        end_date: endDate,
      }),
    });
  }

  async getMealPlan(id: number): Promise<{ meal_plan: MealPlan; items: MealPlanItem[] }> {
    return this.request(`/meal-plans/${id}`);
  }

  async addMealPlanItem(
    planId: number,
    mealDate: string,
    mealType: string,
    recipeId?: number,
    mealName?: string
  ): Promise<any> {
    return this.request(`/meal-plans/${planId}/items`, {
      method: 'POST',
      body: JSON.stringify({
        meal_date: mealDate,
        meal_type: mealType,
        recipe_id: recipeId,
        meal_name: mealName,
      }),
    });
  }

  // Search
  async searchRecipes(query: string): Promise<{ recipes: Recipe[]; total: number }> {
    return this.request(`/search/recipes?query=${encodeURIComponent(query)}`);
  }

  async searchRecipesByPantry(): Promise<{ recipes: Recipe[]; total: number }> {
    return this.request('/search/recipes/by-pantry');
  }

  async searchIngredients(query: string): Promise<{ ingredients: Ingredient[]; total: number }> {
    return this.request(`/search/ingredients?query=${encodeURIComponent(query)}`);
  }
}

// Create and export API client instance
export const api = new ApiClient(API_BASE_URL);

// Export default
export default api;

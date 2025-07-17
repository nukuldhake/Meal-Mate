
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Clock, 
  Users, 
  ChefHat, 
  Heart, 
  Share2,
  Play,
  Check,
  BookOpen
} from "lucide-react";

const RecipeDetailPage = () => {
  const { id } = useParams();
  const [isFavorite, setIsFavorite] = useState(false);
  const [cookMode, setCookMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Mock recipe data
  const recipe = {
    id: id || "1",
    title: "Butter Chicken",
    image: "photo-1618160702438-9b02ab6515c9",
    cookTime: 45,
    prepTime: 15,
    cuisine: "North Indian",
    difficulty: "Medium",
    servings: 4,
    description: "A rich and creamy tomato-based curry with tender chicken pieces, perfect for a comforting dinner.",
    ingredients: [
      { item: "Chicken breast", quantity: "500g", category: "Protein" },
      { item: "Onion", quantity: "1 large", category: "Vegetables" },
      { item: "Tomatoes", quantity: "3 medium", category: "Vegetables" },
      { item: "Garlic", quantity: "6 cloves", category: "Aromatics" },
      { item: "Ginger", quantity: "1 inch piece", category: "Aromatics" },
      { item: "Heavy cream", quantity: "1/2 cup", category: "Dairy" },
      { item: "Butter", quantity: "3 tbsp", category: "Dairy" },
      { item: "Garam masala", quantity: "1 tsp", category: "Spices" },
      { item: "Cumin powder", quantity: "1 tsp", category: "Spices" },
      { item: "Paprika", quantity: "1 tsp", category: "Spices" },
      { item: "Turmeric", quantity: "1/2 tsp", category: "Spices" },
      { item: "Salt", quantity: "to taste", category: "Seasoning" }
    ],
    instructions: [
      "Cut chicken into bite-sized pieces and season with salt, turmeric, and half the garam masala. Let marinate for 15 minutes.",
      "Heat 1 tbsp butter in a large pan over medium-high heat. Add chicken pieces and cook until golden brown on all sides. Remove and set aside.",
      "In the same pan, add remaining butter. Add minced garlic and ginger, cook for 1 minute until fragrant.",
      "Add diced onions and cook until softened and golden, about 5-7 minutes.",
      "Add diced tomatoes, cumin powder, paprika, and remaining garam masala. Cook until tomatoes break down and form a thick sauce, about 10 minutes.",
      "Blend the sauce until smooth using an immersion blender or regular blender. Return to pan if using regular blender.",
      "Add the cooked chicken back to the pan and simmer for 5 minutes to let flavors combine.",
      "Stir in heavy cream and simmer for another 2-3 minutes until heated through.",
      "Taste and adjust seasoning with salt and spices as needed.",
      "Garnish with fresh cilantro and serve hot with basmati rice or naan bread."
    ],
    nutrition: {
      calories: 380,
      protein: 35,
      carbs: 12,
      fat: 22
    },
    tags: ["Dinner", "Comfort Food", "Creamy", "Spicy"]
  };

  const toggleStep = (stepIndex: number) => {
    if (completedSteps.includes(stepIndex)) {
      setCompletedSteps(completedSteps.filter(step => step !== stepIndex));
    } else {
      setCompletedSteps([...completedSteps, stepIndex]);
    }
  };

  const ingredientsByCategory = recipe.ingredients.reduce((acc, ingredient) => {
    const category = ingredient.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(ingredient);
    return acc;
  }, {} as Record<string, typeof recipe.ingredients>);

  if (cookMode) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Cook Mode Header */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              onClick={() => setCookMode(false)}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Exit Cook Mode</span>
            </Button>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">{recipe.title}</h1>
              <p className="text-gray-600">Step {currentStep + 1} of {recipe.instructions.length}</p>
            </div>
            <div className="w-24"></div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / recipe.instructions.length) * 100}%` }}
            ></div>
          </div>

          {/* Current Step */}
          <Card className="mb-6">
            <CardContent className="p-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto">
                  {currentStep + 1}
                </div>
                <p className="text-lg leading-relaxed">{recipe.instructions[currentStep]}</p>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
            >
              Previous Step
            </Button>
            <Button
              onClick={() => setCurrentStep(Math.min(recipe.instructions.length - 1, currentStep + 1))}
              disabled={currentStep === recipe.instructions.length - 1}
            >
              Next Step
            </Button>
          </div>

          {currentStep === recipe.instructions.length - 1 && (
            <div className="text-center mt-8">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white mx-auto">
                  <Check className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Congratulations!</h2>
                <p className="text-gray-600">You've completed cooking {recipe.title}</p>
                <Button onClick={() => setCookMode(false)}>
                  View Recipe Details
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link to="/search">
            <Button variant="outline" className="flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Search</span>
            </Button>
          </Link>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFavorite(!isFavorite)}
              className={isFavorite ? "text-red-500" : "text-gray-600"}
            >
              <Heart className="w-5 h-5" fill={isFavorite ? "currentColor" : "none"} />
            </Button>
            <Button variant="ghost" size="sm">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Recipe Image and Basic Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <img
              src={`https://images.unsplash.com/${recipe.image}?w=600&h=400&fit=crop`}
              alt={recipe.title}
              className="w-full h-64 lg:h-80 object-cover rounded-lg"
            />
            
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-gray-900">{recipe.title}</h1>
              <p className="text-lg text-gray-600">{recipe.description}</p>
              
              <div className="flex flex-wrap gap-2">
                {recipe.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Recipe Stats */}
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Total Time</p>
                    <p className="font-semibold">{recipe.cookTime + recipe.prepTime} mins</p>
                  </div>
                  <div className="text-center">
                    <Users className="w-6 h-6 text-primary mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Servings</p>
                    <p className="font-semibold">{recipe.servings}</p>
                  </div>
                  <div className="text-center">
                    <ChefHat className="w-6 h-6 text-primary mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Difficulty</p>
                    <p className="font-semibold">{recipe.difficulty}</p>
                  </div>
                  <div className="text-center">
                    <BookOpen className="w-6 h-6 text-primary mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Cuisine</p>
                    <p className="font-semibold">{recipe.cuisine}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Nutrition Info */}
            <Card>
              <CardHeader>
                <CardTitle>Nutrition (per serving)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-primary">{recipe.nutrition.calories}</p>
                    <p className="text-sm text-gray-600">Calories</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">{recipe.nutrition.protein}g</p>
                    <p className="text-sm text-gray-600">Protein</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{recipe.nutrition.carbs}g</p>
                    <p className="text-sm text-gray-600">Carbs</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-yellow-600">{recipe.nutrition.fat}g</p>
                    <p className="text-sm text-gray-600">Fat</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cook Mode Button */}
            <Button 
              size="lg" 
              className="w-full animate-pulse-glow"
              onClick={() => setCookMode(true)}
            >
              <Play className="w-5 h-5 mr-2" />
              Start Cook Mode
            </Button>
          </div>
        </div>

        {/* Ingredients */}
        <Card>
          <CardHeader>
            <CardTitle>Ingredients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Object.entries(ingredientsByCategory).map(([category, ingredients]) => (
                <div key={category} className="space-y-3">
                  <h3 className="font-semibold text-lg text-gray-800 border-b pb-2">
                    {category}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {ingredients.map((ingredient, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="flex-1">{ingredient.item}</span>
                        <span className="font-medium text-gray-700">{ingredient.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recipe.instructions.map((instruction, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleStep(index)}
                    className={`flex-shrink-0 w-8 h-8 rounded-full ${
                      completedSteps.includes(index) 
                        ? "bg-green-500 text-white border-green-500" 
                        : "bg-white"
                    }`}
                  >
                    {completedSteps.includes(index) ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </Button>
                  <p className={`flex-1 leading-relaxed ${
                    completedSteps.includes(index) ? "line-through text-gray-500" : ""
                  }`}>
                    {instruction}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RecipeDetailPage;

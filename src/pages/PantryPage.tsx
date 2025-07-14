
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import RecipeCard from "@/components/RecipeCard";
import { 
  Plus, 
  X, 
  ChefHat,
  Search,
  Sparkles,
  Edit
} from "lucide-react";

interface PantryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  expiration: string;
}

const PantryPage = () => {
  const [newIngredient, setNewIngredient] = useState({
    name: "",
    quantity: "",
    unit: "",
    category: "",
    expiration: ""
  });

  const [pantryItems, setPantryItems] = useState<PantryItem[]>([
    {
      id: "1",
      name: "Rice",
      quantity: 1,
      unit: "kg",
      category: "Grains",
      expiration: "2024-07-01"
    },
    {
      id: "2",
      name: "Lentils",
      quantity: 500,
      unit: "g",
      category: "Pulses",
      expiration: "2024-06-20"
    },
    {
      id: "3",
      name: "Tomatoes",
      quantity: 6,
      unit: "pieces",
      category: "Vegetables",
      expiration: "2024-07-05"
    },
    {
      id: "4",
      name: "Onions",
      quantity: 2,
      unit: "kg",
      category: "Vegetables",
      expiration: "2024-07-10"
    }
  ]);

  const [suggestions] = useState([
    "Chicken", "Paneer", "Potatoes", "Green Beans", "Spinach", "Coconut Milk", "Yogurt"
  ]);

  const units = ["kg", "g", "pieces", "liters", "ml", "cups", "tbsp", "tsp"];
  const categories = ["Grains", "Pulses", "Vegetables", "Fruits", "Dairy", "Meat", "Spices", "Oil"];

  const matchedRecipes = [
    {
      id: "1",
      title: "Jeera Rice",
      image: "photo-1618160702438-9b02ab6515c9",
      cookTime: 25,
      cuisine: "North Indian",
      difficulty: "Easy" as const,
      servings: 4,
      matchPercentage: 95,
      missingIngredients: ["Ghee"]
    },
    {
      id: "2",
      title: "Tomato Onion Curry",
      image: "photo-1721322800607-8c38375eef04", 
      cookTime: 30,
      cuisine: "Indian",
      difficulty: "Easy" as const,
      servings: 4,
      matchPercentage: 85,
      missingIngredients: ["Green Chilies", "Coriander Leaves"]
    }
  ];

  const addIngredient = () => {
    if (newIngredient.name.trim() && newIngredient.quantity && newIngredient.unit && newIngredient.category && newIngredient.expiration) {
      const newItem: PantryItem = {
        id: Date.now().toString(),
        name: newIngredient.name.trim(),
        quantity: parseFloat(newIngredient.quantity),
        unit: newIngredient.unit,
        category: newIngredient.category,
        expiration: newIngredient.expiration
      };
      setPantryItems([...pantryItems, newItem]);
      setNewIngredient({
        name: "",
        quantity: "",
        unit: "",
        category: "",
        expiration: ""
      });
    }
  };

  const removeIngredient = (id: string) => {
    setPantryItems(pantryItems.filter(item => item.id !== id));
  };

  const addSuggestion = (suggestion: string) => {
    setNewIngredient(prev => ({ ...prev, name: suggestion }));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <ChefHat className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-gray-900">Smart Pantry</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Add your available ingredients and we'll suggest recipes you can cook right now!
          </p>
        </div>

        {/* Add Ingredients Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add Ingredients</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Input
                placeholder="Ingredient name..."
                value={newIngredient.name}
                onChange={(e) => setNewIngredient(prev => ({ ...prev, name: e.target.value }))}
                className="lg:col-span-1"
              />
              <Input
                placeholder="Quantity"
                type="number"
                value={newIngredient.quantity}
                onChange={(e) => setNewIngredient(prev => ({ ...prev, quantity: e.target.value }))}
                className="lg:col-span-1"
              />
              <Select value={newIngredient.unit} onValueChange={(value) => setNewIngredient(prev => ({ ...prev, unit: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  {units.map(unit => (
                    <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={newIngredient.category} onValueChange={(value) => setNewIngredient(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Expiration date"
                type="date"
                value={newIngredient.expiration}
                onChange={(e) => setNewIngredient(prev => ({ ...prev, expiration: e.target.value }))}
                className="lg:col-span-1"
              />
            </div>

            <Button onClick={addIngredient} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Ingredient
            </Button>

            {/* Suggestions */}
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Quick add suggestions:</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion) => (
                  <Button
                    key={suggestion}
                    variant="outline"
                    size="sm"
                    onClick={() => addSuggestion(suggestion)}
                    className="text-xs"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pantry Items Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Your Pantry ({pantryItems.length} items)</span>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => setPantryItems([])}
                disabled={pantryItems.length === 0}
              >
                Clear All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pantryItems.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No ingredients added yet. Add some ingredients to see recipe suggestions!
              </p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Expiration</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pantryItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.unit}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{item.category}</Badge>
                        </TableCell>
                        <TableCell>{item.expiration}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeIngredient(item.id)}
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Button */}
        {pantryItems.length > 0 && (
          <div className="text-center">
            <Button size="lg" className="animate-pulse-glow">
              <Search className="w-5 h-5 mr-2" />
              Find Recipes I Can Cook
            </Button>
          </div>
        )}

        {/* Matched Recipes */}
        {pantryItems.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-gray-900">
                Recipes You Can Cook ({matchedRecipes.length})
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchedRecipes.map((recipe) => (
                <div key={recipe.id} className="space-y-3">
                  <RecipeCard {...recipe} />
                  {recipe.missingIngredients && recipe.missingIngredients.length > 0 && (
                    <Card className="bg-yellow-50 border-yellow-200">
                      <CardContent className="p-3">
                        <p className="text-sm text-yellow-800 font-medium">Missing ingredients:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {recipe.missingIngredients.map((ingredient) => (
                            <Badge 
                              key={ingredient}
                              variant="outline"
                              className="text-xs text-yellow-700 border-yellow-300"
                            >
                              {ingredient}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ))}
            </div>

            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Can't find what you're looking for? Try adding more ingredients to your pantry.
              </p>
              <Button variant="outline">
                Browse All Recipes
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PantryPage;

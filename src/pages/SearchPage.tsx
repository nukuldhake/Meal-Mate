
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import RecipeCard from "@/components/RecipeCard";
import { Search, Filter, Clock, Users } from "lucide-react";

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("all");
  const [cookingTime, setCookingTime] = useState([60]);
  const [ingredientCount, setIngredientCount] = useState([20]);
  const [showFilters, setShowFilters] = useState(false);

  const cuisines = [
    { value: "all", label: "All Cuisines" },
    { value: "north-indian", label: "North Indian" },
    { value: "south-indian", label: "South Indian" },
    { value: "gujarati", label: "Gujarati" },
    { value: "punjabi", label: "Punjabi" },
    { value: "bengali", label: "Bengali" },
    { value: "maharashtrian", label: "Maharashtrian" }
  ];

  const searchResults = [
    {
      id: "1",
      title: "Butter Chicken",
      image: "photo-1618160702438-9b02ab6515c9",
      cookTime: 45,
      cuisine: "North Indian",
      difficulty: "Medium" as const,
      servings: 4,
      isFavorite: true
    },
    {
      id: "2",
      title: "Masala Dosa",
      image: "photo-1721322800607-8c38375eef04",
      cookTime: 30,
      cuisine: "South Indian",
      difficulty: "Easy" as const,
      servings: 2
    },
    {
      id: "3",
      title: "Rajma Chawal",
      image: "photo-1465146344425-f00d5f5c8f07",
      cookTime: 60,
      cuisine: "North Indian",
      difficulty: "Medium" as const,
      servings: 6
    },
    {
      id: "4",
      title: "Poha",
      image: "photo-1506744038136-46273834b3fb",
      cookTime: 15,
      cuisine: "Maharashtrian",
      difficulty: "Easy" as const,
      servings: 2
    },
    {
      id: "5",
      title: "Idli Sambar",
      image: "photo-1618160702438-9b02ab6515c9",
      cookTime: 25,
      cuisine: "South Indian",
      difficulty: "Easy" as const,
      servings: 4
    },
    {
      id: "6",
      title: "Paneer Butter Masala",
      image: "photo-1721322800607-8c38375eef04",
      cookTime: 35,
      cuisine: "North Indian",
      difficulty: "Medium" as const,
      servings: 4
    }
  ];

  const popularSearches = [
    "Biryani", "Dal Tadka", "Paneer Tikka", "Chicken Curry", "Aloo Gobi", "Chole Bhature"
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Search Header */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">Search Recipes</h1>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              placeholder="Search by recipe name or ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 h-12 text-lg"
            />
          </div>

          {/* Popular Searches */}
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Popular searches:</p>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((search) => (
                <Button
                  key={search}
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchQuery(search)}
                  className="text-xs"
                >
                  {search}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center space-x-2">
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden"
              >
                {showFilters ? "Hide" : "Show"} Filters
              </Button>
            </div>

            <div className={`space-y-6 ${showFilters ? "block" : "hidden md:block"}`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Cuisine Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Cuisine</label>
                  <Select value={selectedCuisine} onValueChange={setSelectedCuisine}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select cuisine" />
                    </SelectTrigger>
                    <SelectContent>
                      {cuisines.map((cuisine) => (
                        <SelectItem key={cuisine.value} value={cuisine.value}>
                          {cuisine.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Cooking Time Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>Max Cooking Time: {cookingTime[0]} mins</span>
                  </label>
                  <Slider
                    value={cookingTime}
                    onValueChange={setCookingTime}
                    max={120}
                    min={10}
                    step={5}
                    className="w-full"
                  />
                </div>

                {/* Ingredient Count Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>Max Ingredients: {ingredientCount[0]}</span>
                  </label>
                  <Slider
                    value={ingredientCount}
                    onValueChange={setIngredientCount}
                    max={30}
                    min={5}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Active Filters */}
              <div className="flex flex-wrap gap-2">
                {selectedCuisine !== "all" && (
                  <Badge variant="secondary" className="flex items-center space-x-1">
                    <span>{cuisines.find(c => c.value === selectedCuisine)?.label}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedCuisine("all")}
                      className="p-0 h-auto hover:bg-transparent ml-1"
                    >
                      ×
                    </Button>
                  </Badge>
                )}
                {cookingTime[0] < 60 && (
                  <Badge variant="secondary" className="flex items-center space-x-1">
                    <span>≤ {cookingTime[0]} mins</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCookingTime([60])}
                      className="p-0 h-auto hover:bg-transparent ml-1"
                    >
                      ×
                    </Button>
                  </Badge>
                )}
                {ingredientCount[0] < 20 && (
                  <Badge variant="secondary" className="flex items-center space-x-1">
                    <span>≤ {ingredientCount[0]} ingredients</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIngredientCount([20])}
                      className="p-0 h-auto hover:bg-transparent ml-1"
                    >
                      ×
                    </Button>
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Search Results ({searchResults.length} recipes)
            </h2>
            <Select defaultValue="relevance">
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Most Relevant</SelectItem>
                <SelectItem value="time-asc">Cook Time (Low to High)</SelectItem>
                <SelectItem value="time-desc">Cook Time (High to Low)</SelectItem>
                <SelectItem value="difficulty">Difficulty</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((recipe) => (
              <RecipeCard key={recipe.id} {...recipe} />
            ))}
          </div>

          {/* Load More */}
          <div className="text-center py-8">
            <Button variant="outline">
              Load More Recipes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;

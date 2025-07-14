
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import RecipeCard from "@/components/RecipeCard";
import { 
  ChefHat, 
  Clock, 
  TrendingUp, 
  Utensils,
  ArrowRight,
  Star,
  Users
} from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const featuredRecipes = [
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
      title: "Biryani",
      image: "photo-1465146344425-f00d5f5c8f07",
      cookTime: 60,
      cuisine: "Hyderabadi",
      difficulty: "Hard" as const,
      servings: 6
    }
  ];

  const quickRecipes = [
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
      title: "Upma",
      image: "photo-1618160702438-9b02ab6515c9",
      cookTime: 20,
      cuisine: "South Indian",
      difficulty: "Easy" as const,
      servings: 3
    }
  ];

  const stats = [
    {
      title: "Recipes Cooked",
      value: "24",
      icon: <ChefHat className="w-5 h-5" />,
      trend: "+3 this week"
    },
    {
      title: "Avg Cook Time",
      value: "28 min",
      icon: <Clock className="w-5 h-5" />,
      trend: "-5 min improved"
    },
    {
      title: "Pantry Items",
      value: "18",
      icon: <Utensils className="w-5 h-5" />,
      trend: "+2 new items"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Good morning, Chef! 👋</h1>
              <p className="text-gray-600 mt-2">Ready to cook something delicious today?</p>
            </div>
            <Link to="/pantry">
              <Button className="hidden md:flex">
                <ChefHat className="w-4 h-4 mr-2" />
                Quick Cook
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="flex items-center p-4">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary mr-4">
                    {stat.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-green-600">{stat.trend}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Featured Recipes Carousel */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Featured Recipes</h2>
            <Link to="/search">
              <Button variant="outline" size="sm">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} {...recipe} />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/pantry">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center space-y-2">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mx-auto">
                  <ChefHat className="w-6 h-6" />
                </div>
                <h3 className="font-semibold">Smart Pantry</h3>
                <p className="text-sm text-gray-600">Find recipes with your ingredients</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/quick-recipes">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center space-y-2">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mx-auto">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="font-semibold">Quick Recipes</h3>
                <p className="text-sm text-gray-600">Meals ready in 30 minutes</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/cuisine-explorer">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center space-y-2">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mx-auto">
                  <Star className="w-6 h-6" />
                </div>
                <h3 className="font-semibold">Cuisine Explorer</h3>
                <p className="text-sm text-gray-600">Discover regional cuisines</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/suggestions">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center space-y-2">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mx-auto">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="font-semibold">Smart Suggestions</h3>
                <p className="text-sm text-gray-600">AI-powered recommendations</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Quick Recipes Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Quick Recipes (≤30 mins)</h2>
            <Link to="/quick-recipes">
              <Button variant="outline" size="sm">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quickRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} {...recipe} />
            ))}
          </div>
        </div>

        {/* Browse by Cuisine */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Browse by Cuisine</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              "North Indian",
              "South Indian", 
              "Gujarati",
              "Punjabi",
              "Bengali",
              "Maharashtrian"
            ].map((cuisine) => (
              <Link key={cuisine} to={`/cuisine/${cuisine.toLowerCase().replace(' ', '-')}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <Badge variant="secondary" className="w-full">
                      {cuisine}
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

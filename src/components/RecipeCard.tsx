
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, Heart } from "lucide-react";
import { Link } from "react-router-dom";

interface RecipeCardProps {
  id: string;
  title: string;
  image: string;
  cookTime: number;
  cuisine: string;
  difficulty: "Easy" | "Medium" | "Hard";
  servings?: number;
  isFavorite?: boolean;
  matchPercentage?: number;
  className?: string;
}

const RecipeCard = ({
  id,
  title,
  image,
  cookTime,
  cuisine,
  difficulty,
  servings = 4,
  isFavorite = false,
  matchPercentage,
  className = ""
}: RecipeCardProps) => {
  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 cursor-pointer ${className}`}>
      <CardContent className="p-0">
        <div className="relative">
          <img
            src={`https://images.unsplash.com/${image}?w=400&h=300&fit=crop`}
            alt={title}
            className="w-full h-48 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3 flex gap-2">
            {matchPercentage && (
              <Badge variant="secondary" className="bg-green-100 text-green-800 font-semibold">
                {matchPercentage}% match
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              className={`p-2 rounded-full ${
                isFavorite ? "text-red-500 bg-white/90" : "text-gray-600 bg-white/90"
              } hover:bg-white`}
            >
              <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
            </Button>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg line-clamp-2 flex-1">{title}</h3>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{cookTime} mins</span>
            </div>
            <div className="flex items-center gap-1">
              <Users size={14} />
              <span>{servings} servings</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Badge variant="outline" className="text-xs">
                {cuisine}
              </Badge>
              <Badge 
                variant="outline" 
                className={`text-xs ${
                  difficulty === "Easy" ? "text-green-600 border-green-200" :
                  difficulty === "Medium" ? "text-yellow-600 border-yellow-200" :
                  "text-red-600 border-red-200"
                }`}
              >
                {difficulty}
              </Badge>
            </div>
            
            <Link to={`/recipe/${id}`}>
              <Button size="sm" className="text-xs">
                View Recipe
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecipeCard;


import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Menu, 
  Bell, 
  User,
  Heart,
  ChefHat,
  Home,
  Calendar
} from "lucide-react";

const Header = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === "/signin" || location.pathname === "/signup";
  const isLandingPage = location.pathname === "/";

  if (isAuthPage) return null;

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <ChefHat className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">MealMate</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {!isLandingPage && (
            <nav className="hidden md:flex items-center space-x-8">
              <Link 
                to="/dashboard" 
                className={`flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === "/dashboard" ? "text-primary" : "text-gray-700"
                }`}
              >
                <Home size={16} />
                <span>Home</span>
              </Link>
              <Link 
                to="/search" 
                className={`flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === "/search" ? "text-primary" : "text-gray-700"
                }`}
              >
                <Search size={16} />
                <span>Search</span>
              </Link>
              <Link 
                to="/pantry" 
                className={`flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === "/pantry" ? "text-primary" : "text-gray-700"
                }`}
              >
                <ChefHat size={16} />
                <span>Pantry</span>
              </Link>
              <Link 
                to="/meal-planner" 
                className={`flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === "/meal-planner" ? "text-primary" : "text-gray-700"
                }`}
              >
                <Calendar size={16} />
                <span>Planner</span>
              </Link>
              <Link 
                to="/favorites" 
                className={`flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === "/favorites" ? "text-primary" : "text-gray-700"
                }`}
              >
                <Heart size={16} />
                <span>Favorites</span>
              </Link>
            </nav>
          )}

          {/* Search Bar (only on certain pages) */}
          {!isLandingPage && location.pathname !== "/search" && (
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  placeholder="Search recipes..."
                  className="pl-10 pr-4"
                />
              </div>
            </div>
          )}

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {isLandingPage ? (
              <div className="flex items-center space-x-3">
                <Link to="/signin">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">
                    Get Started
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <Button variant="ghost" size="sm" className="hidden md:flex">
                  <Bell size={16} />
                </Button>
                <Button variant="ghost" size="sm">
                  <User size={16} />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;


import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ChefHat, 
  Clock, 
  Search, 
  Utensils, 
  Heart,
  Users,
  Sparkles,
  ArrowRight,
  Github
} from "lucide-react";

const LandingPage = () => {
  const features = [
    {
      icon: <ChefHat className="w-8 h-8 text-primary" />,
      title: "Smart Pantry",
      description: "Add your available ingredients and get personalized recipe recommendations that match what you have."
    },
    {
      icon: <Clock className="w-8 h-8 text-primary" />,
      title: "Quick Recipes",
      description: "Discover delicious meals you can cook in 15-30 minutes, perfect for busy weekdays."
    },
    {
      icon: <Search className="w-8 h-8 text-primary" />,
      title: "Cuisine Explorer",
      description: "Explore authentic Indian cuisines from different regions - South Indian, Punjabi, Gujarati, and more."
    },
    {
      icon: <Sparkles className="w-8 h-8 text-primary" />,
      title: "Smart Suggestions",
      description: "Get AI-powered recipe recommendations based on your taste preferences and cooking history."
    }
  ];

  const steps = [
    {
      step: "01",
      title: "Add Your Pantry",
      description: "Tell us what ingredients you have available in your kitchen",
      icon: <Utensils className="w-6 h-6" />
    },
    {
      step: "02", 
      title: "Discover Recipes",
      description: "Get matched with recipes based on your ingredients and preferences",
      icon: <Search className="w-6 h-6" />
    },
    {
      step: "03",
      title: "Start Cooking",
      description: "Follow step-by-step instructions with our guided cook mode",
      icon: <ChefHat className="w-6 h-6" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-24">
        <div className="text-center space-y-8 animate-fade-in-up">
          <div className="space-y-4">
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              Discover Indian Recipes Like Never Before
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
              Cook Delicious
              <span className="text-primary block">Indian Meals 🍲</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Transform your kitchen ingredients into authentic Indian dishes with personalized recipe recommendations powered by smart technology.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/signup">
              <Button size="lg" className="w-full sm:w-auto animate-pulse-glow">
                Get Started Free
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link to="/signin">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-8 text-sm text-gray-500 mt-8">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>10,000+ recipes</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              <span>5,000+ users</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Save 30+ mins daily</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Why Choose MealMate?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to make Indian cooking accessible, enjoyable, and personalized for every home chef.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow duration-300">
                <CardContent className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get from ingredients to delicious meals in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="relative">
                  <div className="mx-auto w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white font-bold text-2xl mb-6">
                    {step.step}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-10 left-1/2 w-full h-0.5 bg-gray-300 transform translate-x-1/2"></div>
                  )}
                </div>
                <div className="space-y-3">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-white">
        <div className="container mx-auto px-4 text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to Transform Your Cooking?
          </h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Join thousands of home chefs who have discovered the joy of cooking authentic Indian meals with MealMate.
          </p>
          <Link to="/signup">
            <Button size="lg" variant="secondary" className="animate-pulse-glow">
              Start Cooking Today
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <ChefHat className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">MealMate</span>
              </div>
              <p className="text-gray-400">
                Discover and cook authentic Indian recipes with personalized recommendations.
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Quick Links</h4>
              <div className="space-y-2">
                <Link to="/about" className="block text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
                <Link to="/contact" className="block text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
                <Link to="/privacy" className="block text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Connect</h4>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" asChild>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                    <Github className="w-5 h-5" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2024 MealMate. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

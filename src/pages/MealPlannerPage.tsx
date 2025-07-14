import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar,
  Save,
  Sparkles,
  Trash2,
  ShoppingCart,
  Clock
} from "lucide-react";

interface MealPlan {
  [key: string]: {
    breakfast?: string;
    lunch?: string;
    dinner?: string;
    snack?: string;
  };
}

const MealPlannerPage = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [mealPlan, setMealPlan] = useState<MealPlan>({
    monday: {
      breakfast: "Poha with Vegetables",
      lunch: "Dal Rice",
      dinner: "Roti with Sabzi"
    },
    tuesday: {
      breakfast: "Upma",
      lunch: "Chole Rice"
    },
    wednesday: {
      dinner: "Biryani"
    }
  });

  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const mealTypes = [
    { key: 'breakfast', label: 'B', fullLabel: 'Breakfast', icon: '🌅' },
    { key: 'lunch', label: 'L', fullLabel: 'Lunch', icon: '☀️' },
    { key: 'dinner', label: 'D', fullLabel: 'Dinner', icon: '🌙' },
    { key: 'snack', label: 'S', fullLabel: 'Snack', icon: '🍎' }
  ];

  const getCurrentDay = () => {
    const today = new Date();
    const dayName = today.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    return dayName;
  };

  const getTodaysMeals = () => {
    const today = getCurrentDay();
    return mealPlan[today] || {};
  };

  const getTodaysDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getWeekRange = (date: Date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    return {
      start: startOfWeek,
      end: endOfWeek
    };
  };

  const formatWeekRange = (date: Date) => {
    const { start, end } = getWeekRange(date);
    const startMonth = start.toLocaleDateString('en-US', { month: 'long' });
    const endMonth = end.toLocaleDateString('en-US', { month: 'long' });
    
    if (startMonth === endMonth) {
      return `${startMonth} ${start.getDate()} - ${end.getDate()}`;
    } else {
      return `${startMonth} ${start.getDate()} - ${endMonth} ${end.getDate()}`;
    }
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newDate);
  };

  const addMealToDay = (day: string, mealType: string) => {
    // In a real app, this would open a modal to select/add a recipe
    const mealName = prompt(`Add ${mealType} for ${day}:`);
    if (mealName) {
      setMealPlan(prev => ({
        ...prev,
        [day]: {
          ...prev[day],
          [mealType]: mealName
        }
      }));
    }
  };

  const removeMeal = (day: string, mealType: string) => {
    setMealPlan(prev => {
      const updatedDay = { ...prev[day] };
      delete updatedDay[mealType as keyof typeof updatedDay];
      return {
        ...prev,
        [day]: updatedDay
      };
    });
  };

  const savePlan = () => {
    alert('Meal plan saved successfully!');
  };

  const autoGenerate = () => {
    alert('Auto-generating meal plan based on your preferences...');
  };

  const clearPlan = () => {
    if (confirm('Are you sure you want to clear the entire meal plan?')) {
      setMealPlan({});
    }
  };

  const generateShoppingList = () => {
    alert('Generating shopping list from your meal plan...');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Calendar className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-gray-900">Meal Planner</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Plan your weekly meals and generate shopping lists automatically
          </p>
        </div>

        {/* Today's Meals Section */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-blue-800">
              <Clock className="w-5 h-5" />
              <span>Today's Meals</span>
              <Badge variant="outline" className="ml-2 text-xs">
                {getTodaysDate()}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {mealTypes.map((mealType) => {
                const todaysMeals = getTodaysMeals();
                const meal = todaysMeals[mealType.key as keyof typeof todaysMeals];
                
                return (
                  <div
                    key={mealType.key}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      meal 
                        ? 'bg-white border-green-200 shadow-sm' 
                        : 'bg-gray-50 border-dashed border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-lg">{mealType.icon}</span>
                      <h3 className="font-semibold text-gray-800">{mealType.fullLabel}</h3>
                    </div>
                    {meal ? (
                      <div>
                        <p className="text-sm text-gray-700 font-medium">{meal}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Traditional Indian meal rich in flavor and nutrition
                        </p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <p className="text-sm text-gray-400 mb-2">No meal planned</p>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => addMealToDay(getCurrentDay(), mealType.key)}
                          className="text-xs"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add Meal
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Week Navigation */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateWeek('prev')}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <h2 className="text-xl font-semibold text-center">
                {formatWeekRange(currentWeek)}
              </h2>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateWeek('next')}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Meal Grid */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <div className="min-w-full">
                {/* Header Row */}
                <div className="grid grid-cols-8 border-b bg-gray-50">
                  <div className="p-4 font-semibold text-sm text-gray-700 border-r">
                    Meal
                  </div>
                  {dayLabels.map((day) => (
                    <div key={day} className="p-4 font-semibold text-sm text-gray-700 text-center border-r last:border-r-0">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Meal Rows */}
                {mealTypes.map((mealType) => (
                  <div key={mealType.key} className="grid grid-cols-8 border-b last:border-b-0">
                    <div className="p-4 font-medium text-sm bg-gray-50 border-r flex items-center">
                      <Badge variant="outline" className="text-xs">
                        {mealType.label}
                      </Badge>
                      <span className="ml-2 hidden sm:inline">{mealType.fullLabel}</span>
                    </div>
                    
                    {daysOfWeek.map((day) => (
                      <div key={`${day}-${mealType.key}`} className="p-2 border-r last:border-r-0 min-h-[80px]">
                        {mealPlan[day]?.[mealType.key as keyof typeof mealPlan[typeof day]] ? (
                          <div className="space-y-2">
                            <div className="text-xs text-gray-800 bg-blue-50 p-2 rounded border">
                              {mealPlan[day][mealType.key as keyof typeof mealPlan[typeof day]]}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeMeal(day, mealType.key)}
                              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => addMealToDay(day, mealType.key)}
                            className="w-full h-full flex items-center justify-center text-gray-400 hover:text-gray-600 border-2 border-dashed border-gray-200 hover:border-gray-300"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 justify-center">
          <Button onClick={savePlan} className="flex items-center space-x-2">
            <Save className="w-4 h-4" />
            <span>Save Plan</span>
          </Button>
          
          <Button onClick={autoGenerate} variant="outline" className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4" />
            <span>Auto-generate</span>
          </Button>
          
          <Button onClick={clearPlan} variant="outline" className="flex items-center space-x-2">
            <Trash2 className="w-4 h-4" />
            <span>Clear Plan</span>
          </Button>
          
          <Button onClick={generateShoppingList} variant="secondary" className="flex items-center space-x-2">
            <ShoppingCart className="w-4 h-4" />
            <span>Shopping List</span>
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">
                {Object.values(mealPlan).reduce((total, day) => 
                  total + Object.keys(day).length, 0
                )}
              </div>
              <div className="text-sm text-gray-600">Meals Planned</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {Object.keys(mealPlan).length}
              </div>
              <div className="text-sm text-gray-600">Days Covered</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {7 - Object.keys(mealPlan).length}
              </div>
              <div className="text-sm text-gray-600">Days Remaining</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MealPlannerPage;

// Temporary sample recipes, shaped like the rows in the recipes table.
// Swap this for api.get("/recipes") once the backend route is ready.
export const SAMPLE_RECIPES = [
  { id: 1, title: "Chicken Rice Bowl", description: "Simple chicken and rice meal", prep_minutes: 10, cook_minutes: 25, servings: 2, meal_type: "Dinner", have_count: 5, total_count: 7 },
  { id: 2, title: "Scrambled Eggs", description: "Quick breakfast", prep_minutes: 5, cook_minutes: 5, servings: 1, meal_type: "Breakfast", have_count: 3, total_count: 3 },
  { id: 3, title: "Veggie Pasta", description: "Pasta with whatever veggies you have", prep_minutes: 10, cook_minutes: 15, servings: 3, meal_type: "Dinner", have_count: 4, total_count: 6 },
  { id: 4, title: "Overnight Oats", description: "Make tonight, eat tomorrow", prep_minutes: 5, cook_minutes: 0, servings: 1, meal_type: "Breakfast", have_count: 2, total_count: 5 },
  { id: 5, title: "Turkey Sandwich", description: "Easy lunch in five minutes", prep_minutes: 5, cook_minutes: 0, servings: 1, meal_type: "Lunch", have_count: 1, total_count: 4 },
  { id: 6, title: "Tomato Soup", description: "Warm and simple", prep_minutes: 10, cook_minutes: 20, servings: 4, meal_type: "Lunch", have_count: 0, total_count: 5 },
];

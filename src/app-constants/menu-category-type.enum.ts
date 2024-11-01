import { registerEnumType } from '@nestjs/graphql';

export enum CuisineType {
  Indian = 'Indian',
  Chiness = 'Chinese',
  Italian = 'Italian',
  Mexican = 'Mexican',
}

registerEnumType(CuisineType, {
  name: 'CuisineType',
});

export enum MealType {
  Breakfast = 'Breakfast',
  Lunch = 'Lunch',
  Dinner = 'Dinner',
  Snacks = 'Snacks',
  Desserts = 'Desserts',
}
registerEnumType(MealType, {
  name: 'MealType',
});

export enum DietaryPreference {
  Vegetarian = 'Vegetarian',
  Vegan = 'Vegan',
  GlutenFree = 'Gluten-Free',
  LowCard = 'Low-Carb',
  Keto = 'Keto',
}
registerEnumType(DietaryPreference, {
  name: 'DietaryPreference',
});

export enum Specialty {
  ChefsSpecials = 'Chef’s Specials',
  SeasonalDishes = 'Seasonal Dishes',
  FamilyMeals = 'Family Meals',
  ComboDeals = 'Combo Deals',
}
registerEnumType(Specialty, {
  name: 'Specialty',
});

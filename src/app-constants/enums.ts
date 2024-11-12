import { registerEnumType } from '@nestjs/graphql';

//#region  MENU ENUMS
export enum CuisineType {
  INDIAN = 'Indian',
  CHINESE = 'Chinese',
  ITALIAN = 'Italian',
  MEXICAN = 'Mexican',
}

registerEnumType(CuisineType, {
  name: 'CuisineType',
});

export enum MealType {
  BREAKFAST = 'Breakfast',
  LUNCH = 'Lunch',
  DINNER = 'Dinner',
  SNACKS = 'Snacks',
  DESSERTS = 'Desserts',
}
registerEnumType(MealType, {
  name: 'MealType',
});

export enum DietaryPreference {
  VEGETARIAN = 'Vegetarian',
  VEGAN = 'Vegan',
  GLUTEN_FREE = 'Gluten-Free',
  LOW_CARB = 'Low-Carb',
  KETO = 'Keto',
}
registerEnumType(DietaryPreference, {
  name: 'DietaryPreference',
});

export enum Specialty {
  CHEFS_SPECIALS = 'Chef’s Specials',
  SEASONAL_DISHES = 'Seasonal Dishes',
  FAMILY_MEALS = 'Family Meals',
  COMBO_DEALS = 'Combo Deals',
}
registerEnumType(Specialty, {
  name: 'Specialty',
});

//#endregion

//#region  ROLES ENUMS

export enum RoleType {
  ADMIN = 'ADMIN',
  PARTNER = 'PARTNER',
  CUSTOMER = 'CUSTOMER',
}

registerEnumType(RoleType, {
  name: 'RoleType',
});

//#endregion

//#region  ADDRESS ENUMS

export enum AddressTag {
  HOME = 'HOME',
  WORK = 'WORK',
  OTHER = 'OTHER',
}
registerEnumType(AddressTag, {
  name: 'AddressTag',
});

//#endregion

//#region  RESOURCE ACTION ENUM

export enum ResourceAction {
  CREATE = 'Create',
  READ = 'Read',
  UPDATE = 'Update',
  DELETE = 'Delet',
}
registerEnumType(ResourceAction, {
  name: 'ResourceAction',
});

//#endregion

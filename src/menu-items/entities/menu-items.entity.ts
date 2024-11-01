import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  CuisineType,
  DietaryPreference,
  MealType,
  Specialty,
} from 'src/app-constants/menu-category-type.enum';
import { BaseEntity } from 'src/common/entities/base.entity';

@Schema({ collection: 'menu-items' })
export class MenuItemsEntity extends BaseEntity {
  @Prop()
  name: string;
  @Prop()
  description: string;
  @Prop()
  price: number;
  @Prop()
  tag: string;
  @Prop()
  rating: number;
  @Prop()
  ratingCount: number;
  @Prop()
  isVeg: boolean;
  @Prop(() => CuisineType)
  cuisineType: CuisineType;
  @Prop(() => MealType)
  mealType: MealType;
  @Prop(() => DietaryPreference)
  dietaryPreference: DietaryPreference;
  @Prop(() => Specialty)
  specialty: Specialty;
}

export const MenuItemsSchema = SchemaFactory.createForClass(MenuItemsEntity);

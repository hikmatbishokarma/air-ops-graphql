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
  partnerId: string;
  @Prop({ index: true })
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
  @Prop({ type: String, enum: CuisineType })
  cuisineType: CuisineType;
  @Prop({ type: String, enum: MealType })
  mealType: MealType;
  @Prop({ type: String, enum: DietaryPreference })
  dietaryPreference: DietaryPreference;
  @Prop({ type: String, enum: Specialty })
  specialty: Specialty;
}

export const MenuItemsSchema = SchemaFactory.createForClass(MenuItemsEntity);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import {
  CuisineType,
  DietaryPreference,
  MealType,
  PopularityTags,
  Specialty,
} from 'src/app-constants/enums';
import { BaseEntity } from 'src/common/entities/base.entity';

@Schema({ collection: 'menu-items' })
export class MenuItemsEntity extends BaseEntity {
  @Prop({ ref: 'UserEntity', type: SchemaTypes.ObjectId, required: true })
  partner: Types.ObjectId;
  @Prop({ index: true })
  name: string;
  @Prop()
  description: string;
  @Prop()
  price: number;
  @Prop({ type: String, enum: PopularityTags })
  tag: PopularityTags;
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

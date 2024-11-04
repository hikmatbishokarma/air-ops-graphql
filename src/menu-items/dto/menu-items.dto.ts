import {
  FilterableField,
  PagingStrategies,
  QueryOptions,
} from '@app/query-graphql';
import { Field, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsNumber, IsString } from 'class-validator';
import {
  CuisineType,
  DietaryPreference,
  MealType,
  Specialty,
} from 'src/app-constants/menu-category-type.enum';
import { BaseDTO } from 'src/common/dtos/base.dto';

@ObjectType('MenuItem', { description: 'Menu Items' })
@QueryOptions({
  enableTotalCount: true,
  pagingStrategy: PagingStrategies.OFFSET,
})
export class MenuItemsDTO extends BaseDTO {
  @IsString()
  @FilterableField()
  name: string;
  @IsString()
  @Field()
  description: string;
  @IsNumber()
  @FilterableField()
  price: number;
  @FilterableField()
  tag: string;
  @IsNumber()
  @FilterableField()
  rating: number;
  @IsNumber()
  @FilterableField({ nullable: true, defaultValue: 0 })
  ratingCount: number;
  @IsBoolean()
  @FilterableField()
  isVeg: boolean;
  @FilterableField(() => CuisineType)
  cuisineType: CuisineType;
  @FilterableField(() => MealType)
  mealType: MealType;
  @FilterableField(() => DietaryPreference, { nullable: true })
  dietaryPreference: DietaryPreference;
  @FilterableField(() => Specialty, { nullable: true })
  specialty: Specialty;
}

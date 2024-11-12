import {
  FilterableField,
  PagingStrategies,
  QueryOptions,
  Relation,
} from '@app/query-graphql';
import { Field, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsNumber, IsString } from 'class-validator';
import {
  CuisineType,
  DietaryPreference,
  MealType,
  PopularityTags,
  Specialty,
} from 'src/app-constants/enums';
import { BaseDTO } from 'src/common/dtos/base.dto';
import { UserDTO } from 'src/users/dto/users.dto';

@ObjectType('MenuItem', { description: 'Menu Items' })
@QueryOptions({
  enableTotalCount: true,
  pagingStrategy: PagingStrategies.OFFSET,
})
@Relation('partner', () => UserDTO, { disableRemove: true })
export class MenuItemsDTO extends BaseDTO {
  @IsString()
  @FilterableField()
  partner: string;
  @IsString()
  @FilterableField()
  name: string;
  @IsString()
  @Field()
  description: string;
  @IsNumber()
  @FilterableField()
  price: number;
  @IsNumber()
  @FilterableField()
  rating: number;
  @IsNumber()
  @FilterableField({ nullable: true, defaultValue: 0 })
  ratingCount: number;
  @IsBoolean()
  @FilterableField()
  isVeg: boolean;
  @FilterableField(() => PopularityTags)
  tag: PopularityTags;
  @FilterableField(() => MealType)
  mealType: MealType;
  @FilterableField(() => CuisineType, { nullable: true })
  cuisineType: CuisineType;
  @FilterableField(() => DietaryPreference, { nullable: true })
  dietaryPreference: DietaryPreference;
  @FilterableField(() => Specialty, { nullable: true })
  specialty: Specialty;
}

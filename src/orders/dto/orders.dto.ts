import { FilterableField } from '@app/query-graphql';
import { Field, Float, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { GraphQLJSONObject } from 'graphql-type-json';
import { BaseDTO } from 'src/common/dtos/base.dto';

export class MenuItems {
  @Field()
  menuId: string;
  @IsNumber()
  @Field()
  quantity: number;
  @IsNumber()
  @Field(() => Float)
  price: number;
}

@ObjectType('order', { description: 'Orders' })
export class OrdersDTO extends BaseDTO {
  @IsNotEmpty()
  @FilterableField()
  orderId: string;
  @FilterableField()
  userId: string;
  @FilterableField()
  orderStatus: string;
  @Field(() => [GraphQLJSONObject])
  menuItems: MenuItems[];
  @FilterableField()
  orderDate: Date;
  @Field({ nullable: true })
  instructions: string;
  @FilterableField()
  partnerId: string;
  @IsNumber()
  @FilterableField(() => Float)
  totalAmount: number;
  @Field({ nullable: true })
  deliveryAddress: string;
}

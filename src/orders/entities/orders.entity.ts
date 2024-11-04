import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from 'src/common/entities/base.entity';
import { MenuItemsSchema } from 'src/menu-items/entities/menu-items.entity';
import { IMenuItems } from '../interfaces/schema.interface';

@Schema()
export class MenuItems {
  @Prop()
  menuId: string;

  @Prop()
  quantity: number;

  @Prop()
  price: number;
}

@Schema({ collection: 'orders' })
export class OrderEntity extends BaseEntity {
  @Prop({ unique: true, index: true })
  orderId: string;
  @Prop()
  userId: string;
  @Prop()
  orderStatus: string;
  @Prop({ type: [MenuItemsSchema] })
  menuItems: IMenuItems[];
  @Prop()
  orderDate: Date;
  @Prop()
  instructions: string;
  @Prop()
  partnerId: string;

  @Prop()
  totalAmount: number;
  @Prop()
  deliveryAddress: string;
}

export const OrdersSchema = SchemaFactory.createForClass(OrderEntity);

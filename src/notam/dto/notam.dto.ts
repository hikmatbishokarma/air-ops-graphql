import { BeforeCreateOne, BeforeUpdateOne, FilterableField, PagingStrategies, QueryOptions, Relation } from '@app/query-graphql';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { NotamCategory, RegionCode } from 'src/app-constants/enums';
import { BaseDTO } from 'src/common/dtos/base.dto';
import { CreatedByHook } from 'src/common/hooks/created-by.hook';
import { UpdatedByHook } from 'src/common/hooks/updated-by.hook';
import { CrewDetailDto } from 'src/crew-details/dto/crew-detail.dto';
import { OperatorDto } from 'src/operator/dto/operator.dto';


@ObjectType('Notam', { description: 'Notam ' })
@QueryOptions({
    enableTotalCount: true,
    pagingStrategy: PagingStrategies.OFFSET,
})
@InputType()
@Relation('operator', () => OperatorDto, {
    disableRemove: true,
    nullable: true,
})
@Relation('createdBy', () => CrewDetailDto, {
    disableRemove: true,
    nullable: true,
})
@Relation('updatedBy', () => CrewDetailDto, {
    disableRemove: true,
    nullable: true,
})
@BeforeCreateOne(CreatedByHook)
@BeforeUpdateOne(UpdatedByHook)
export class NotamDto extends BaseDTO {
    @FilterableField(() => NotamCategory)
    category: NotamCategory;

    @FilterableField(() => RegionCode)
    region: RegionCode;

    @FilterableField({ nullable: true })
    fileName: string;

    // @FilterableField()
    // fileUrl: string;

    @FilterableField({ nullable: true })
    operatorId: string;
}

import { FilterableField, QueryOptions, PagingStrategies } from '@app/query-graphql';
import { ObjectType, Field } from '@nestjs/graphql';
import { BaseDTO } from 'src/common/dtos/base.dto';

@ObjectType('noticeBoard')
@QueryOptions({
    enableTotalCount: true,
    pagingStrategy: PagingStrategies.OFFSET,
})
export class NoticeBoardDto extends BaseDTO {
    @FilterableField()
    message: string;

    @FilterableField()
    startDate: Date;

    @FilterableField()
    endDate: Date;
}

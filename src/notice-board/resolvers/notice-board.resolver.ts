import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { NoticeBoardService } from '../services/notice-board.service';
import { NoticeBoardDto } from '../dto/notice-board.dto';
import { CreateNoticeBoardInput } from '../inputs/create-notice-board.input';
import { GqlAuthGuard } from '../../auth/gql-auth.guard';
import { GqlRolesGuard } from '../../roles/gql-roles.guard';
import { Roles } from '../../roles/roles.decorator';
import { RoleType } from '../../app-constants/enums';
import { CurrentUser } from '../../users/current-user.decorator';
import { CrewDetailDto } from 'src/crew-details/dto/crew-detail.dto';

@Resolver(() => NoticeBoardDto)
export class NoticeBoardResolver {
    constructor(private readonly noticeBoardService: NoticeBoardService) { }

    @Query(() => NoticeBoardDto, { name: 'activeNoticeBoard', nullable: true })
    @UseGuards(GqlAuthGuard)
    getActiveNotice() {
        return this.noticeBoardService.getActiveNotice();
    }

    @Mutation(() => NoticeBoardDto)
    @UseGuards(GqlAuthGuard, GqlRolesGuard)
    @Roles(RoleType.SUPER_ADMIN)
    createNoticeBoard(
        @Args('createNoticeBoardInput') createNoticeBoardInput: CreateNoticeBoardInput,
        @CurrentUser() currentUser: CrewDetailDto,
    ) {
        return this.noticeBoardService.create(createNoticeBoardInput, currentUser);
    }
}

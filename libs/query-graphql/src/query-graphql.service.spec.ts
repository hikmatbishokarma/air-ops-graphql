import { Test, TestingModule } from '@nestjs/testing';
import { QueryGraphqlService } from './query-graphql.service';

describe('QueryGraphqlService', () => {
  let service: QueryGraphqlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QueryGraphqlService],
    }).compile();

    service = module.get<QueryGraphqlService>(QueryGraphqlService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

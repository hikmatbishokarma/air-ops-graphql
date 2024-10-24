import { Test, TestingModule } from '@nestjs/testing';
import { QueryMongooseService } from './query-mongoose.service';

describe('QueryMongooseService', () => {
  let service: QueryMongooseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QueryMongooseService],
    }).compile();

    service = module.get<QueryMongooseService>(QueryMongooseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { MongooseQueryService } from '@app/query-mongoose';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Country as CSCountry,
  City as CSCity,
  State,
} from 'country-state-city';

import { StateEntity } from '../entities/state.entity';

export class StateService extends MongooseQueryService<StateEntity> {
  constructor(
    @InjectModel(StateEntity.name)
    model: Model<StateEntity>,
  ) {
    super(model);
  }

  async syncStatesByCountry(countryCode: string) {
    const states = State.getStatesOfCountry(countryCode);

    if (!states || states.length === 0) {
      return { message: `No states found for country code ${countryCode}` };
    }

    const operations = states.map((c) => ({
      updateOne: {
        filter: { isoCode: c.isoCode }, // match existing country by ISO code
        update: {
          $setOnInsert: {
            name: c.name,
            isoCode: c.isoCode,
            countryCode: c.countryCode,
            latitude: c.latitude,
            longitude: c.longitude,
          },
        },

        upsert: true, // insert if not exist
      },
    }));
    // Execute bulkWrite
    const result = await this.Model.bulkWrite(operations);

    return {
      message: `Synced ${states.length} States for country ${countryCode}`,
      inserted: result.upsertedCount,
      modified: result.modifiedCount,
    };
  }
}

import { MongooseQueryService } from '@app/query-mongoose';
import { CityEntity } from '../entities/city.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Country as CSCountry,
  City as CSCity,
  State,
} from 'country-state-city';

export class CityService extends MongooseQueryService<CityEntity> {
  constructor(
    @InjectModel(CityEntity.name)
    model: Model<CityEntity>,
  ) {
    super(model);
  }

  async syncCitiesByCountry(countryCode: string) {
    const cities = CSCity.getCitiesOfCountry(countryCode);

    if (!cities || cities.length === 0) {
      return { message: `No cities found for country code ${countryCode}` };
    }

    // Prepare bulkWrite operations
    const operations = cities.map((ct) => {
      const stateName =
        State.getStateByCodeAndCountry(ct.stateCode, ct.countryCode)?.name ||
        '';

      return {
        updateOne: {
          filter: { name: ct.name, countryCode, stateCode: ct.stateCode }, // match existing
          update: {
            $set: {
              name: ct.name,
              countryCode: ct.countryCode,
              stateCode: ct.stateCode,
              state: stateName,
              latitude: ct.latitude,
              longitude: ct.longitude,
            },
          },
          upsert: true, // insert if not exist
        },
      };
    });

    // Execute bulkWrite
    const result = await this.Model.bulkWrite(operations);

    return {
      message: `Synced ${cities.length} cities for country ${countryCode}`,
      inserted: result.upsertedCount,
      modified: result.modifiedCount,
    };
  }

  /**
   * Sync cities of a specific state using upsert (insert if not exists)
   * @param countryCode ISO code of country (e.g., "IN")
   * @param stateCode ISO code of state (e.g., "DL")
   */
  async syncCitiesByStateCode(countryCode: string, stateCode: string) {
    // Fetch cities from country-state-city package
    const cities = CSCity.getCitiesOfState(countryCode, stateCode);

    if (!cities || cities.length === 0) {
      return { message: `No cities found for ${countryCode}-${stateCode}` };
    }

    // Get state name
    const stateName =
      State.getStateByCodeAndCountry(stateCode, countryCode)?.name || '';

    // Prepare bulkWrite operations
    const operations = cities.map((ct) => ({
      updateOne: {
        filter: { name: ct.name, countryCode, stateCode }, // match existing city
        update: {
          $set: {
            name: ct.name,
            countryCode: ct.countryCode,
            stateCode: ct.stateCode,
            state: stateName,
            latitude: ct.latitude,
            longitude: ct.longitude,
          },
        },
        upsert: true, // insert if not exist
      },
    }));

    // Execute bulkWrite for efficiency
    const result = await this.Model.bulkWrite(operations);

    return {
      message: `Synced ${cities.length} cities for ${stateName} (${countryCode}-${stateCode})`,
      inserted: result.upsertedCount,
      modified: result.modifiedCount,
    };
  }
}

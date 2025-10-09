import { MongooseQueryService } from '@app/query-mongoose';
import { CountryEntity } from '../entities/country.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Country as CSCountry } from 'country-state-city';

export class CountryService extends MongooseQueryService<CountryEntity> {
  constructor(
    @InjectModel(CountryEntity.name)
    model: Model<CountryEntity>,
  ) {
    super(model);
  }

  async syncCountries() {
    const countries = CSCountry.getAllCountries().map((c) => ({
      name: c.name,
      isoCode: c.isoCode,
      dialCode: `+${c.phonecode}`,
      emoji: c.flag,
      flagUrl: `https://flagcdn.com/w40/${c.isoCode.toLowerCase()}.png`,
      currency: c.currency,
      latitude: c.latitude,
      longitude: c.longitude,
      timezone: c.timezones?.[0]?.zoneName || null,
    }));

    const operations = countries.map((c) => ({
      updateOne: {
        filter: { isoCode: c.isoCode }, // match existing country by ISO code
        update: {
          $set: {
            name: c.name,
            dialCode: c.dialCode,
            emoji: c.emoji,
            flagUrl: c.flagUrl,
            currency: c.currency,
            latitude: c.latitude,
            longitude: c.longitude,
            timezone: c.timezone,
          },
        },
        upsert: true, // insert if not exist
      },
    }));

    const result = await this.Model.bulkWrite(operations);

    return {
      message: 'Countries synced successfully',
      total: countries.length,
      inserted: result.upsertedCount,
      modified: result.modifiedCount,
    };
  }
}

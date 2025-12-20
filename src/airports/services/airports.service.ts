import { MongooseQueryService } from '@app/query-mongoose';
import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AirportsEntity } from '../entities/airports.entity';

@Injectable()
export class AirportsService extends MongooseQueryService<AirportsEntity> {
  constructor(
    @InjectModel(AirportsEntity.name)
    readonly model: Model<AirportsEntity>,
  ) {
    super(model);
  }

  // Cache removed in favor of Database Query

  parseInputCoordinate(coord: string | number | undefined): number {
    if (typeof coord === 'number') return coord;
    if (!coord) throw new Error('Coordinate is required');

    const trimmed = coord.trim();

    // Format: N13-08.1 (Legacy)
    const regexLegacy = /^([NSEW])(\d+)-([\d.]+)$/i;
    const matchLegacy = trimmed.match(regexLegacy);
    if (matchLegacy) {
      const [, dir, deg, min] = matchLegacy;
      let decimal = parseInt(deg, 10) + parseFloat(min) / 60;
      if (dir.toUpperCase() === 'S' || dir.toUpperCase() === 'W') {
        decimal *= -1;
      }
      return decimal;
    }

    // Format: 28.6139° N or 28.6139 N (Suffix)
    const regexSuffix = /^([\d.]+)[°º]?\s*([NSEW])$/i;
    const matchSuffix = trimmed.match(regexSuffix);
    if (matchSuffix) {
      const [, val, dir] = matchSuffix;
      let decimal = parseFloat(val);
      if (dir.toUpperCase() === 'S' || dir.toUpperCase() === 'W') {
        decimal *= -1;
      }
      return decimal;
    }

    // Format: Simple Number
    const simple = parseFloat(trimmed);
    if (isNaN(simple)) {
      throw new Error(`Invalid coordinate format: ${coord}`);
    }
    return simple;
  }

  async findNearest(
    latInput: string | number,
    longInput: string | number,
  ): Promise<AirportsEntity | null> {
    const lat = this.parseInputCoordinate(latInput);
    const long = this.parseInputCoordinate(longInput);

    const nearest = await this.model
      .findOne({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [long, lat],
            },
            // $maxDistance: 1000 * 1000 // Variable range in meters if needed
          },
        },
      })
      .exec();

    return nearest;
  }

  // ONE-TIME MIGRATION HELPER
  async migrateAllCoordinates(): Promise<string> {
    // Only fetch airports where 'location' field is missing or null
    const pending = await this.model
      .find({
        $or: [{ location: { $exists: false } }, { location: null }],
      })
      .exec();

    let count = 0;
    for (const airport of pending) {
      // Saving triggers the pre('save') hook which parses string coords to location
      await airport.save();
      count++;
    }
    return `Migrated ${count} airports to GeoJSON format.`;
  }
}

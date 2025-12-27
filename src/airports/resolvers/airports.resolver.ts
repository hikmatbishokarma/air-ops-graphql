import { Resolver, Query, Args, Float } from '@nestjs/graphql';
import { AirportsService } from '../services/airports.service';
import { AirportsDto } from '../dto/airports.dto';

@Resolver(() => AirportsDto)
export class AirportsResolver {
    constructor(private readonly service: AirportsService) { }

    @Query(() => AirportsDto, { nullable: true, name: 'nearestAirport' })
    async findNearest(
        @Args('lat', { type: () => String }) lat: string,
        @Args('long', { type: () => String }) long: string,
    ): Promise<AirportsDto | null> {
        // Force type cast as Entity is compatible with DTO for response
        return (await this.service.findNearest(lat, long)) as any;
    }

    // Temporary Migration Mutation
    @Query(() => String, { name: 'migrateAirportCoordinates' })
    async migrateCoordinates(): Promise<string> {
        return await this.service.migrateAllCoordinates();
    }
    @Query(() => AirportsDto, { nullable: true, name: 'airportByIcao' })
    async findByIcao(
        @Args('icao', { type: () => String }) icao: string,
    ): Promise<AirportsDto | null> {
        return (await this.service.findByIcao(icao)) as any;
    }
}

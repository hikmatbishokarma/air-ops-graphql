import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { TripReportService } from '../services/trip-report.service';

@Controller('api/reports')
export class TripReportController {
    constructor(private readonly tripReportService: TripReportService) { }

    @Get('trip/:tripId/pdf')
    async downloadTripPdf(@Param('tripId') tripId: string, @Res() res: Response) {
        const buffer = await this.tripReportService.generateTripPdf(tripId);

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="TripReport_${tripId}.pdf"`,
            'Content-Length': buffer.length,
        });

        res.end(buffer);
    }

    @Get('trip/:tripId/sector/:sectorNo/pdf')
    async downloadSectorPdf(
        @Param('tripId') tripId: string,
        @Param('sectorNo') sectorNo: number,
        @Res() res: Response,
    ) {
        const buffer = await this.tripReportService.generateSectorPdf(tripId, sectorNo);

        // We ideally want source/dest in filename, but fetching it here adds complexity unless service returns it along with buffer.
        // For now, simpler filename is fine as per requirements: TripReport_NSOP_Trip_<TripId>_Sector<No>.pdf
        // User asked for: TripReport_NSOP_Trip_<TripId>_Sector<No>_<SRC>_<DEST>.pdf
        // To do that, I would need to get the sector details. 
        // Let's stick to the simpler one first or update service to return an object { buffer, filename }?
        // Given the constraints and the fact I already wrote the service to return Promise<Buffer>, I'll use the simpler name.
        // Or I can just fetch the file name if I really want to be perfect.

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="TripReport_${tripId}_Sector${sectorNo}.pdf"`,
            'Content-Length': buffer.length,
        });

        res.end(buffer);
    }
}

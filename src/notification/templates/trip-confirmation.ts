
import moment from 'moment';
import { calculateFlightTime } from 'src/common/helper';

/**
 * Generates the complete, styled HTML content for the Sales Confirmation document.
 * This HTML uses pure, self-contained CSS (no Tailwind CDN) for reliable rendering and printing.
 * @param {object} trip - The complete trip object with all nested details.
 * @returns {string} The fully styled HTML string content.
 */
export const TripConfirmationTemplate = (trip) => {
    const {
        aircraftDetail,
        client,
        quotationNo,
        revisedQuotationNo,
        createdAt,
        logoUrl,
        operator,
        sectors,
    } = trip;

    // The logic to attach passenger/meal info from passengerInfo to sectors is correct
    sectors.forEach((sector, index) => {
        const paxIfno = trip.passengerInfo?.sectors?.find(
            (pax) => pax.sectorNo == index + 1,
        );
        if (paxIfno) {
            sector.passengers = paxIfno.passengers || [];
            sector.meals = paxIfno.meals || [];
            sector.travel = paxIfno.travel || {};
            sector.sourceGroundHandler = paxIfno.sourceGroundHandler;
            sector.destinationGroundHandler = paxIfno.destinationGroundHandler;
        }
        sector["flightTime"] = calculateFlightTime(
            sector.depatureDate,
            sector.depatureTime,
            sector.arrivalDate,
            sector.arrivalTime,
        );

    });

    // Helper to format ID details
    const formatPassengerId = (pax) => {
        if (pax.passportId) {
            return `${pax.passportId} (Passport)`;
        }
        if (pax.aadharId) {
            return `${pax.aadharId} (Aadhar)`;
        }
        return 'N/A';
    };

    // Helper to format handler details, now using custom CSS classes
    const formatHandlerDetails = (handlers) => {
        if (!handlers || handlers.length === 0) {
            return '<span class="detail-value">Undefined</span>';
        }
        return handlers
            .map(
                (handler) => `
      <span class="detail-value handler-name">${handler.fullName || 'N/A'}</span>
      <span class="detail-value handler-contact"><a href="tel:${handler.contactNumber || ''}">${handler.contactNumber || 'N/A'}</a></span>
    `,
            )
            .join('');
    };

    // --- HTML TEMPLATE START ---

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sale Confirmation: ${revisedQuotationNo || quotationNo}</title>
    <!-- Using pure internal CSS instead of Tailwind CDN -->
    <style>
        /* Color Variables (Inspired by Indigo/Gray) */
        :root {
            --color-primary-dark: #4338ca; /* Indigo 700 */
            --color-primary-medium: #4f46e5; /* Indigo 600 */
            --color-primary-light: #eef2ff; /* Indigo 50 */
            --color-primary-border: #c7d2fe; /* Indigo 200 */
            --color-text-dark: #1f2937; /* Gray 800 */
            --color-text-medium: #475569; /* Gray 600 */
            --color-text-light: #64748b; /* Gray 500 */
            --color-border: #e2e8f0; /* Gray 200 */
            --color-bg-subtle: #f9fafb; /* Gray 50 */
            --color-bg-primary: #f5f5ff; /* Custom Indigo 50 for background */
            --color-red: #ef4444; /* Red 500 for potential warnings/errors */
        }

        body {
            font-family: 'Inter', sans-serif; /* Fallback to a standard sans-serif */
            color: var(--color-text-medium);
            line-height: 1.5;
            background-color: #f7f7f7; /* Light background for viewing */
            padding: 2rem;
        }

        /* Utility Classes */
        .flex { display: flex; }
        .justify-between { justify-content: space-between; }
        .items-start { align-items: flex-start; }
        .items-center { align-items: center; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .uppercase { text-transform: uppercase; }
        .tracking-wider { letter-spacing: 0.05em; }
        .w-full { width: 100%; }
        .w-1\/3 { width: 33.3333%; }
        .w-1\/2 { width: 50%; }

        /* Main Document Container */
        .document-container {
            max-width: 960px;
            margin: 0 auto;
            background-color: white;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            padding: 32px;
            border-radius: 12px;
        }
        
        /* Header Styling */
        header {
            padding-bottom: 16px;
            border-bottom: 1px solid var(--color-border);
            margin-bottom: 32px;
        }
        .header-left { 
            display: flex; 
            flex-direction: column; /* Stack logo and address vertically */
            align-items: flex-start;
        }
        .logo-container { 
            width: 80px; /* Slightly larger logo */
            height: auto; 
            margin-bottom: 8px; /* Space below logo */
        }
        .logo-container img { max-width: 100%; height: auto; }
        .header-text { font-size: 0.75rem; }
        .header-text strong { color: var(--color-text-dark); }
        
        .operator-info {
             font-size: 0.75rem;
             line-height: 1.3;
             color: var(--color-text-medium);
        }
        .client-info { margin-top: 8px; padding-top: 8px; border-top: 1px solid var(--color-border); }
        .client-info p { margin: 0; }
        .client-info span { color: var(--color-text-dark); font-weight: 500; }

        /* Section Styling */
     .section-box {
    padding: 16px;
    /* CHANGE: Remove solid fill */
    background-color: white; /* Or use 'transparent' if you want the main document color */
    border-radius: 8px;
    /* Keep border and shadow */
    border: 1px solid var(--color-primary-border);
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.06); /* Changed to a lighter outer shadow for a softer look */
}



        .trip-block {
            margin-bottom: 48px;
            padding: 24px;
            background-color: white;
            border: 1px solid var(--color-border);
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.06);
        }

   

        /* Flight Card */
        .flight-card-details {
            padding-bottom: 12px;
            margin-bottom: 12px;
            border-bottom: 1px dashed var(--color-primary-border);
        }
        .flight-card-details p { margin: 0; }
        .flight-card-info { font-size: 0.875rem; font-weight: 500; color: var(--color-primary-medium); }
        .flight-card-duration { font-size: 0.75rem; color: var(--color-text-medium); }
        .flight-card-duration span { color: var(--color-text-dark); font-weight: 600; }
        
        .flight-route-info { display: flex; justify-content: space-between; align-items: center; text-align: center; }
        .route-point { width: 33.3333%; }
        .route-point-code { font-size: 1.5rem; font-weight: 800; color: var(--color-text-dark); }
        .route-point-name { font-size: 0.75rem; color: var(--color-text-medium); }
        .route-point-time { font-size: 1rem; font-weight: 700; color: var(--color-primary-medium); margin-top: 4px; }
        
        .route-line { display: flex; flex-direction: column; align-items: center; width: 33.3333%; }
        .route-line-divider { width: 100%; height: 1px; background-color: var(--color-primary-medium); margin: 4px 0; }
        .icon {
            display: inline-block;
            width: 28px;
            height: 28px;
            fill: none;
            stroke: var(--color-primary-medium);
            stroke-width: 2;
            stroke-linecap: round;
            stroke-linejoin: round;
        }

        /* Ground Services & Handlers */
        .ground-layout { display: grid; grid-template-columns: 1fr; gap: 32px; margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--color-border); }
        @media (min-width: 768px) { /* md:grid-cols-2 */
            .ground-layout { grid-template-columns: 1fr 1fr; }
        }

        .handler-box {
            padding: 12px;
            background-color: var(--color-bg-subtle);
            border-radius: 8px;
            border: 1px solid var(--color-border);
            box-shadow: inset 0 1px 3px 0 rgba(0, 0, 0, 0.05);
        }

        .detail-group {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
        }

        .detail-item {
            display: flex;
            flex-direction: column;
            padding: 4px 0;
        }
        .detail-label {
            font-size: 0.6875rem;
            color: var(--color-text-light);
            font-weight: 500;
            margin-bottom: 2px;
            letter-spacing: 0.05em;
            text-transform: uppercase;
        }
        .detail-value {
            font-size: 0.8125rem;
            color: var(--color-text-dark);
            font-weight: 600;
        }
        .handler-contact { font-size: 0.75rem; color: var(--color-text-medium); font-weight: 400; }

        /* Tables */
        .table-title { font-size: 0.875rem; font-weight: 700; color: var(--color-text-medium); margin-bottom: 12px; }
        .table-wrapper { overflow-x: auto; border-radius: 8px; border: 1px solid var(--color-border); box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1); }
        .custom-table { width: 100%; background-color: white; border-collapse: collapse; }
        .custom-table th, .custom-table td {
            padding: 8px;
            text-align: left;
            font-size: 0.75rem;
            white-space: normal;
        }
        .custom-table th {
            font-weight: 600;
            color: var(--color-text-medium);
            border-bottom: 1px solid var(--color-border);
            background-color: var(--color-bg-subtle);
        }
        .custom-table tbody tr {
            border-bottom: 1px solid #f1f5f9;
        }
        .custom-table tbody tr:last-child {
            border-bottom: none;
        }
        .table-content-text { color: var(--color-text-dark); font-weight: 500; }

        /* Separator and Print Styles */
        .separator { height: 4px; background-color: #f3f4f6; margin: 40px 0; border-radius: 9999px; }
        
        @media print {
            body { background-color: white; padding: 0; }
            .document-container { box-shadow: none; padding: 0; border: none; }
            .trip-block { page-break-after: always; box-shadow: none; border: 1px solid #eee; }
            .section-box { background-color: var(--color-primary-light) !important; -webkit-print-color-adjust: exact; color-adjust: exact; }
            .handler-box { background-color: var(--color-bg-subtle) !important; -webkit-print-color-adjust: exact; color-adjust: exact; }
            .custom-table th { background-color: var(--color-bg-subtle) !important; -webkit-print-color-adjust: exact; color-adjust: exact; }
        }
    </style>
</head>
<body>

<div class="document-container">
    <!-- Header - Quote/Client/Date in a compact way -->
    <header class="flex justify-between items-start">
        <div class="header-left">
            <div class="logo-container">
                <img src="${logoUrl || 'https://placehold.co/150x50/374151/ffffff?text=Company+Logo'}" alt="Company Logo" onerror="this.onerror=null; this.src='https://placehold.co/150x50/374151/ffffff?text=Company+Logo';" />
            </div>
            <div class="operator-info">
                ${operator?.companyName || 'Airops'}<br/>
                ${operator?.address || 'Hyderabad, Telangana'}
            </div>
        </div>

        <div class="header-text text-right">
            <p>Quote: <span class="table-content-text">${revisedQuotationNo || quotationNo}</span></p>
            <p>Date: <span class="table-content-text">${moment(createdAt).format('DD-MM-YYYY')}</span></p>
            <div class="client-info">
                <p>Client: <span class="table-content-text">${client?.name || 'N/A'}</span></p>
                <p>Email: <span class="table-content-text">${client?.email || 'N/A'}</span></p>
            </div>
        </div>
    </header>

    <!-- Booking Details Summary section has been removed -->

    <!-- Map over all sectors -->
    ${sectors
            ?.map(
                (item, index) => `
        <section class="trip-block">


            <!-- FLIGHT SECTOR CARD -->
            <div class="section-box mb-6">

                <!-- Sector Title, Date & Aircraft -->
                <div class="flight-card-details">
                    <div class="flex justify-between items-center">
                        <p class="flight-card-info">${moment(item.depatureDate).format('dddd, DD MMMM, YYYY')}</p>
                        <p class="flight-card-duration">Flight Duration: <span class="table-content-text">${item.flightTime}</span></p>
                    </div>
                    <p class="flight-card-duration" style="margin-top: 4px;">Aircraft: <span class="table-content-text">${aircraftDetail?.name || 'N/A'} (${aircraftDetail?.code || 'N/A'})</span></p>
                </div>

                <!-- Source & Destination -->
                <div class="flight-route-info">
                    <!-- Source -->
                    <div class="route-point" style="text-align: left;">
                        <p class="route-point-code">${item?.source?.code || 'N/A'}</p>
                        <p class="route-point-name">${item?.source?.name || 'N/A'}</p>
                        <p class="route-point-time">${moment(item.depatureDate).format('ddd, DD MMM YYYY') || 'N/A'} - ${item.depatureTime || 'N/A'}</p>
                    </div>

                    <!-- Icon / Line -->
                    <div class="route-line">
                        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                          stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                          style="transform: rotate(90deg);">
                         <path d="M10.18 9"/>
                         <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l4-1 4 1v-1.5L13 19v-5.5l8 2.5z"/>
                        </svg>
                        <div class="route-line-divider"></div>
                    </div>

                    <!-- Destination -->
                    <div class="route-point" style="text-align: right;">
                        <p class="route-point-code">${item?.destination?.code || 'N/A'}</p>
                        <p class="route-point-name">${item?.destination?.name || 'N/A'}</p>
                        <p class="route-point-time">${moment(item.arrivalDate).format('ddd, DD MMM YYYY') || 'N/A'} - ${item.arrivalTime || 'N/A'}</p>
                    </div>
                </div>
            </div>

            <!-- Passengers & Meals: Separated and full width tables -->
            <div class="space-y-8" style="margin-top: 16px;">

                <!-- Section 1: Passengers (Full Width) -->
                <div style="margin-bottom: 32px;">
                    <h4 class="table-title uppercase tracking-wider">Passengers (${item.passengers?.length || 0} Total)</h4>
                    <div class="table-wrapper">
                        <table class="custom-table">
                            <thead>
                                <tr>
                                    <th style="width: 5%;">#</th>
                                    <th style="width: 30%;">NAME</th>
                                    <th style="width: 15%;">GENDER/AGE</th>
                                    <th style="width: 50%;">ID DETAILS (Aadhaar/Passport)</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${item.passengers?.length > 0
                        ? item.passengers
                            .map(
                                (pax, i) => `
                                    <tr>
                                        <td>${i + 1}.</td>
                                        <td class="table-content-text">${pax.name || 'N/A'}</td>
                                        <td>${pax.gender || 'N/A'} / ${pax.age || 'N/A'}</td>
                                        <td>${formatPassengerId(pax)}</td>
                                    </tr>
                                `,
                            )
                            .join('')
                        : `
                                <tr><td colspan="4" class="text-center" style="color: var(--color-text-light);">No passenger details provided.</td></tr>
                                `
                    }
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Section 2: Meals/Catering (Full Width, with Instructions column) -->
                <div style="margin-bottom: 32px;">
                    <h4 class="table-title uppercase tracking-wider">Flight Catering</h4>
                    <div class="table-wrapper">
                        <table class="custom-table">
                            <thead>
                                <tr>
                                    <th style="width: 20%;">MEAL / TYPE</th>
                                    <th style="width: 10%;">PORTIONS</th>
                                    <th style="width: 30%;">ITEM</th>
                                    <th style="width: 40%;">INSTRUCTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${item.meals?.length > 0
                        ? item.meals
                            .map(
                                (meal) => `
                                    <tr>
                                        <td class="table-content-text">${meal.category || 'N/A'} (${meal.type || 'N/A'})</td>
                                        <td>${meal.portions || 'N/A'}</td>
                                        <td>${meal.item || 'N/A'}</td>
                                        <td style="white-space: normal;">${meal.instructions || 'No special instructions.'}</td>
                                    </tr>
                                `,
                            )
                            .join('')
                        : `
                                <tr><td colspan="4" class="text-center" style="color: var(--color-text-light);">No catering details provided.</td></tr>
                                `
                    }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Ground Transport & Handlers -->
            <div class="ground-layout">
                <!-- Arrival Transport -->
                <div>
                    <h4 class="table-title uppercase tracking-wider">Arrival Transport (${item?.destination?.code || 'N/A'})</h4>
                    <div class="handler-box">
                        <div class="detail-group">
                            <div class="detail-item">
                                <span class="detail-label">VEHICLE TYPE</span>
                                <span class="detail-value">${item.travel?.type || 'NA'} (${item.travel?.vehicleChoice || 'NA'})</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">CATEGORY</span>
                                <span class="detail-value">${item.travel?.category || 'NA'}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">CAPACITY</span>
                                <span class="detail-value">${item.travel?.seatingCapacity || 'NA'} Seats</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">DROP LOCATION</span>
                                <span class="detail-value">${item.travel?.dropAt || 'NA'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Ground Handlers -->
                <div>
                    <h4 class="table-title uppercase tracking-wider">Ground Handlers</h4>
                    <div class="handler-box">
                        <div class="detail-group">
                            <div class="detail-item">
                                <span class="detail-label">DEPARTURE HANDLER (${item?.source?.code || 'N/A'})</span>
                                ${item.sourceGroundHandler ? formatHandlerDetails([item.sourceGroundHandler]) : (item?.source?.groundHandlersInfo ? formatHandlerDetails(item?.source?.groundHandlersInfo) : 'N/A')}
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">ARRIVAL HANDLER (${item?.destination?.code || 'N/A'})</span>
                                ${item.destinationGroundHandler ? formatHandlerDetails([item.destinationGroundHandler]) : (item?.destination?.groundHandlersInfo ? formatHandlerDetails(item?.destination?.groundHandlersInfo) : 'N/A')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </section>
        <!-- Separator between trips -->
        ${index < sectors.length - 1 ? '<div class="separator"></div>' : ''}

    `,
            )
            .join('')}
    
    <!-- Footer/Price Summary (Add your price details here) -->
    <!--

    -->
</div>
</body>
</html>
`;
};

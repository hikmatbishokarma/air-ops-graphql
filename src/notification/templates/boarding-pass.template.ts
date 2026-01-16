import moment from 'moment';

export const BoardingPassTemplate = (data) => {
  const { flight, passenger, boardingPassId, logoUrl, mapBackgroundUrl, groundHandlers, sectorNo } = data;

  return `
    <div class="boarding-pass">
        <div class="header">
            <span>BOARDING PASS</span>
            <span>SECTOR- ${sectorNo || '1'}</span>
        </div>
        <div class="content">
            <div class="left-section" style="${mapBackgroundUrl ? `background-image: url('${mapBackgroundUrl}');` : ''}">
                <!-- Passenger Info First -->
                <div class="passenger-grid">
                    <div class="item">
                        <div class="label">PASSENGER</div>
                        <div class="value highlight">${passenger.name}</div>
                    </div>
                    <div class="item">
                        <div class="label">GENDER</div>
                        <div class="value">${passenger.gender}</div>
                    </div>
                    <div class="item">
                        <div class="label">AGE</div>
                        <div class="value">${passenger.age}</div>
                    </div>
                    <div class="item">
                        <div class="label">GOVT ID</div>
                        <div class="value">${passenger.govtId || 'N/A'}</div>
                    </div>
                </div>

                <div class="divider"></div>

                <!-- Flight Info Section -->
                <div class="flight-info">
                    <div class="location">
                        <div class="label">FROM:</div>
                        <div class="code">${flight.fromCode}</div>
                        <div class="city">${flight.fromCity}</div>
                        <div class="date">${moment(flight.departureDate).format("MMM DD, YYYY")}</div>
                        <div class="time">${flight.departureTime}</div>
                    </div>

                    <div class="flight-icon">
                        <svg viewBox="0 0 24 24">
                            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                        </svg>
                        <div class="duration">${flight.flightTime}</div>
                        ${flight.aircraft?.code || flight.aircraft?.name ? `<div class="aircraft-code">${flight.aircraft.code || flight.aircraft.name}</div>` : ''}
                    </div>

                    <div class="location right-align">
                        <div class="label">TO:</div>
                        <div class="code">${flight.toCode}</div>
                        <div class="city">${flight.toCity}</div>
                        <div class="date">${moment(flight.arrivalDate).format("MMM DD, YYYY")}</div>
                        <div class="time">${flight.arrivalTime}</div>
                    </div>
                </div>

                <!-- Ground Handlers - Below Flight Info -->
                <div class="divider" style="margin-top: 12px; margin-bottom: 8px;"></div>
                
                <div class="ground-handlers-section">
                    <div class="gh-title">GROUND HANDLER / COORDINATOR INFO:</div>
                    <div class="gh-aligned">
                        <!-- Source Handler - Below FROM -->
                        <div class="gh-item-left">
                            ${groundHandlers?.source ? `
                                <div class="gh-name">${(groundHandlers.source.fullName || 'N/A').toUpperCase()}</div>
                                <div class="gh-phone">${groundHandlers.source.contactNumber || ''}</div>
                            ` : `
                                <div class="gh-name">N/A</div>
                            `}
                        </div>
                        
                        <!-- Destination Handler - Below TO -->
                        <div class="gh-item-right">
                            ${groundHandlers?.destination ? `
                                <div class="gh-name">${(groundHandlers.destination.fullName || 'N/A').toUpperCase()}</div>
                                <div class="gh-phone">${groundHandlers.destination.contactNumber || ''}</div>
                            ` : `
                                <div class="gh-name">N/A</div>
                            `}
                        </div>
                    </div>
                </div>
            </div>

            <div class="right-section">
                <div class="right-content">
                    <div class="spacer"></div>
                    
                    <div class="passenger-stub">
                        <div class="label">PASSENGER</div>
                        <div class="value highlight stub-name">${passenger.name}</div>
                    </div>

                    <div class="stub-grid">
                        <div class="item">
                            <div class="label">DATE</div>
                            <div class="value">${moment(flight.departureDate).format("MMM DD")}</div>
                        </div>
                        <div class="item">
                            <div class="label">DEPART</div>
                            <div class="value">${flight.departureTime}</div>
                        </div>
                    </div>

                    <div class="bp-id">
                        <div class="label">BP ID</div>
                        <div class="value monospace">${boardingPassId}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  `;
};

export const BoardingPassPdfWrapper = (passesHtml) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Boarding Passes</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    /* ===== PDF-SAFE RESET ===== */
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    /* ===== PAGE SETUP FOR A4 LANDSCAPE ===== */
    @page {
      size: A4 landscape;
      margin: 20mm 10mm;
    }

    /* ===== BODY & FONT LOADING ===== */
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background-color: #ffffff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      color-adjust: exact;
    }

    /* ===== CONTAINER ===== */
    .page-container {
      width: 100%;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      padding: 20px 0;
    }

    /* ===== BOARDING PASS CARD - FIXED DIMENSIONS ===== */
    .boarding-pass {
      width: 700px;
      height: auto;
      margin: 0 auto 30px;
      background: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid #e0e0e0;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      page-break-inside: avoid;
      page-break-after: always;
    }

    .boarding-pass:last-child {
      page-break-after: auto;
    }

    /* ===== HEADER ===== */
    .header {
      background-color: #5E6CFF;
      color: #ffffff;
      padding: 0 24px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: 700;
      font-size: 16px;
      letter-spacing: 2px;
    }

    /* ===== MAIN CONTENT GRID (70% / 30%) ===== */
    .content {
      display: grid;
      grid-template-columns: 70% 30%;
      min-height: 220px;
    }

    /* ===== LEFT SECTION ===== */
    .left-section {
      padding: 24px;
      border-right: 2px dashed #e0e0e0;
      background-size: 80%;
      background-position: center;
      background-repeat: no-repeat;
      position: relative;
    }

    .left-section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(255, 255, 255, 0.75);
      pointer-events: none;
    }

    .left-section > * {
      position: relative;
      z-index: 1;
    }

    /* ===== FLIGHT INFO GRID ===== */
    .flight-info {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      gap: 16px;
      margin-bottom: 24px;
      align-items: start;
    }

    .location .label {
      font-size: 12px;
      color: rgba(0, 0, 0, 0.6);
      font-weight: 600;
      text-transform: uppercase;
      margin-bottom: 4px;
    }

    .location .code {
      font-size: 48px;
      font-weight: 900;
      color: #5E6CFF;
      line-height: 1;
      margin-bottom: 0;
    }

    .location .city {
      font-size: 14px;
      color: #5E6CFF;
      font-weight: 500;
      margin-bottom: 8px;
    }

    .location .date {
      font-size: 16px;
      font-weight: 800;
      color: #333333;
      margin-bottom: 2px;
    }

    .location .time {
      font-size: 16px;
      font-weight: 800;
      color: #333333;
    }

    .right-align {
      text-align: right;
    }

    /* ===== FLIGHT ICON ===== */
    .flight-icon {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      padding-top: 8px;
    }

    .flight-icon svg {
      width: 56px;
      height: 56px;
      fill: #d1d5db;
      transform: rotate(90deg);
      margin-bottom: 4px;
    }

    .flight-icon .duration {
      font-size: 12px;
      color: rgba(0, 0, 0, 0.6);
      font-weight: 400;
      margin-top: 2px;
    }

    .flight-icon .aircraft-code {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.6);
      font-weight: 400;
      margin-top: 2px;
    }

    /* ===== DIVIDER ===== */
    .divider {
      height: 1px;
      background-color: #e0e0e0;
      margin-bottom: 16px;
      width: 100%;
    }

    /* ===== PASSENGER GRID ===== */
    .passenger-grid {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 2fr;
      gap: 16px;
      width: 100%;
    }

    .passenger-grid .item {
      display: flex;
      flex-direction: column;
    }

    .item .label {
      font-size: 12px;
      color: rgba(0, 0, 0, 0.6);
      margin-bottom: 2px;
    }

    .item .value {
      font-size: 14px;
      font-weight: 700;
      color: #333333;
      line-height: 1.57;
      word-wrap: break-word;
    }

    .item .highlight {
      color: #5E6CFF;
    }

    /* ===== RIGHT SECTION ===== */
    .right-section {
      padding: 24px;
      background-color: #FAFAFA;
      display: flex;
      flex-direction: column;
    }

    .right-content {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .spacer {
      height: 24px;
      flex-shrink: 0;
    }

    .passenger-stub {
      margin-bottom: 16px;
    }

    .passenger-stub .label {
      font-size: 12px;
      color: rgba(0, 0, 0, 0.6);
      margin-bottom: 2px;
    }

    .passenger-stub .stub-name {
      font-size: 20px;
      line-height: 1.2;
      font-weight: 700;
      color: #5E6CFF;
    }

    /* ===== STUB GRID ===== */
    .stub-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 16px;
    }

    .stub-grid .item .label {
      font-size: 12px;
      color: rgba(0, 0, 0, 0.6);
      margin-bottom: 2px;
    }

    .stub-grid .item .value {
      font-size: 14px;
      font-weight: 700;
      color: #333333;
    }

    /* ===== BP ID - BOTTOM ALIGNED ===== */
    .bp-id {
      margin-top: auto;
      margin-bottom: 16px;
    }

    .bp-id .label {
      font-size: 12px;
      color: rgba(0, 0, 0, 0.6);
      margin-bottom: 2px;
    }

    .bp-id .monospace {
      font-family: 'Courier New', Courier, monospace;
      font-size: 9px;
      color: #333333;
      word-break: break-all;
      line-height: 1.3;
    }

    /* ===== GROUND HANDLERS ===== */
    .ground-handlers {
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid #e0e0e0;
    }

    .gh-title {
      font-size: 11px;
      font-weight: 700;
      color: rgba(0, 0, 0, 0.8);
      margin-bottom: 12px;
      letter-spacing: 0.5px;
    }

    .gh-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .gh-item {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .gh-airport {
      font-size: 13px;
      font-weight: 700;
      color: #5E6CFF;
      margin-bottom: 4px;
    }

    .gh-detail {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .gh-label {
      font-size: 9px;
      color: rgba(0, 0, 0, 0.6);
      font-weight: 600;
    }

    .gh-value {
      font-size: 10px;
      color: #333333;
      font-weight: 500;
      word-break: break-word;
    }

    /* ===== GROUND HANDLERS SECTION (NEW LAYOUT) ===== */
    .ground-handlers-section {
      margin-top: 8px;
    }

    .ground-handlers-section .gh-title {
      font-size: 9px;
      font-weight: 700;
      color: #d32f2f;
      margin-bottom: 6px;
      letter-spacing: 0.5px;
    }

    .gh-aligned {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .gh-item-left {
      text-align: left;
    }

    .gh-item-right {
      text-align: right;
    }

    .gh-name {
      font-size: 10px;
      font-weight: 700;
      color: #5E6CFF;
      margin-bottom: 2px;
    }

    .gh-phone {
      font-size: 9px;
      color: #333333;
    }
  </style>
</head>
<body>
  <div class="page-container">
    ${passesHtml}
  </div>
</body>
</html>
`;

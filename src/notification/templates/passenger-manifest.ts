import moment from 'moment';

/**
 * Generates the Passenger Manifest HTML template
 * @param {object} data - The trip/flight data with crew and passenger details
 * @returns {string} The fully styled HTML string content
 */
export const PassengerManifestTemplate = (data) => {
    const {
        operator,
        aircraft,
        flightNo,
        dateOfFlight,
        departureTime,
        departureStation,
        destinationStation,
        crew = [],
        passengers = [],
        logoUrl,
    } = data;

    // Calculate total crew weight
    const totalCrewWeight = crew.reduce((sum, member) => {
        const weight = parseInt(member.weight) || 0;
        return sum + weight;
    }, 0);



    // Calculate total passenger weight
    const totalPassengerWeight = passengers.reduce((sum, pax) => {
        const paxWeight = parseInt(pax.weight?.pax) || 0;
        const bagWeight = parseInt(pax.weight?.bag) || 0;
        return sum + paxWeight + bagWeight;
    }, 0);

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Passenger Manifest - ${flightNo || 'N/A'}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: Arial, sans-serif;
            padding: 40px;
            background-color: #ffffff;
        }

        .container {
            max-width: 900px;
            margin: 0 auto;
        }

        /* Header */
        .header {
            text-align: center;
            margin-bottom: 30px;
        }

        .logo {
            max-width: 200px;
            margin-bottom: 10px;
        }

        .company-name {
            font-size: 24px;
            font-weight: bold;
            color: #333;
            margin-bottom: 5px;
        }

        .title {
            font-size: 18px;
            font-weight: bold;
            text-decoration: underline;
            margin-top: 20px;
            margin-bottom: 30px;
        }

        /* Flight Info Table */
        .flight-info {
            width: 100%;
            border: 2px solid #000;
            border-collapse: collapse;
            margin-bottom: 30px;
        }

        .flight-info th,
        .flight-info td {
            border: 1px solid #000;
            padding: 8px;
            text-align: center;
            font-size: 12px;
        }

        .flight-info th {
            background-color: #f0f0f0;
            font-weight: bold;
            text-transform: uppercase;
        }

        .flight-info td {
            font-weight: normal;
        }

        .label-row {
            background-color: #f0f0f0;
            font-weight: bold;
            text-transform: uppercase;
        }

        /* Crew Table */
        .crew-table {
            width: 100%;
            border: 2px solid #000;
            border-collapse: collapse;
            margin-bottom: 30px;
        }

        .crew-table th,
        .crew-table td {
            border: 1px solid #000;
            padding: 8px;
            text-align: center;
            font-size: 11px;
        }

        .crew-table th {
            background-color: #f0f0f0;
            font-weight: bold;
            text-transform: uppercase;
        }

        .crew-table .total-row {
            font-weight: bold;
        }

        /* Passenger Table */
        .passenger-table {
            width: 100%;
            border: 2px solid #000;
            border-collapse: collapse;
            margin-bottom: 40px;
        }

        .passenger-table th,
        .passenger-table td {
            border: 1px solid #000;
            padding: 8px;
            text-align: center;
            font-size: 11px;
        }

        .passenger-table th {
            background-color: #f0f0f0;
            font-weight: bold;
            text-transform: uppercase;
        }

        /* Footer Signatures */
        .signatures {
            display: flex;
            justify-content: space-between;
            margin-top: 60px;
        }

        .signature-block {
            text-align: left;
        }

        .signature-line {
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 5px;
        }

        /* Print Styles */
        @media print {
            body {
                padding: 20px;
            }
            
            .container {
                max-width: 100%;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            ${logoUrl ? `<img src="${logoUrl}" alt="Company Logo" class="logo" onerror="this.style.display='none'">` : ''}
            
            <div class="title">PASSENGER MANIFEST</div>
        </div>

        <!-- Flight Information Table -->
        <table class="flight-info">
            <tr>
                <th>OWNER / OPERATOR</th>
                <th>MARK OF NATIONALITY<br/>REGISTRATION/TYPE</th>
                <th>FLIGHT NO</th>
                <th>DATE OF FLIGHT</th>
            </tr>
            <tr>
                <td>${operator?.companyName || 'HYDERABAD AIRLINES'}</td>
                <td>${aircraft?.registration || 'VT-BHH'} / ${aircraft?.type || 'EC 135 P3H'}</td>
                <td>${flightNo || 'VT-BHH'}</td>
                <td>${moment(dateOfFlight).format('DD-MM-YYYY') || '08-10-2025'}</td>
            </tr>
            <tr class="label-row">
                <td>DEPARTURE TIME</td>
                <td>DEPARTURE STATION</td>
                <td colspan="2">DESTINATION STATION</td>
            </tr>
            <tr>
                <td>${departureTime || '1300'}</td>
                <td>${departureStation || 'TADEPALLI'}</td>
                <td colspan="2">${destinationStation || 'BHIMAVARAM'}</td>
            </tr>
        </table>

        <!-- Crew Table -->
        <table class="crew-table">
            <thead>
                <tr>
                    <th>SL.<br/>NO</th>
                    <th>NAME OF CREW</th>
                    <th>DESIGNATION</th>
                    <th>CREW WEIGHT</th>
                    <th>CREW<br/>BAGGAGE</th>
                    <th>NATIONALITY</th>
                </tr>
            </thead>
            <tbody>
                ${crew.length > 0 ? crew.map((member, index) => `
                <tr>
                    <td>${String(index + 1).padStart(2, '0')}</td>
                    <td>${member.name || 'N/A'}</td>
                    <td>${member.designation || 'PILOT'}</td>
                    <td>${member.weight || '-'}</td>
                    <td>${member.baggage || '-'}</td>
                    <td>${member.nationality || 'INDIAN'}</td>
                </tr>
                `).join('') : `
                <tr>
                    <td>01</td>
                    <td>Capt. Milind M Kulkarni</td>
                    <td>PILOT</td>
                    <td>78 + 3 (Bag)</td>
                    <td>-</td>
                    <td>INDIAN</td>
                </tr>
                <tr>
                    <td>02</td>
                    <td>Capt. Deepak Kulkarni</td>
                    <td>PILOT</td>
                    <td>91</td>
                    <td>-</td>
                    <td>INDIAN</td>
                </tr>
                <tr>
                    <td>03</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>04</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                `}
                <tr class="total-row">
                    <td colspan="3">TOTAL</td>
                    <td>${totalCrewWeight || '172'}</td>
                    <td></td>
                    <td></td>
                </tr>
            </tbody>
        </table>

        <!-- Passenger Table -->
        <table class="passenger-table">
            <thead>
                <tr>
                    <th rowspan="2">SL<br/>NO</th>
                    <th rowspan="2">NAME OF PASSENGER</th>
                    <th rowspan="2">GENDER</th>
                    <th colspan="2">WEIGHT</th>
                    <th rowspan="2">CHECKED<br/>BAGGAGE<br/>NO. OF PCS.</th>
                    <th rowspan="2">NATIONALITY</th>
                </tr>
                <tr>
                    <th>PAX</th>
                    <th>BAG</th>
                </tr>
            </thead>
            <tbody>
                ${passengers.length > 0 ? passengers.map((pax, index) => `
                <tr>
                    <td>${index + 1}</td>
                    <td>${pax.name || 'N/A'}</td>
                    <td>${pax.gender || 'M'}</td>
                    <td>${pax.weight?.pax || '-'}</td>
                    <td>${pax.weight?.bag || '-'}</td>
                    <td>${pax.checkedBaggage || 'NIL'}</td>
                    <td>${pax.nationality || 'INDIAN'}</td>
                </tr>
                `).join('') : `
              
               
               
              
               
                `}
            </tbody>
        </table>

        <!-- Signatures -->
        <div class="signatures">
            <div class="signature-block">
                <div class="signature-line">Duty Officer</div>
                <div class="signature-line">Officer Signature & Stamp</div>
            </div>
            <div class="signature-block">
                <div class="signature-line">Signature of PIC/ Co-Pilot / OPS</div>
            </div>
        </div>
    </div>
</body>
</html>
`;
};

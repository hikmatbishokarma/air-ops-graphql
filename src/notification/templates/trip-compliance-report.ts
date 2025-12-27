import moment from 'moment';

export const TripComplianceReportTemplate = (data: {
    trip: any;
    latestDate: string;
    logoUrl?: string;
    cloudfrontBaseUrl: string;
}) => {
    const { trip, latestDate, logoUrl, cloudfrontBaseUrl } = data;

    const generateSectorHtml = (sector: any): string => {
        return `
        <div class="section">
            <div class="section-title">SECTOR ${sector.sectorNo}: ${sector.source?.code} ➝ ${sector.destination?.code}</div>
            
            <!-- Sector Header -->
            <div class="grid" style="background-color: #fafafa; padding: 10px; border: 1px solid #eee;">
                <div class="grid-item">
                    <div class="label">Departure</div>
                    <div class="value">${moment(sector.depatureDate).format('DD MMM YYYY')} ${sector.depatureTime}</div>
                </div>
                <div class="grid-item">
                    <div class="label">Arrival</div>
                    <div class="value">${moment(sector.arrivalDate).format('DD MMM YYYY')} ${sector.arrivalTime}</div>
                </div>
            </div>

            <!-- Passenger Manifest -->
            <h4 class="mb-2">1. Passenger Manifest</h4>
            ${sector.passengers?.length > 0 ? `
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Gender</th>
                            <th>Age</th>
                            <th>ID Proof</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${sector.passengers.map((p: any) => `
                        <tr>
                            <td>${p.name}</td>
                            <td>${p.gender}</td>
                            <td>${p.age}</td>
                            <td>${p.aadharId || 'N/A'}</td>
                        </tr>
                        `).join('')}
                    </tbody>
                </table>
            ` : '<div class="value mb-2">No passengers listed.</div>'}

            <!-- Crew Assignment -->
             <h4 class="mb-2">2. Crew Assignment</h4>
             ${sector.assignedCrews?.length > 0 ? `
                <table>
                    <thead>
                        <tr>
                            <th width="30%">Designation</th>
                            <th>Crew Members</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${sector.assignedCrews.map((g: any) => `
                        <tr>
                            <td>${g.designation}</td>
                            <td>${g.hydratedCrews?.map((c: any) => c.fullName || c.name || 'N/A').join(', ')}</td>
                        </tr>
                        `).join('')}
                    </tbody>
                </table>
             ` : '<div class="value mb-2">No crew assigned.</div>'}

             <!-- BA Evidence -->
             <h4 class="mb-2">3. BA Evidence</h4>
             ${sector.baInfo ? `
                 ${sector.baInfo.baMachine ? `<div class="value mb-2"><strong>BA Machine:</strong> ${sector.baInfo.baMachine}</div>` : ''}
                 ${sector.baInfo.baPersons?.length > 0 ? `
                    <div class="value mb-2" style="font-size: 10px;">
                        <strong>Authorized Personnel:</strong><br/>
                        ${sector.baInfo.baPersons.map((p: any) => `• ${p.name} (${p.gender}, ${p.age}y) — Cert: ${p.certNo || "N/A"}`).join('<br/>')}
                    </div>
                 ` : ''}
                 <strong>BA Reports:</strong><br/>
                 ${sector.baInfo.baReports?.length > 0 ? `
                 <table>
                    <thead>
                        <tr>
                            <th>Crew Name</th>
                            <th>Reading</th>
                            <th>Time</th>
                            <th>Report</th>
                            <th>Video</th>
                        </tr>
                    </thead>
                    <tbody>
                         ${sector.baInfo.baReports.map((ba: any) => `
                        <tr>
                            <td>${ba.name}</td>
                            <td>${ba.reading || '0.00'}</td>
                            <td>${moment(ba.conductedDate).format('HH:mm')}</td>
                            <td>${ba.record ? `<a href="${cloudfrontBaseUrl}${ba.record}" target="_blank" class="doc-link">View PDF</a>` : '-'}</td>
                            <td>${ba.video ? `<a href="${cloudfrontBaseUrl}${ba.video}" target="_blank" class="doc-link">View Video</a>` : '-'}</td>
                        </tr>
                        `).join('')}
                    </tbody>
                 </table>` : '<div class="value mb-2">No BA reports found.</div>'}
             ` : '<div class="value mb-2">No BA Evidence found.</div>'}

             <!-- Fuel Information -->
             <h4 class="mb-2">4. Fuel Information</h4>
             ${sector.fuelRecord ? `
                <div class="grid" style="border: 1px solid #ddd; padding: 5px;">
                     <div class="grid-item">
                        <div class="label">Station</div>
                        <div class="value">${sector.fuelRecord.fuelStation || '-'}</div>
                    </div>
                     <div class="grid-item">
                        <div class="label">On Arr</div>
                        <div class="value">${sector.fuelRecord.fuelOnArrival || '-'}</div>
                    </div>
                     <div class="grid-item">
                        <div class="label">Loaded</div>
                        <div class="value">${sector.fuelRecord.fuelLoaded || '-'}</div>
                    </div>
                     <div class="grid-item">
                        <div class="label">Fuel Receipt</div>
                        <div class="value">
                            ${sector.fuelRecord.fuelReceipt ? `<a href="${cloudfrontBaseUrl}${sector.fuelRecord.fuelReceipt}" target="_blank" class="doc-link">View Receipt</a>` : '-'}
                        </div>
                    </div>
                </div>
             ` : '<div class="value mb-2">No fuel record found.</div>'}

             <!-- Operational Documents -->
              <h4 class="mb-2">5. Operational Documents</h4>
              ${sector.documents?.length > 0 ? `
                <table>
                    <thead>
                        <tr>
                            <th>Document Type</th>
                            <th>Link</th>
                        </tr>
                    </thead>
                    <tbody>
                         ${sector.documents.map((doc: any) => `
                        <tr>
                            <td>${doc.type || 'Document'}</td>
                            <td>
                                ${doc.fileUrl
                ? `<a href="${cloudfrontBaseUrl}${doc.fileUrl}" target="_blank" class="doc-link">View Document</a>`
                : '-'}
                            </td>
                        </tr>
                        `).join('')}
                    </tbody>
                </table>
              ` : '<div class="value mb-2">No operational documents uploaded.</div>'}

              <div style="border-bottom: 2px dashed #ccc; margin: 20px 0;"></div>
        </div>
        `;
    };

    return `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Helvetica', 'Arial', sans-serif; font-size: 12px; color: #333; }
                    h1, h2, h3, h4 { margin: 0; padding: 0; }
                    .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #333; padding-bottom: 10px; }
                    .logo { max-height: 50px; margin-bottom: 10px; }
                    .section { margin-bottom: 20px; page-break-inside: avoid; }
                    .section-title { background-color: #f0f0f0; padding: 5px 10px; font-weight: bold; border-left: 5px solid #0056b3; margin-bottom: 10px; font-size: 14px; }
                    .grid { display: flex; flex-wrap: wrap; margin-bottom: 10px; }
                    .grid-item { width: 33%; margin-bottom: 5px; }
                    .label { font-size: 10px; color: #666; font-weight: bold; text-transform: uppercase; }
                    .value { font-size: 12px; font-weight: 500; }
                    
                    table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
                    th, td { border: 1px solid #ddd; padding: 6px; text-align: left; }
                    th { background-color: #f9f9f9; font-weight: bold; font-size: 11px; }
                    td { font-size: 11px; }

                    .doc-link { color: #0056b3; text-decoration: none; font-size: 11px; }
                    .footer { text-align: center; font-size: 10px; color: #999; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 10px; }
                    
                    .page-break { page-break-after: always; }
                    
                    /* Utility */
                    .text-right { text-align: right; }
                    .text-center { text-align: center; }
                    .mb-2 { margin-bottom: 10px; }
                </style>
            </head>
            <body>
                <div class="header">
                    ${logoUrl ? `<img src="${logoUrl}" class="logo" />` : ''}
                    <h2>TRIP COMPLIANCE REPORT</h2>
                   
                </div>

                <div class="section">
                    <div class="section-title">TRIP OVERVIEW</div>
                    <div class="grid">
                        <div class="grid-item">
                            <div class="label">Trip ID</div>
                            <div class="value">${trip.tripId}</div>
                        </div>
                        <div class="grid-item">
                            <div class="label">Quotation No</div>
                            <div class="value">${trip.quotationNo}</div>
                        </div>
                        <div class="grid-item">
                            <div class="label">Operation Type</div>
                            <div class="value">${trip.quotationData?.category || 'N/A'}</div>
                        </div>
                         <div class="grid-item">
                            <div class="label">Aircraft</div>
                            <div class="value">${trip.aircraft?.name || ''} (${trip.aircraft?.code || 'N/A'})</div>
                        </div>
                        <div class="grid-item">
                            <div class="label">Total Sectors</div>
                            <div class="value">${trip.sectors.length}</div>
                        </div>
                         <div class="grid-item">
                            <div class="label">Date</div>
                            <div class="value">${moment(trip.createdAt).format('DD MMM YYYY')}</div>
                        </div>
                    </div>
                </div>

                ${trip.sectors.map((sector: any) => generateSectorHtml(sector)).join('')}

                <div class="section">
                     <div class="section-title">COMPLIANCE SUMMARY</div>
                     <div class="value">✔ Report generated automatically by system</div>
                     <div class="value">✔ Generated on: ${latestDate}</div>
                </div>

                <div class="footer">
                    System Generated Report | AirOps Platform | ${latestDate}
                </div>
            </body>
            </html>
    `;
};

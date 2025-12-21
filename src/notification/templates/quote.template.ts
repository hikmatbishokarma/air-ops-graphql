import moment from 'moment';


export const QuotePdfTemplate = (quote) => {
  const {
    itinerary,
    prices,
    grandTotal,
    aircraftDetail,
    client,
    quotationNo,
    revisedQuotationNo,
    createdAt,
    totalPrice,
    gstAmount,
    logoUrl,
    operator,
    crew,
    sectors,
    apiUrl,
    cloudFrontUrl,
  } = quote;

  const priceRows = prices
    .map(
      (item) => `
        <tr>
          <td>${item.label}</td>
          <td>${item.total}</td>
        </tr>
      `,
    )
    .join('');

  // Helper to safely access aircraftDetail properties
  const flightImage = aircraftDetail?.flightImage || '';
  const interiorImages = aircraftDetail?.flightInteriorImages || [];
  const specifications = aircraftDetail?.specifications || [];

  // Logic for the interior image gallery (4 per row)
  const interiorImageGallery = interiorImages.length
    ? `<div class="image-gallery-4">
        ${interiorImages
      .map((img) => `<img src="${cloudFrontUrl}${img}" alt="Interior"/>`)
      .join('')}
      </div>`
    : '';

  // Logic for Specifications page (Page 3)
  const specificationsPage = specifications.length
    ? `
    <div class="page-break"></div>
    <h3>Specifications</h3>
    <table>
      ${specifications
      .map(
        (item) => `
            <tr>
              <td><strong>${item.title}</strong></td>
              <td>${item.value}</td>
            </tr>
          `,
      )
      .join('')}
    </table>
    `
    : '';

  // Logic for Terms & Conditions and Warnings page (Page 4)
  const termsAndWarningsPage = `
    <div class="page-break"></div>
    <div class="terms">
      ${aircraftDetail?.termsAndConditions || ''}
    </div>

    <div class="warning-box">
      <h4>⚠️ Important Notes</h4>
      <p>${aircraftDetail?.warningText || ''}</p>
      ${aircraftDetail?.warningImage
      ? `<img src="${cloudFrontUrl}${aircraftDetail.warningImage}" alt="Warning"/>`
      : ''
    }
    </div>
  `;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Flight Quote</title>
  <style>
    body {
      font-family: 'Roboto', 'Helvetica Neue', Arial, sans-serif;
      font-size: 13px;
      color: #333;
      margin:  0;
    }
       @page {
        margin: 50px;
    }
    .container {
      width: 100%;
      max-width: 800px;
      
    }
    h3 {
      margin: 10px 0;
      font-size: 16px;
      color: #222;
    }
    p {
      margin: 6px 0;
      line-height: 1.5em;
    }
    .header {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      margin-bottom: 20px;
    }
    .header-left img {
      max-width: 140px;
      height: auto;
      margin-bottom: 8px;
    }
    .header-left div,
    .header-right {
      font-size: 13px;
    }
    .client-box {
      background: #f9f9f9;
      padding: 10px;
      margin-top: 8px;
      border: 1px solid #eee;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 16px 0;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }
    th {
      background: #f5f5f5;
      font-weight: 600;
    }
    tr:nth-child(even) {
      background: #fafafa;
    }
    .pricing-table td:last-child {
      text-align: right;
    }
    .total-row td {
      font-weight: bold;
      background: #eaf4ff;
    }
    .note-box {
      background: #fcfcfc;
      border-left: 3px solid #04AA6D;
      padding: 10px;
      margin-top: 20px;
      font-style: italic;
    }
    .page-break {
      page-break-before: always;
    }
    .image-full {
      width: 100%;
      margin-bottom: 12px;
    }
    /* Updated styling for 4-per-row gallery */
    .image-gallery-4 {
      display: flex;
      flex-wrap: wrap;
      gap: 8px; /* Spacing between images */
      margin-bottom: 16px;
    }
    .image-gallery-4 img {
      width: calc(25% - 6px); /* 4 images per row, adjusting for 3 x 8px gaps */
      max-width: calc(25% - 6px);
      box-sizing: border-box;
      border: 1px solid #eee;
      padding: 4px;
      background: #fff;
    }
    .terms {
      margin-top: 20px;
      font-size: 12px;
      line-height: 1.5em;
    }
    .warning-box {
      margin-top: 20px;
      padding: 12px;
      background: #fff6e6;
      border: 1px solid #f5d5a0;
      font-size: 13px;
    }
    .warning-box h4 {
      margin: 0 0 8px 0;
      color: #d9534f;
    }
    .warning-box img {
      margin-top: 10px;
      max-width: 100%;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="header-left">
        <img src="${logoUrl}" alt="Company Logo" />
        <div>
          <strong>From:</strong><br/>
          ${operator?.companyName || ''} Airops<br/>
          ${operator?.address || ''} Hyderabad, Telangana
        </div>
      </div>
      <div class="header-right">
        <div>
          <strong>Quote Number:</strong> ${revisedQuotationNo || quotationNo}<br/>
          <strong>Date:</strong> ${moment(createdAt).format('DD-MM-YYYY')}
        </div>
        ${client
      ? `<div class="client-box">
              <strong>Client:</strong> ${client.name}<br/>
              Contact: ${client.phone}<br/>
              Email: ${client.email}<br/>
              ${client.address ? `Address: ${client.address}<br/>` : ''}
              ${client.gstNo ? `GST: ${client.gstNo}<br/>` : ''}
              ${client.panNo ? `PAN: ${client.panNo}` : ''}
            </div>`
      : ''
    }
      </div>
    </div>

    <p>Dear Sir/Madam,</p>
    <p>We are pleased to offer you <strong>${aircraftDetail?.name}</strong>. The commercials for the same are as follows:</p>

    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>From</th>
          <th>To</th>
          <th>Block Time</th>
          <th>Remarks</th>
        </tr>
      </thead>
      <tbody>
        ${sectors
      .map(
        (item) => `
              <tr>
                <td>${moment(item.depatureDate).format('DD-MM-YYYY')}</td>
                <td>${item?.source?.city || item?.source?.name}</td>
                <td>${item?.destination?.city || item?.destination?.name}</td>
                <td>${item?.apxFlyTime}</td>
                <td>${item.paxNumber} pax</td>
              </tr>
            `,
      )
      .join('')}
      </tbody>
    </table>

    ${priceRows.length > 0
      ? `
        <table class="pricing-table">
          <thead>
            <tr>
              <th>Estimated Charter Cost</th>
              <th>INR (₹)</th>
            </tr>
          </thead>
          <tbody>
            ${priceRows}
            <tr>
              <td>Subtotal</td>
              <td>${grandTotal}</td>
            </tr>
            <tr>
              <td>GST (18%)</td>
              <td>${gstAmount}</td>
            </tr>
            <tr class="total-row">
              <td>Total</td>
              <td>${totalPrice}</td>
            </tr>
          </tbody>
        </table>`
      : ''
    }

    ${crew.activeBankdetail
      ? `
       <h3>Bank Details</h3>
<table>
  <tbody>
    <tr><td><strong>Account Payee</strong></td><td>${crew?.activeBankdetail?.accountPayee || ''}</td></tr>
    <tr><td><strong>Bank Name</strong></td><td>${crew?.activeBankdetail?.bankName || ''}</td></tr>
    <tr><td><strong>Account Number</strong></td><td>${crew?.activeBankdetail?.accountNumber || ''}</td></tr>
    <tr><td><strong>Branch</strong></td><td>${crew?.activeBankdetail?.branch || ''}</td></tr>
    <tr><td><strong>SWIFT Code</strong></td><td>${crew?.activeBankdetail?.swiftCode || ''}</td></tr>
    <tr><td><strong>IFSC Code</strong></td><td>${crew?.activeBankdetail?.ifscCode || ''}</td></tr>
  </tbody>
</table>`
      : ''
    }
    

    <div class="note-box">${aircraftDetail?.noteText || ''}</div>

    
    <div class="page-break"></div>
    
    ${flightImage
      ? `<img src="${cloudFrontUrl}${flightImage}" class="image-full" alt="Aircraft"/>`
      : ''
    }

    ${interiorImageGallery}

    ${aircraftDetail?.seatLayoutImage
      ? `<img src="${cloudFrontUrl}${aircraftDetail.seatLayoutImage}" class="image-full" alt="Seat Layout" style="border:1px solid #eee;"/>`
      : ''
    }


    ${specificationsPage}

    ${termsAndWarningsPage}

  </div>
</body>
</html>
  `;
};

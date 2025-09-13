import moment from 'moment';

export const QuotePdfTemplatev1 = (quote) => {
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

  return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Flight Quote</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .container { width: 100%; max-width: 800px; margin: auto; border: 1px solid #ddd; padding: 20px; }
        .header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.header > div,
.header > img {
  width: 48%;
}

.header-left,
.header-right {
  display: flex;
  flex-direction: column;
  font-size: 14px;
}
        .details { font-size: 14px; }
        .greeting { margin-bottom: 20px; font-size: 14px; }
        .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        .table, .table th, .table td { border: 1px solid #ddd; }
        .table th, .table td { padding: 10px; text-align: center; }
        .table th { background-color: #f2f2f2; }
        .total-table { margin-top: 20px; width: 100%; border-collapse: collapse; }
        .total-table th, .total-table td { padding: 10px; border: 1px solid #ddd; }
        .total-table th { background-color: #f2f2f2; text-align: right; }
        .total-table th:first-child { text-align: left;}
        .total-table th:last-child {text-align: right;}
        .total-table td:last-child { text-align: right; }
        .total-table tr:last-child td { font-weight: bold; }
        .terms { margin-top: 20px; font-size: 12px; }
        .terms-bay img{
        width:100%;
        }

        .column-img {
  float: left;
  width: 49.33%;
  padding: 5px;
}


.row-side-images::after {
  content: "";
  clear: both;
  display: table;
}
  .row-side-images{
  margin-top:20px;
  }
  .range-text{
  margin-bottom: 2px;
    margin-top: 0px;
  }
    #customers {

  border-collapse: collapse;
  width: 100%;
}

#customers td, #customers th {
  border: 1px solid #ddd;
  padding: 8px;
}

#customers tr:nth-child(even){background-color: #f2f2f2;}

#customers tr:hover {background-color: #ddd;}

#customers th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #04AA6D;
  color: white;
}
  .total-details-format li{
  list-style:none;
  font-weight:600;
  }
  .policy-quotation-ol ol li{
  font-size:14px;
  
  }
  .substances-t1{
  margin-top:20px;
  }
  .substances-t1 img{
  width:100%;
  }
  .note-para-view{
  margin-top:20px;
  margin-bottom:20px;
  }
   #invoiceLogo { /* Use an ID for specific styling without a class */
      
      left: 20px; /* Adjust this value for desired left margin */
      top: 10px; /* Adjust this value for desired top margin */
      max-width: 150px; /* Adjust this value to control logo size, e.g., 100px, 180px */
      height: auto; 
    }

    .terms {
    margin-top: 20px;
    font-size: 12px;
    page-break-before: always; /* Forces a new page before the terms section */
}
.guest-detsils-v1 {
    page-break-before: always; /* Forces a new page before this section as well */
}
    </style>
</head>
<body>

    <div class="container">
        <!-- Header Section -->
        <div class="header">
  <div class="header-left">
    <img src="${logoUrl}" alt="Company Logo" id="invoiceLogo" />
    <div>
      <strong>From:</strong><br/>
      ${operator?.companyName || ''} Airops<br/>
      ${operator?.address || ''} Hyderabad, Telangana
    </div>
  </div>

  <div class="header-right">
    <div class="details">
      <strong>Quote Number:</strong> ${revisedQuotationNo || quotationNo}<br>
      <strong>Date:</strong> ${moment(createdAt).format('DD-MM-YYYY')}
    </div>
${
  client
    ? `<div class="details">
      <strong>Client Details:</strong><br>
      Name: ${client.name}<br>
      Contact: ${client.phone}<br>
      Email: ${client.email}<br>
      Address: ${client.address}<br>
      ${client.gstNo ? `GST: ${client.gstNo}<br>` : ''}
      ${client.panNo ? `PAN: ${client.panNo}` : ''}
    </div>`
    : ''
}
  </div>
</div>

         <!-- Greeting Message -->
        <div class="greeting">
            <p>Dear Sir/Madam,</p>
            <p>We are pleased to offer to you ${aircraftDetail?.name}. The commercials for the same will be as follows:</p>
        </div>

        <!-- Itinerary Table -->
        <table class="table">
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
            ${itinerary.map(
              (item) => ` <tr>
                    <td>${moment(item.depatureDate).format('DD-MM-YYYY')}</td>
                    <td>${item?.source?.city}</td>
                    <td>${item?.destination?.city}</td>
                    <td>${item?.apxFlyTime}</td>
                    <td>${item.paxNumber} pax</td>
                </tr>`,
            )}
               
                
            </tbody>
        </table>

        <!-- Pricing Table -->
        ${
          priceRows.length > 0
            ? `
  <table class="total-table">
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
      <tr>
        <td><strong>Total</strong></td>
        <td><strong>${totalPrice}</strong></td>
      </tr>
    </tbody>
  </table>
`
            : ''
        }


<!---note--para--->
<div class="note-para-view">
<p>${aircraftDetail?.noteText}</p>
</div>

        <!----banner-one---start--->
               <div class="terms-bay">
               ${aircraftDetail.flightImages.map(
                 (item) => `<img src="https://airops.in/${item}">`,
               )}
              
               </div>








<!----banner-four---start--->

<div class="row-side-images">
  <div class="column-img">
 
    <img src="https://airops.in/${aircraftDetail?.seatLayoutImage}" alt="Snow" style="width:100%">
  </div>
  <div class="column-img">
  <h3 class="range-text">Specifications</h3>
 <table id="customers">
   ${aircraftDetail?.specifications
     ?.map(
       (item) => `
          <tr>
            <td>${item.title}</td>
            <td>${item.value}</td>
          </tr>
        `,
     )
     .join('')}
</table>

</div>
</div>

  <!-- Terms and Conditions -->
        <div class="terms">
             ${aircraftDetail?.termsAndConditions}
        </div>
        <!-- Footer Section --> 
        

               <!----six--card--start-->

                   <div class="guest-detsils-v1">
                   <p>${aircraftDetail?.warningText ?? ''}</p>
                
                     <div class="terms-bay">
               <img src="https://airops.in/${aircraftDetail?.warningImage}">
               </div>

               </div>
  

      


<!---container--close--->
    </div>


</body>
</html>

    `;
};

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
      margin: 20px;
    }
    .container {
      width: 100%;
      max-width: 800px;
      margin: auto;
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
    .image-gallery {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .image-gallery img {
      flex: 1 1 calc(25% - 8px);
      max-width: calc(25% - 8px);
      border: 1px solid #eee;
      padding: 4px;
      background: #fff;
    }
    .split-row {
      display: flex;
      justify-content: space-between;
      gap: 20px;
      margin-top: 16px;
    }
    .split-row .half {
      flex: 1;
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
    <!-- PAGE 1: Quote & Pricing -->
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
        ${
          client
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
        ${itinerary
          .map(
            (item) => `
              <tr>
                <td>${moment(item.depatureDate).format('DD-MM-YYYY')}</td>
                <td>${item?.source?.city}</td>
                <td>${item?.destination?.city}</td>
                <td>${item?.apxFlyTime}</td>
                <td>${item.paxNumber} pax</td>
              </tr>
            `,
          )
          .join('')}
      </tbody>
    </table>

    ${
      priceRows.length > 0
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

    ${
      crew.activeBankdetail
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

    <!-- PAGE 2: Images & Specs -->
    <div class="page-break"></div>
    <img src="https://airops.in/${aircraftDetail?.flightImages?.[0]}" class="image-full" alt="Aircraft"/>

    ${
      aircraftDetail?.interiorImages?.length
        ? `<div class="image-gallery">
          ${aircraftDetail.interiorImages
            .map(
              (img) => `<img src="https://airops.in/${img}" alt="Interior"/>`,
            )
            .join('')}
        </div>`
        : ''
    }

    <div class="split-row">
      <div class="half">
        <img src="https://airops.in/${aircraftDetail?.seatLayoutImage}" alt="Seat Layout" style="width:100%; border:1px solid #eee;"/>
      </div>
      <div class="half">
        <h3>Specifications</h3>
        <table>
          ${aircraftDetail?.specifications
            ?.map(
              (item) => `
                <tr>
                  <td><strong>${item.title}</strong></td>
                  <td>${item.value}</td>
                </tr>
              `,
            )
            .join('')}
        </table>
      </div>
    </div>

    <!-- PAGE 3: Terms & Warnings -->
    <div class="page-break"></div>
    <div class="terms">
      ${aircraftDetail?.termsAndConditions || ''}
    </div>

    <div class="warning-box">
      <h4>⚠️ Important Notes</h4>
      <p>${aircraftDetail?.warningText || ''}</p>
      ${
        aircraftDetail?.warningImage
          ? `<img src="https://airops.in/${aircraftDetail.warningImage}" alt="Warning"/>`
          : ''
      }
    </div>
  </div>
</body>
</html>
  `;
};

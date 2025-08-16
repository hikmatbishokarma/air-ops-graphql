import moment from 'moment';
import { InvoiceType } from 'src/app-constants/enums';

export const InvoiceTemplate = (quote) => {
  const {
    itinerary,
    prices,
    grandTotal,
    aircraftDetail,
    client,
    quotationNo,
    invoiceNo,
    createdAt,
    totalPrice,
    gstAmount,
    type: invoiceType,
    operator,
    logoUrl,
  } = quote;

  return `

    <!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${invoiceType}</title>
  <style>
    body { font-family: Arial, sans-serif; font-size: 12px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { border: 1px solid #000; padding: 6px; text-align: left; }
    .header, .footer { text-align: center; margin: 10px 0; }
    .total { font-weight: bold; }
    #invoiceLogo { /* Use an ID for specific styling without a class */
      position: absolute; 
      left: 20px; /* Adjust this value for desired left margin */
      top: 10px; /* Adjust this value for desired top margin */
      max-width: 150px; /* Adjust this value to control logo size, e.g., 100px, 180px */
      height: auto; 
    }
  </style>
</head>
<body>
  <div class="header">
  <img src="${logoUrl}"  alt="Company Logo" id="invoiceLogo"/>
    <h2>${invoiceType}</h2>
    <p>(ORIGINAL FOR RECIPIENT)</p>
  </div>
  
  <table>
    <tr>
      <td><strong>From:</strong><br/>${operator?.companyName || ''}Airops<br/>${operator?.address || ''}Hyderabad, Telangana</td>
      <td><strong>Invoice No:</strong> ${invoiceNo}<br/><strong>Dated:</strong> ${moment().format('DD-MMM-YY')}</td>
    </tr>
    <tr>
      <td>
    <strong>To:</strong><br/>
    Name:${client.name}<br/>
    Address:${client.address}<br/>
    ${client.gstNo ? `GST:${client.gstNo}<br/>` : ''}
    ${client.panNo ? `PAN:${client.panNo}` : ''}
  </td>
      <td><strong>Reference No:</strong>${quotationNo}</td>
    </tr>
  </table>

  <br/>

  <table>
    <thead>
      <tr>
        <th>Sl No.</th>
        <th>Particulars</th>
        <th>HSN/SAC</th>
        <th>Amount</th>
      </tr>
    </thead>
    <tbody>
    ${prices
      .map(
        (item, index) => ` <tr> 
      <td>${index + 1}</td> 
      <td>${item.label}</td>
        <td>996426</td>
      
        <td>${item.total}</td> 
        </tr>`,
      )
      .join('')}
    </tbody>
  </table>

  <br/>

  <table>
    <tr>
      <td class="total">Taxable Value</td>
      <td>${grandTotal}</td>
    </tr>
    <tr>
      <td class="total">IGST @18%</td>
      <td>${gstAmount}</td>
    </tr>
    <tr>
      <td class="total">Total Amount</td>
      <td>${totalPrice}</td>
    </tr>
  </table>

  <div class="footer">
    <p>This is a computer-generated invoice</p>
  </div>
</body>
</html>

    `;
};

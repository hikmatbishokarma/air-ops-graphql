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
  </style>
</head>
<body>
  <div class="header">
    <h2>${invoiceType}</h2>
    <p>(ORIGINAL FOR RECIPIENT)</p>
  </div>
  
  <table>
    <tr>
      <td><strong>From:</strong><br/>RENARD JET AVIATION PRIVATE LIMITED<br/>New Delhi</td>
      <td><strong>Invoice No:</strong> ${invoiceNo}<br/><strong>Dated:</strong> ${moment().format('DD-MMM-YY')}</td>
    </tr>
    <tr>
      <td><strong>To:</strong><br/>${client.name}<br/>${client.address}</td>
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
      <td>${totalPrice}</td>
    </tr>
    <tr>
      <td class="total">IGST @18%</td>
      <td>${gstAmount}</td>
    </tr>
    <tr>
      <td class="total">Total Amount</td>
      <td>${grandTotal}</td>
    </tr>
  </table>

  <div class="footer">
    <p>This is a computer-generated invoice</p>
  </div>
</body>
</html>

    `;
};

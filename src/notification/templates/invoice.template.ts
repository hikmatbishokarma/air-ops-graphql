import moment from 'moment';
import { InvoiceType } from 'src/app-constants/enums';
import { numberToWordsINR } from 'src/common/helper';

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
    cloudFrontUrl,
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
      <td><strong>From:</strong><br/>${operator?.companyName || 'Airops'}<br/>${operator?.address || 'Hyderabad, Telangana'} <br/>
      </td>
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

export const TaxInvoiceTemplateV2 = (quote) => {
  const {
    prices,
    grandTotal,
    client,
    quotationNo,
    invoiceNo,
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
    body { font-family: Arial, sans-serif; font-size: 12px; margin: 0; padding: 20px; color: #333; }
    .invoice-container { max-width: 800px; margin: auto; border: 1px solid #000; padding: 20px; position: relative; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    th, td { border: 1px solid #000; padding: 8px; text-align: left; vertical-align: top; }
    .header-table td { border: 1px solid #000; width: 50%; }
    .no-border { border: none !important; }
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .bold { font-weight: bold; }
    .logo { max-width: 150px; margin-bottom: 10px; }
    .section-title { background: #f2f2f2; font-weight: bold; text-align: center; border: 1px solid #000; padding: 5px; margin-top: -1px; }
    .amount-words { font-style: italic; margin-top: 10px; }
    .footer { margin-top: 30px; border-top: 1px solid #000; padding-top: 10px; }
    .bank-details { width: 60%; margin-top: 20px; }
    .bank-details td { border: none; padding: 2px; }
    .signature-area { width: 100%; margin-top: 40px; }
    .signature-box { border-top: 1px solid #000; width: 200px; padding-top: 5px; text-align: center; float: right; }
    .clear { clear: both; }
  </style>
</head>
<body>
  <div class="invoice-container">
    <div class="text-center"><h2 style="margin: 0;">${invoiceType}</h2></div>
    
    <table class="header-table" style="margin-top: 10px;">
      <tr>
        <td>
          <img src="${logoUrl}" class="logo" alt="Logo"/><br/>
          <span class="bold">${operator?.companyName || 'Airops'}</span><br/>
          ${operator?.address || ''}<br/>
          <span class="bold">GSTIN/UIN:</span> ${operator?.gstNo || 'N/A'}<br/>
          <span class="bold">State Name:</span> ${operator?.state || 'N/A'}, <span class="bold">Code:</span> ${operator?.stateCode || 'N/A'}<br/>
          <span class="bold">E-Mail:</span> ${operator?.email || 'N/A'}
        </td>
        <td>
          <table style="width: 100%; border: none; margin: 0;">
            <tr class="no-border"><td class="no-border"><span class="bold">Invoice No.</span><br/>${invoiceNo}</td><td class="no-border"><span class="bold">Dated</span><br/>${moment().format('DD-MMM-YY')}</td></tr>
            <tr class="no-border" style="border-top: 1px solid #000 !important;"><td class="no-border" colspan="2"><span class="bold">Reference No. & Date</span><br/>${quotationNo}</td></tr>
            <tr class="no-border" style="border-top: 1px solid #000 !important;"><td class="no-border" colspan="2"><span class="bold">Buyer's Order No.</span><br/>${quotationNo}</td></tr>
          </table>
        </td>
      </tr>
      <tr>
        <td>
          <span class="bold">Consignee (Ship to)</span><br/>
          <span class="bold">${client?.name || 'N/A'}</span><br/>
          ${client?.address || 'N/A'}<br/>
          <span class="bold">GSTIN/UIN:</span> ${client?.gstNo || 'N/A'}<br/>
          <span class="bold">State Name:</span> ${client?.state || 'N/A'}
        </td>
        <td>
          <span class="bold">Buyer (Bill to)</span><br/>
          <span class="bold">${client?.name || 'N/A'}</span><br/>
          ${client?.address || 'N/A'}<br/>
          <span class="bold">GSTIN/UIN:</span> ${client?.gstNo || 'N/A'}<br/>
          <span class="bold">State Name:</span> ${client?.state || 'N/A'}
        </td>
      </tr>
    </table>

    <table>
      <thead>
        <tr>
          <th>Sl No.</th>
          <th>Particulars</th>
          <th>HSN/SAC</th>
          <th>GST Rate</th>
          <th>Quantity</th>
          <th>Rate</th>
          <th>per</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        ${prices.map((item, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>
              <span class="bold">${item.label}</span><br/>
              <span style="font-size: 10px;">${item.description || ''}</span>
            </td>
            <td>996426</td>
            <td>18%</td>
            <td>1</td>
            <td class="text-right">${Number(item.total).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
            <td>Unit</td>
            <td class="text-right">${Number(item.total).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
          </tr>
        `).join('')}
        <tr>
          <td colspan="7" class="text-right bold">Total</td>
          <td class="text-right bold">${Number(grandTotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
        </tr>
      </tbody>
    </table>

    <table style="margin-top: -21px;">
       <tr>
          <td class="bold">Amount Chargeable (in words)</td>
       </tr>
       <tr>
          <td>${numberToWordsINR(Number(totalPrice))}</td>
       </tr>
    </table>

    <table style="font-size: 10px;">
      <thead>
        <tr>
          <th rowspan="2">HSN/SAC</th>
          <th rowspan="2">Taxable Value</th>
          <th colspan="2" class="text-center">CGST</th>
          <th colspan="2" class="text-center">SGST/UTGST</th>
          <th rowspan="2">Total Tax Amount</th>
        </tr>
        <tr>
          <th class="text-center">Rate</th>
          <th class="text-center">Amount</th>
          <th class="text-center">Rate</th>
          <th class="text-center">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>996426</td>
          <td class="text-right">${Number(grandTotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
          <td class="text-center">9%</td>
          <td class="text-right">${(Number(gstAmount) / 2).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
          <td class="text-center">9%</td>
          <td class="text-right">${(Number(gstAmount) / 2).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
          <td class="text-right">${Number(gstAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
        </tr>
        <tr class="bold">
          <td class="text-right">Total</td>
          <td class="text-right">${Number(grandTotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
          <td></td>
          <td class="text-right">${(Number(gstAmount) / 2).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
          <td></td>
          <td class="text-right">${(Number(gstAmount) / 2).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
          <td class="text-right">${Number(gstAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
        </tr>
      </tbody>
    </table>

    <div style="font-size: 11px;">
      <span class="bold">Tax Amount (in words):</span> ${numberToWordsINR(Number(gstAmount))}<br/><br/>
      <div style="display: flex; justify-content: space-between;">
        <div style="width: 50%;">
          <span class="bold">Remarks:</span><br/>
          Being Flying charges for ${quotationNo}
        </div>
        <div style="width: 45%;">
          <span class="bold">Company's Bank Details</span><br/>
          Bank Name: ${operator?.bankName || 'N/A'}<br/>
          A/c No.: ${operator?.accountNo || 'N/A'}<br/>
          Branch & IFS Code: ${operator?.ifscCode || 'N/A'}<br/>
          Account Holder Name: ${operator?.accountHolderName || operator?.companyName || 'N/A'}
        </div>
      </div>
      <br/>
      <div class="bold" style="border-top: 1px solid #000; padding-top: 10px;">Declaration</div>
      We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.
      
      <div class="signature-area">
        <div style="float: right; text-align: center;">
          <span class="bold">for ${operator?.companyName || 'Airops'}</span>
          <br/><br/><br/><br/>
          Authorised Signatory
        </div>
      </div>
      <div class="clear"></div>
      <br/>
      <div class="text-center" style="margin-top: 20px;">
        SUBJECT TO HYDERABAD JURISDICTION<br/>
        This is a Computer Generated Invoice
      </div>
    </div>

  </div>
</body>
</html>
 `;
};

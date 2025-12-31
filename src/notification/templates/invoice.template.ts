import moment from 'moment';
import { InvoiceType } from 'src/app-constants/enums';
import { numberToWordsINR } from 'src/common/helper';

export const InvoiceTemplateOld = (quote) => {
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

export const InvoiceTemplate = (quote) => {
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
    createdAt,
  } = quote;

  const date = moment(createdAt).format('DD-MMM-YY')

  return `
    <!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${invoiceType}</title>
  <style>
    body { font-family: Arial, sans-serif; font-size: 9px; margin: 0; padding: 20px; color: #000; line-height: 1.2; }
    .invoice-container { max-width: 850px; margin: auto; border: 1px solid #000; padding: 0; position: relative; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 0; table-layout: fixed; }
    th, td { border: 1px solid #000; padding: 2px 4px; text-align: left; vertical-align: top; word-wrap: break-word; }
    .no-border { border: none !important; }
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .bold { font-weight: bold; }
    .logo { max-width: 150px; margin-bottom: 5px; display: block; }
    .section-header { text-align: center; font-weight: bold; border-bottom: 1px solid #000; padding: 2px 0; }
    .signature-area { display: flex; justify-content: space-between; align-items: flex-end; padding: 10px; border-top: 1px solid #000; min-height: 100px; }
    .header-info-table td { border-top: none; border-left: none; border-right: none; }
    .header-info-table tr:last-child td { border-bottom: none; }
    th { background: none; font-weight: normal; text-align: center; }
  </style>
</head>
<body>
  <div style="max-width: 850px; margin: auto;">
    <img src="${logoUrl}" class="logo" alt="Company Logo"/>
    
    <div class="invoice-container">
      <div class="section-header">${invoiceType}</div>
      
      <table style="border: none;">
        <tr>
          <td style="width: 50%; border-left: none; border-top: none;">
            <span class="bold" style="text-transform: uppercase;">${operator?.companyName || 'Airops'}</span><br/>
            ${operator?.address || ''}<br/>
            GSTIN/UIN: ${operator?.gstNo || 'N/A'}<br/>
            State Name: ${operator?.state || 'N/A'}, Code: ${operator?.stateCode || 'N/A'}<br/>
            E-Mail: ${operator?.email || 'N/A'}
          </td>
          <td style="width: 50%; padding: 0; border-top: none; border-right: none;">
            <table class="header-info-table" style="height: 100%;">
              <tr>
                <td style="width: 50%; border-right: 1px solid #000;">Invoice No.<br/><span class="bold">${invoiceNo}</span></td>
                <td>Dated<br/><span class="bold">${date}</span></td>
              </tr>
              <tr>
                <td style="width: 50%; border-right: 1px solid #000;">Delivery Note</td>
                <td>Mode/Terms of Payment</td>
              </tr>
              <tr>
                <td style="width: 50%; border-right: 1px solid #000;">Reference No. & Date.<br/><span class="bold">${quotationNo}</span><br/>dt.${date}</td>
                <td>Other References</td>
              </tr>
              <tr>
                <td style="width: 50%; border-right: 1px solid #000; border-bottom: none;">Buyer's Order No.</td>
                <td style="border-bottom: none;">Dated</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="width: 50%; border-left: none;">
            Consignee (Ship to)<br/>
            <span class="bold">${client?.name || 'N/A'}</span><br/>
            ${client?.address || 'N/A'}<br/>
            GSTIN/UIN: ${client?.gstNo || 'N/A'}<br/>
            State Name: ${client?.state || 'N/A'}, Code: ${client?.stateCode || 'N/A'}
          </td>
          <td style="width: 50%; padding: 0; border-right: none;">
             <table class="header-info-table" style="height: 100%;">
              <tr>
                <td style="width: 50%; border-right: 1px solid #000;">Dispatch Doc No.</td>
                <td>Delivery Note Date</td>
              </tr>
              <tr>
                <td style="width: 50%; border-right: 1px solid #000;">Dispatched through<br/><span>Non Schedule- Air Transport</span></td>
                <td>Destination</td>
              </tr>
              <tr>
                <td style="width: 50%; border-right: 1px solid #000;">Mul or Lading A ran No:<br/><span>dt.${date}</span></td>
                <td>Destination</td>
              </tr>
              <tr>
                <td colspan="2" style="border-bottom: none;">Terms of Delivery</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="width: 50%; border-left: none; border-bottom: none;">
            Buyer (Bill to)<br/>
            <span class="bold">${client?.name || 'N/A'}</span><br/>
            ${client?.address || 'N/A'}<br/>
            GSTIN/UIN: ${client?.gstNo || 'N/A'}<br/>
            State Name: ${client?.state || 'N/A'}, Code: ${client?.stateCode || 'N/A'}
          </td>
          <td style="width: 50%; border-right: none; border-bottom: none;"></td>
        </tr>
      </table>

    <table style="border-left: none; border-right: none;">
      <thead>
        <tr>
          <th style="width: 5%; border-left: none;">Sl No.</th>
          <th style="width: 50%;">Particulars</th>
          <th style="width: 10%;">HSN/SAC</th>
          <th style="width: 10%;">GST Rate</th>
          <th style="width: 5%;">Quantity</th>
          <th style="width: 10%;">Rate</th>
          <th style="width: 5%;">per</th>
          <th style="width: 10%; border-right: none;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${prices.map((item, index) => `
          <tr>
            <td class="text-center" style="border-left: none;">${index + 1}</td>
            <td>
              <span class="bold">${item.label}</span><br/>
              <span>${item.description || ''}</span>
            </td>
            <td class="text-center">996426</td>
            <td class="text-center">18%</td>
            <td class="text-center">1</td>
            <td class="text-right">${Number(item.total).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
            <td class="text-center">Unit</td>
            <td class="text-right" style="border-right: none;">${Number(item.total).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
          </tr>
        `).join('')}
        <tr style="height: 100px;"><td style="border-left: none;"></td><td></td><td></td><td></td><td></td><td></td><td></td><td style="border-right: none;"></td></tr>
        <tr>
          <td colspan="7" class="text-right">Total</td>
          <td class="text-right bold" style="border-right: none;">${Number(grandTotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
        </tr>
      </tbody>
    </table>

    <div style="padding: 10px; border-bottom: 1px solid #000;">
      Amount Chargeable (in words)<br/>
      <span class="bold">INR ${numberToWordsINR(Number(grandTotal))}</span>
    </div>

    <table style="border: none; border-bottom: 1px solid #000;">
      <thead>
        <tr>
          <th rowspan="2" style="border-left: none; border-top: none;">HSN/SAC</th>
          <th rowspan="2" style="border-top: none;">Taxable Value</th>
          <th colspan="2" style="border-top: none;">Central Tax</th>
          <th colspan="2" style="border-top: none;">State Tax</th>
          <th rowspan="2" style="border-right: none; border-top: none;">Total Tax Amount</th>
        </tr>
        <tr>
          <th>Rate</th>
          <th>Amount</th>
          <th>Rate</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="text-center" style="border-left: none;">996426</td>
          <td class="text-right">${Number(grandTotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
          <td class="text-center">9%</td>
          <td class="text-right">${(Number(gstAmount) / 2).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
          <td class="text-center">9%</td>
          <td class="text-right">${(Number(gstAmount) / 2).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
          <td class="text-right" style="border-right: none;">${Number(gstAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
        </tr>
        <tr>
          <td class="text-right bold" style="border-left: none;">Total</td>
          <td class="text-right bold">${Number(grandTotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
          <td></td>
          <td class="text-right bold">${(Number(gstAmount) / 2).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
          <td></td>
          <td class="text-right bold">${(Number(gstAmount) / 2).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
          <td class="text-right bold" style="border-right: none;">${Number(gstAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
        </tr>
      </tbody>
    </table>

    <div style="padding: 10px; font-size: 10px;">
      Tax Amount (in words): <span class="bold">INR ${numberToWordsINR(Number(gstAmount))}</span>
    </div>

    <div style="display: flex; border-top: 1px solid #000;">
      <div style="width: 50%; padding: 10px; border-right: 1px solid #000;">
        <span>Remarks:</span><br/>
        Being Flying charges for ${quotationNo}<br/><br/>
        <span>Declaration:</span><br/>
        We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.
      </div>
      <div style="width: 50%; padding: 10px;">
        <span>Company's Bank Details:</span><br/>
        Bank Name: ${operator?.bankName || 'N/A'}<br/>
        A/c No.: <span class="bold">${operator?.accountNo || 'N/A'}</span><br/>
        Branch & IFS Code: <span class="bold">${operator?.ifscCode || 'N/A'}</span><br/>
        Account Holder Name: <span class="bold">${operator?.accountHolderName || operator?.companyName || 'N/A'}</span>
      </div>
    </div>

    <div class="signature-area">
      <div style="width: 50%;">Customer's Seal and Signature</div>
      <div style="width: 50%; text-align: right;">
        for <span class="bold">${operator?.companyName || 'Airops'}</span><br/><br/><br/>
        Authorised Signatory
      </div>
    </div>
  </div>
  
  <div class="text-center" style="margin-top: 10px;">
    SUBJECT TO HYDERABAD JURISDICTION<br/>
    This is a Computer Generated Invoice
  </div>
</div>
</body>
</html>
 `
};



export const InvoiceTemplate=(quote)=>{


    const {
        itinerary,
        price,
        grandTotal,
        aircraftDetail,
        client,
        quotationNo,
        revisedQuotationNo,
        createdAt,
        totalPrice,
        gstAmount,
      } = quote;

    return `

    <!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Proforma Invoice</title>
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
    <h2>Proforma Invoice</h2>
    <p>(ORIGINAL FOR RECIPIENT)</p>
  </div>
  
  <table>
    <tr>
      <td><strong>From:</strong><br/>RENARD JET AVIATION PRIVATE LIMITED<br/>New Delhi</td>
      <td><strong>Invoice No:</strong> 24-25/RJAI/PI/0011<br/><strong>Dated:</strong> 27-Feb-25</td>
    </tr>
    <tr>
      <td><strong>To:</strong><br/>Telugu Desam Party<br/>Hyderabad, Telangana</td>
      <td><strong>Reference No:</strong> 24-25/RJAI/PI/0011</td>
    </tr>
  </table>

  <br/>

  <table>
    <thead>
      <tr>
        <th>Sl No.</th>
        <th>Particulars</th>
        <th>HSN/SAC</th>
        <th>GST Rate</th>
        <th>Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td>Charter Flight Booking - VOHY to VOHY</td>
        <td>996426</td>
        <td>18%</td>
        <td>19,50,000.00</td>
      </tr>
      <tr>
        <td>2</td>
        <td>Airport, Refueling & Admin Charges</td>
        <td>996426</td>
        <td>18%</td>
        <td>1,00,000.00</td>
      </tr>
    </tbody>
  </table>

  <br/>

  <table>
    <tr>
      <td class="total">Taxable Value</td>
      <td>20,50,000.00</td>
    </tr>
    <tr>
      <td class="total">IGST @18%</td>
      <td>3,69,000.00</td>
    </tr>
    <tr>
      <td class="total">Total Amount</td>
      <td>₹24,19,000.00</td>
    </tr>
  </table>

  <div class="footer">
    <p>This is a computer-generated invoice</p>
  </div>
</body>
</html>

    `
}
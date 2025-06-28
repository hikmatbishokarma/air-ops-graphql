import moment from 'moment';

export const SaleConfirmationTemplate = (quote) => {
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
  <style>
    body { font-family: Arial, sans-serif; font-size: 14px; color: #000; }
    .container { max-width: 700px; margin: auto; border: 1px solid #ccc; padding: 20px; }
    .section-title { background-color: #b5913e; color: #fff; padding: 8px 12px; font-weight: bold; }
    .box { border: 1px solid #ccc; margin-top: 10px; }
    .row { display: flex; flex-wrap: wrap; }
    .cell { width: 50%; padding: 8px; box-sizing: border-box; }
    .label { font-weight: bold; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th, td { padding: 6px 8px; border: 1px solid #ccc; }
    .flex-row { display: flex; justify-content: space-between; }
  </style>
</head>
<body>
  <div class="container">

    <!-- Booking Details -->
    <div class="section-title">✈️ Booking Details</div>
    <table>
      <tr>
        <td><strong>Date:</strong> ${moment(createdAt).format('DD MMMM, YYYY')}</td>
        <td><strong>Filter Manager:</strong> Rahul Kishore - <a href="tel:+91-9311449483">+91-9311449483</a></td>
      </tr>
      <tr>
        <td><strong>Name:</strong> Raj</td>
        <td><strong>Filter Manager:</strong> Rahul Kishore - <a href="tel:+91-9311449483">+91-9311449483</a></td>
      </tr>
    </table>

    <!-- Trip Details -->

      <div class="section-title">✈️ Flight Details</div>
      ${itinerary.map(
        (item, index) => `
        
      Trip ${index + 1}
      <table>
        <tr>
          <td><strong>Date:</strong> 
           ${moment(item.depatureDate).format('dddd')}<br />
           ${moment(item.depatureDate).format('DD MMMM, YYYY')}</td>
          <td><strong>Aircraft:</strong> ${aircraftDetail?.name}</td>
        </tr>
        <tr>
          <td><strong>Departure Airport:</strong><br>${item?.source?.name}<br>${item.depatureTime}</td>
          <td><strong>Arrival Airport:</strong><br>${item?.destination?.name}<br>${item.arrivalTime}</td>
        </tr>
      </table>

      <div class="row">
        <div class="cell"><strong>Departure Transport:</strong><br>NA</div>
        <div class="cell"><strong>Arrival Transport:</strong><br>NA</div>
      </div>

      <div class="row">
        <div class="cell"><strong>Ground Handler (Departure):</strong><br>Mr Pavan<br><a href="tel:+91 74287 97910">+91 74287 97910</a></div>
        <div class="cell"><strong>Ground Handler (Arrival):</strong><br>Mr Lakshman Raju<br><a href="tel:+91 9533901100">+91 9533901100</a></div>
      </div>

      <div class="box">
        <strong>Passengers:</strong>
        <ul>
          <li> Mr. C V Rao </li>
          <li>Mr. Gowrinath</li>
          
        </ul>
      </div>

      <div class="box">
        <strong>Crew:</strong>
        <ul>
          <li>Capt. Srinath - <a href="+91 9629743360">+91 9629743360</a></li>
          <li>Capt Sagar Kumar Singh - <a href="+91 9629743360">+91 9629743360</a></li>
          <li>Ms Kajal Mishra - <a href="+91 9629743360">+91 9629743360</a></li>
        </ul>
      </div>

      <div class="box"><strong>Flight Catering:</strong> As Instructed</div>

        `,
      )}



  </div>
</body>
</html>

    
    `;
};

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
    logoUrl,
    operator,
    passengerInfo,
  } = quote;

  itinerary.forEach((sector, index) => {
    const paxIfno = passengerInfo?.sectors?.find(
      (pax) => pax.sectorNo == index + 1,
    );
    if (paxIfno) {
      sector.passengers = paxIfno.passengers;
      sector.meals = paxIfno.meals;
      sector.travel = paxIfno.travel;
    }
  });

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
.details {
  margin-top: 8px;
}
#invoiceLogo {
  max-width: 150px;
  height: auto;
  margin-bottom: 8px;
}

  </style>
</head>
<body>
  <div class="container">

  <!-- Header Section -->
<div class="header">
  <div class="header-left">
    <img src="${quote.logoUrl}" alt="Company Logo" id="invoiceLogo" />
    <div>
      <strong>From:</strong><br/>
      ${quote.operator?.companyName || 'Airops'}<br/>
      ${quote.operator?.address || 'Hyderabad, Telangana'}
    </div>
  </div>

  <div class="header-right">
    <div class="details">
      <strong>Quote Number:</strong> ${quote.revisedQuotationNo || quote.quotationNo}<br>
      <strong>Date:</strong> ${moment(quote.createdAt).format('DD-MM-YYYY')}
    </div>
    <div class="details">
      <strong>Client Details:</strong><br>
      Name: ${quote.client?.name || 'N/A'}<br>
      Contact: ${quote.client?.phone || 'N/A'}<br>
      Email: ${quote.client?.email || 'N/A'}
    </div>
  </div>
</div>


    <!-- Booking Details -->
    <div class="section-title">✈️ Booking Details</div>
    <table>
      <tr>
        <td><strong>Date:</strong> ${moment(createdAt).format('DD MMMM, YYYY')}</td>
        <td><strong>Aircraft:</strong> ${aircraftDetail?.name} - (${aircraftDetail?.code})</td>
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
          <td><strong>Departure Airport:</strong><br>${item?.source?.name},${item?.source?.city}<br>${item.depatureTime}</td>
          <td><strong>Arrival Airport:</strong><br>${item?.destination?.name},${item?.destination?.city}<br>${item.arrivalTime}</td>
        </tr>
      </table>

    <div class="row">
        <div class="cell">
          <strong>Arrival Transport:</strong><br>
          Category: ${item?.travel?.category || 'NA'}<br>
          Type: ${item?.travel?.type || 'NA'}<br>
          Seating Capacity: ${item?.travel?.seatingCapacity || 'NA'}<br>
          Vehicle Choice: ${item?.travel?.vehicleChoice || 'NA'}<br>
          Drop At: ${item?.travel?.dropAt || 'NA'}
        </div>
       
      </div>

     <div class="row">
        <div class="cell">
          <strong>Ground Handler (Departure):</strong><br>
          ${item?.source?.groundHandlersInfo
            ?.map(
              (handler) =>
                `${handler.fullName || 'NA'}<br><a href="tel:${handler.contactNumber || ''}">${handler.contactNumber || 'NA'}</a>`,
            )
            .join('<br>')}
        </div>
        <div class="cell">
          <strong>Ground Handler (Arrival):</strong><br>
          ${item?.destination?.groundHandlersInfo
            ?.map(
              (handler) =>
                `${handler.fullName || 'NA'}<br><a href="tel:${handler.contactNumber || ''}">${handler.contactNumber || 'NA'}</a>`,
            )
            .join('<br>')}
        </div>
      </div>

     <div class="box">
        <strong>Passengers:</strong>
        <ul>
        ${item?.passengers
          ?.map(
            (pax) =>
              `<li><strong>Name:</strong> ${pax.name}, <strong>Gender:</strong> ${pax.gender}, <strong>Age:</strong> ${pax.age}, <strong>Aadhar ID:</strong> ${pax?.aadharId}</li>`,
          )
          .join('')}
        </ul>
      </div>

     
         <div class="box">
        <div class="box"><strong>Flight Catering:</strong> As Instructed</div>
        <ul>
        ${item?.meals
          .map(
            (meal) =>
              `<li><strong>Category:</strong> ${meal.category}, <strong>Type:</strong> ${meal.type}, <strong>Portions:</strong> ${meal.portions}, <strong>Item:</strong> ${meal.item}, <strong>Instructions:</strong> ${meal.instructions}</li>`,
          )
          .join('')}
        </ul>
      </div>


      

        `,
      )}



  </div>
</body>
</html>

    
    `;
};

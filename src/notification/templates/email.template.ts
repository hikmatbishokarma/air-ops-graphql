import moment from 'moment';

export const QuotePdfTemplate = (quote) => {
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
  } = quote;

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
      ${operator?.address || ''} Hyderabad, Telengana
    </div>
  </div>

  <div class="header-right">
    <div class="details">
      <strong>Quote Number:</strong> ${revisedQuotationNo || quotationNo}<br>
      <strong>Date:</strong> ${moment(createdAt).format('DD-MM-YYYY')}
    </div>
    <div class="details">
      <strong>Client Details:</strong><br>
      Name: ${client.name}<br>
      Contact: ${client.phone}<br>
      Email: ${client.email}
    </div>
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
        <table class="total-table">
            <thead>
                <tr>
                    <th>Estimated Charter Cost</th>
                    <th>INR (₹)</th>
                </tr>
            </thead>
            <tbody>
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

<!---note--para--->
<div class="note-para-view">
<p>${aircraftDetail.noteText}</p>
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
 
    <img src="https://airops.in/${aircraftDetail.seatLayoutImage}" alt="Snow" style="width:100%">
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
             ${aircraftDetail.termsAndConditions}
        </div>
        <!-- Footer Section --> 
        

               <!----six--card--start-->

                   <div class="guest-detsils-v1">
                   <p>${aircraftDetail?.warningText ?? ''}</p>
                
                     <div class="terms-bay">
               <img src="https://airops.in/${aircraftDetail.warningImage}">
               </div>

               </div>
  

      


<!---container--close--->
    </div>


</body>
</html>

    `;
};

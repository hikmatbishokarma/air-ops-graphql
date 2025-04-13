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
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
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
    </style>
</head>
<body>

    <div class="container">
        <!-- Header Section -->
        <div class="header">
            <div class="details">
                <strong>Passenger Details:</strong><br>
                Name: ${client.name}<br>
                Contact:  ${client.phone}<br>
                Email:  ${client.email}
            </div>
            <div class="details">
                <strong>Quote Number:</strong>${revisedQuotationNo || quotationNo}<br>
                <strong>Date:</strong> ${moment(createdAt).format('DD-MMM-YYYY')}
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
                    <th>Apx.Fly.Time</th>
                    <th>Remarks</th>
                </tr>
            </thead>
            <tbody>
            ${itinerary.map(
              (item) => ` <tr>
                    <td>${moment(item.depatureDate).format('DD-MMM-YYYY')}</td>
                    <td>${item?.source?.city}</td>
                    <td>${item?.destination?.city}</td>
                    <td>${item.depatureTime}</td>
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
<p>Please Note :</p>
<p>1. All quotations/options provided above are subject to all necessary permission and 
aircraft availability at the time of charter confirmation & as per the</p>
<p>2. Any miscellaneous charges including watch hour extensions (if required) will be charged on actuals </p>
<p>3. Timings to be confirmed on the basis of NOTAM and watch hours at respective Airports.</p>
<p>4. If at Day/Night Halt Parking Is Unavailable Due to any reason, The Aircraft/Helicopter Shall Be Positioned And Parked To 
Nearest Airport and all associated charges will be charged Extra</p>
</div>

        <!----banner-one---start--->
               <div class="terms-bay">
               <img src="https://flyusa.com/wp-content/uploads/2024/09/HAWKER-800-Charter-Rates-and-Flights.jpg">
               </div>

<!----banner-two---start--->

<div class="row-side-images">
  <div class="column-img">
    <img src="https://www.fort.aero/wp-content/uploads/2023/08/Hawker-800XP-1-800x533.jpg" alt="Snow" style="width:100%">
  </div>
  <div class="column-img">
    <img src="https://www.fort.aero/wp-content/uploads/2023/08/Hawker-800XP-1-800x533.jpg" style="width:100%">
  </div>

</div>


<!----banner-three---start--->

<div class="row-side-images">
  <div class="column-img">
  <h3 class="range-text">Range Map</h3>
    <img src="https://jetsplore.com/wp-content/uploads/2023/03/HAWKER-800XP-R4550A-1024x550.jpg" alt="Snow" style="width:100%">
  </div>
  <div class="column-img">
<p>The Hawker Beechcraft 750 is a light-to-midisze jet. the Hawker 750 is powered by two honeywell engines. 
you will able to cash in Hawkers reliability and perfomance permise. while travelling styling in 750 options business jet.</p>
</div>
</div>


<!----banner-four---start--->

<div class="row-side-images">
  <div class="column-img">
 
    <img src="https://premierprivatejets.com/wp-content/uploads/2024/08/800xp_interiorLayout-b806b066-1024x314.jpeg" alt="Snow" style="width:100%">
  </div>
  <div class="column-img">
  <h3 class="range-text">Specifications</h3>
 <table id="customers">

  <tr>
    <td>Aircraft Type</td>
    <td>HAWKER-750</td>
    
  </tr>
  <tr>
    <td>Baggage Capacity</td>
    <td>79 cuft</td>
    
  </tr>
  <tr>
    <td>Cruise Speed</td>
    <td>380 Knots</td>
  
  </tr>
  <tr>
    <td>Passenger</td>
    <td>8</td>
   
  </tr>
  <tr>
    <td>Year of Manufacture</td>
    <td>2008</td>
   
  </tr>
  <tr>
    <td>Königlich Essen</td>
    <td>Philip Cramer</td>
    
  </tr>
  <tr>
    <td>Home Base</td>
    <td>Delhi</td>
   
  </tr>
  <tr>
    <td>Pilots</td>
    <td>2</td>
    
  </tr>
  
   <tr>
    <td>Cabin Crew</td>
    <td>1</td>
  </tr>
  
     <tr>
    <td>Max.range/Flying Range</td>
    <td>2923 nm</td>
    
  </tr>
  
   <tr>
    <td>Stand up cabin</td>
    <td>Yes</td>
    
  </tr>
  
     <tr>
    <td>Cabin Height</td>
    <td>5.9</td>
    
  </tr>

</table>

</div>
</div>

  <!-- Terms and Conditions -->
        <div class="terms">
            <strong>Terms and Conditions:</strong>
             ${aircraftDetail.termsAndConditions}
        </div>

 <p><b>The client hereby agrees to the terms and conditions of the charter as deﬁned above.</b></p>
 <p><b>For JetSetGo Aviation Services Pvt ltd</b></p>
               </div>

               <!----six--card--start-->

                   <div class="guest-detsils-v1">
                   <p>Dear Guest,</p>
                   <p>Greetings from Jet set Go Aviation Services Pvt Ltd!!!</p>
                   <p>Your Requested to kindly avoid carring the following items 
                   equiments along with you wwhile boarding the aircraft/helicopter</p>

                     <div class="terms-bay">
               <img src="https://book.spicejet.com/images/spicejet/dgr-info.png">
               </div>

               <div class="substances-t1">
               <img src="https://d3tfanr7troppj.cloudfront.net/static_files/images/000/006/230/original/Caution-1.webp?1729752459">
               </div>
               </div>
  

      


<!---container--close--->
    </div>


</body>
</html>

    `;
};

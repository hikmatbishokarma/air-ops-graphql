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
  

        <!-- Terms and Conditions -->
        <div class="terms">
            <strong>Terms and Conditions:</strong>
             ${aircraftDetail.termsAndConditions}
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

<!----five---statement--start--->
 <div class="policy-quotation-ol">
 <p><b>Terms & Conditions</b></p>
 <ol class="" type="1">
 <li>This is only a Quotation. The Charter will be confirmed only after receipt of 100% payment inadvance.</li>
  <li>Additional sectors required after start of the flight itinerary will be on the sole discretion of JetSetGo Aviation Services Pvt ltd</li>
   <li>The flight duty time and flight time will be governed by DGCA – CAR – 7 – J III & IV dated 23.03.2021 effective from 30.09.2022.</li>
    <li>Minimum booking value for a charter would be 2 Hrs of flying per booking per day.</li>
     <li>The Flying Hrs. mentioned in the quotation is only indicativesince:
     <ul>
     <li>Any diversions due to weather or the air route not being available due decision of Airport Authority / Air Traffic Control or due to defense activity; will be billed at
actuals after the flight is conducted in the final INVOICE.</li>
          <li>Day & Night parking at some airports are subject to the availability of Parking Bays at these airports. In case of non-availability of Parking space we may have to
move-out the aircraft / re-position the aircraft / go on a local flight to clear the parking bay for schedule flights - under such circumstances [if required] the cost of
such re-positioning of aircraft will be billed at actuals after the flight is conducted in the final INVOICE.</li>

     </ul>
     </li>
     <li>Payment: 100% advance to be received at the time of booking, as ‘confirmation charges’ for confirming the charter. Payment can be made via cheque/DD/wire transfer
in the name of JetSetGo Aviation Services Pvt ltd payable at Delhi.
<ul class="total-details-format">
<li>Account Payee : JetSetGo Aviation Services Pvt ltd</li>
<li>Bank Name : ICICI Bank Ltd.</li>
<li>Account Number : 007105006854</li>
<li>Branch : ICICI Bank Ltd., Branch: H 2, Green Park Extension, New Delhi-110016</li>
<li>Swift Code: ICICINBBCTS</li>
<li>IFSC CODE : ICIC0000071</li>
<br/>

<li>Account Payee : JetSetGo Aviation Services Pvt ltd</li>
<li>Bank Name : KOTAK Mahindra Bank</li>
<li>Account Number : 8314036043</li>
<li>Branch : B & B-1, Enkay Tower, Vanijya Nikunj, Phase-V,</li>
<li>Gurgaon - 122016, Haryana, India</li>
<li>Swift Code: KKBKINBB</li>
<li>IFSC CODE : KKBK0004257</li>

</ul>
</li>

<li>
<b>Cancellation:</b>
<ul>
<li>Cancellation Charges would be levied as a percentage of the total INVOICE value, which would be as follows:-</li>
<li>10%- against flight preparation charges will be levied if flight is cancelled due to “force majeure” reasons.</li>
<li>25% - if cancellation is done 6 days prior to schedule departure of the flight.</li>
<li>50% - if cancellation is done less than 6 days but more than 72 hrs prior to schedule departure of theflight.</li>
<li>100% of the total estimated charter cost will be levied if the flight is cancelled less than 72 hrs of scheduleddeparture.</li>
<li>Any cancellations/changes (if the same cannot be executed due to operational reasons / lapse or lack of relevant permissions) in flight sectors after the
commencement of the ‘flight program’ will be termed as a as ‘a last minute cancellation’ - and the cancellation clause of 100% would apply.</li>

</ul>
</li>
<li>
<b>Other Charges:</b>
<ul>
<li>Day Detention charges @ INR 50,000/- per hour {for Domestic} and US$ 350 per hour {for International airports} will be charged after 4 hours 
of free waiting time [in case of no overnight waiting].</li>
<li>Night halt charges will be charged @ INR 50,000/- per night, for Domestic flights within India where for International flights USD 2000. www.jetsetgo.in
info@jetsetgo.in 011-39585858</li>
<li>On non-flying days if the aircraft is kept waiting by the client, 2 hours of flying time will be charged as 'Non Flying Day Charge'. For this day no night halt will be
charged.</li>
<li>Any Watch Hour extension levied by the airport will be billed separately after the flight has been completed, as this cannot be foreseen prior to the flight.</li>
<li>Any additional charges levied by the Airport Authority, Customs or other regulatory authorities, which are not existent, now shall be billed separately </li>
<li>GST @ 18% shall be applicable as per the rule of Govt. ofIndia.</li>
</ul>
</li>
<li>In case of Foreign Nationals traveling to Defense Airﬁeld we require the complete passport details, conﬁrmed departure & arrival timings (no changes will be accepted by the Air / Naval Headquarters) 
at least 10 Working Days prior to departure of the ﬂight.</li>

<li>Whilst the invoice will be issued by JetSetGo, the contract of carriage and all liabilities associated thereof 
will be between the Charter Operator and the Customer. Based on industry norms
<ul>
<li>Upon conﬁrmation of the charter by operator full payment will need to be remitted either through the online payment gateway details 
or remittance details provided in this proforma invoice above.</li>
<li>In the interest of safety for technical reasons or in the event of bad weather it is the Operator’s 
discretion to cancel a charter without any notice and before commencement of the charter including after 
having received full payment upon which JetSetGo will endeavor given its industry wide network to seek 
a replacement aircraft. Failure to do so will limit the Operator’s or JetSetGo liability only up to 
a 100% refund of payment made by the Customer. However if the aircraft has been positioned in any other 
station other than base station and the cancellation is due to bad weather, 
then ferry charges for bringing aircraft back to base will need to be borne by theclient.</li>
</ul>
</li>

<li>US$ equivalent rates will apply for any bookings whose payments are received from outside 
India OR whose ‘country of origin’ is not India OR booking is 
from a ‘nonIndian person/company’ OR for ﬂights outside India.</li>
<li>.JSG will not be responsible for passengers carrying any contraband items& or involved/indulging in any illegal activities. </li>
<li> In the event of unforeseen circumstances, the company reserves the right to make changes in the ‘product oﬀering’. </li>
<li>Declaration: While we endeavor to provide the aircraft as per customers’ requirement, JSG shall not be liable to pay any financial damages or be held responsible for
any cancellation of flights due to technical snags, inclement weather, poor visibility, non-availability of clearances or any other reasons beyond the control of the
company. Also, please note the above offer is made subject to continuing availability of aircraft at the time of blocking the charter.</li>
<li>The general terms of use of our services as JetSetGo Aviation Services Private Limited (JetSetGo) are set forth on the Terms of Use page on the JetSetGo website at http://jetsetgo.in/terms_of_use ("Terms of Use"). By acceptance of this Proforma invoice you acknowledge having read and accepted these terms and conditions and that they constitute a legally-binding agreement between JetSetGo and you. The Terms of Use for the sections that are relevant apply to you if you are a Customer utilizing JetSetGo’s services.</li>
 </ol>
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

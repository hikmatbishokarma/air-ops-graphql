import moment from 'moment';

export const QuotePdfTemplate = (quote) => {
  const {
    itinerary,
    price,
    grandTotal,
    aircraftDetail,
    client,
    referenceNumber,
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
                <strong>Quote Number:</strong>${referenceNumber}<br>
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
    </div>

</body>
</html>

    `;
};

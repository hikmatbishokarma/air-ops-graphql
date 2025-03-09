export const QuotePdfTemplate = () => {
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
        .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        .table, .table th, .table td { border: 1px solid #ddd; }
        .table th, .table td { padding: 10px; text-align: center; }
        .table th { background-color: #f2f2f2; }
        .total-table { margin-top: 20px; width: 100%; border-collapse: collapse; }
        .total-table th, .total-table td { padding: 10px; border: 1px solid #ddd; }
        .total-table th { background-color: #f2f2f2; text-align: left; }
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
                Name: John Doe<br>
                Contact: +91-9876543210<br>
                Email: johndoe@example.com
            </div>
            <div class="details">
                <strong>Quote Number:</strong> FQ-123456<br>
                <strong>Date:</strong> 08-Mar-2025
            </div>
        </div>

        <!-- Itinerary Table -->
        <table class="table">
            <thead>
                <tr>
                    <th>Departure Date</th>
                    <th>Source</th>
                    <th>Destination</th>
                    <th>Time</th>
                    <th>Pax</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>10-Mar-2025</td>
                    <td>Hyderabad</td>
                    <td>Manali</td>
                    <td>10:30 AM</td>
                    <td>2</td>
                </tr>
                <tr>
                    <td>15-Mar-2025</td>
                    <td>Manali</td>
                    <td>Hyderabad</td>
                    <td>4:00 PM</td>
                    <td>2</td>
                </tr>
            </tbody>
        </table>

        <!-- Pricing Table -->
        <table class="total-table">
            <thead>
                <tr>
                    <th>Description</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Subtotal</td>
                    <td>₹ 50,000</td>
                </tr>
                <tr>
                    <td>GST (18%)</td>
                    <td>₹ 9,000</td>
                </tr>
                <tr>
                    <td><strong>Total</strong></td>
                    <td><strong>₹ 59,000</strong></td>
                </tr>
            </tbody>
        </table>

        <!-- Terms and Conditions -->
        <div class="terms">
            <strong>Terms and Conditions:</strong>
            <p>1. This quote is valid for 7 days from the date of issue.</p>
            <p>2. Prices are subject to change based on availability.</p>
            <p>3. Cancellation and refund policies apply as per company guidelines.</p>
        </div>
    </div>

</body>
</html>

    `;
};

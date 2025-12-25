export const APDTemplate = (data: any) => {
    const { tripId, sectorNo, note, tripDetails } = data;

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #5E6CFF; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .footer { padding: 10px; text-align: center; font-size: 12px; color: #666; }
        .info-row { margin: 10px 0; }
        .label { font-weight: bold; color: #5E6CFF; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Intimation Letter - APD</h2>
        </div>
        <div class="content">
          <p>Dear Sir/Madam,</p>
          
          <p>This is to intimate you regarding the following flight operation:</p>
          
          <div class="info-row">
            <span class="label">Trip ID:</span> ${tripId}
          </div>
          <div class="info-row">
            <span class="label">Sector:</span> ${sectorNo}
          </div>
          
          ${note ? `
          <div class="info-row">
            <span class="label">Additional Notes:</span>
            <p>${note}</p>
          </div>
          ` : ''}
          
          <p>Please find the attached document for detailed information.</p>
          
          <p>Thank you for your cooperation.</p>
          
          <p>Best regards,<br>Air Operations Team</p>
        </div>
        <div class="footer">
          This is an automated email. Please do not reply.
        </div>
      </div>
    </body>
    </html>
  `;
};

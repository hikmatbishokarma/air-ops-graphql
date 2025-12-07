




export const getRegistrationEmailTemplate = (
    fullName: string,
    email: string,
    tempPassword: string,
    resetUrl: string,
) => `
Dear ${fullName},

Welcome to Airops! Here are your login details:

Email: ${email}
Temporary Password: ${tempPassword}

Please log in and change your password immediately

Login Here: ${resetUrl}

Best regards,
Airops Support Team
`;
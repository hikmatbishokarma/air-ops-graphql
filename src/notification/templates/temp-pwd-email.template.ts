import { UserInput } from 'src/auth/dto/login-response.dto';

export const getTempPasswordEmailText = (
  user: any,
  tempPassword: string,
  resetUrl: string,
) => `
Dear ${user.name},

Here are your temporary login details:

Email: ${user.email}
Temporary Password: ${tempPassword}

Please use the link below to log in and reset your password immediately:

Reset Password: ${resetUrl}

If you didn’t request this, please ignore this email or contact our support team.

Best regards,
Airops Support Team
`;

import { HttpException, HttpStatus } from '@nestjs/common';
import { hash, compare } from 'bcrypt';
import { extname } from 'path';

export function getSchemaKey(key: string): string {
  return key === 'id' ? '_id' : key;
}

const saltOrRounds = 10;

/**
 * Hashes a plain text password.
 * @param password - The plain text password to be hashed.
 * @returns A promise that resolves to the hashed password.
 */
export async function hashPassword(password: string): Promise<string> {
  return hash(password, saltOrRounds);
}

/**
 * Compares a plain text password with a hashed password.
 * @param password - The plain text password to compare.
 * @param hashedPassword - The hashed password to compare against.
 * @returns A promise that resolves to true if the passwords match, otherwise false.
 */
export async function comparePassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return compare(password, hashedPassword);
}

export function generatePassword(length) {
  const charset =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$';
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}

export function getDateRangeFilter(
  range: string,
  startDate?: string,
  endDate?: string,
) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let filter = {};

  switch (range) {
    case 'today':
      filter = { createdAt: { $gte: today } };
      break;
    case 'yesterday':
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      filter = { createdAt: { $gte: yesterday, $lt: today } };
      break;
    case '7d':
      const lastWeek = new Date();
      lastWeek.setDate(today.getDate() - 7);
      filter = { createdAt: { $gte: lastWeek } };
      break;
    case '30d':
      const lastMonth = new Date();
      lastMonth.setDate(today.getDate() - 30);
      filter = { createdAt: { $gte: lastMonth } };
      break;
    case 'custom':
      if (startDate && endDate) {
        filter = {
          createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
        };
      }
      break;
  }

  return filter;
}

// Helper function to generate a unique file name with the original name as a prefix
export function generateFileName(file: Express.Multer.File): string {
  const originalName = file.originalname.replace(
    extname(file.originalname),
    '',
  ); // Remove the extension from original name
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
  return `${originalName}-${uniqueSuffix}`; // Concatenate original name with unique suffix
}

export const imageFileFilter = async (req, file, callback) => {
  const allowedMimeTypes = [
    'image/jpg',
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return callback(
      new HttpException(
        `${file.mimetype} not allowed!`,
        HttpStatus.BAD_REQUEST,
      ),
      false,
    );
  }
  callback(null, true);
};

// Function to calculate duration
export const calculateDuration = (depatureTime, arrivalTime) => {
  const [depHour, depMinute] = depatureTime.split(':').map(Number);
  const [arrHour, arrMinute] = arrivalTime.split(':').map(Number);

  const depTotalMinutes = depHour * 60 + depMinute;
  const arrTotalMinutes = arrHour * 60 + arrMinute;

  let diffMinutes = arrTotalMinutes - depTotalMinutes;
  if (diffMinutes < 0) {
    diffMinutes += 24 * 60; // handle next day arrival
  }

  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;

  if (hours === 0) {
    return `${minutes}min`;
  } else if (minutes === 0) {
    return `${hours}hr`;
  } else {
    return `${hours}hr ${minutes}min`;
  }
};

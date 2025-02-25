import { hash, compare } from 'bcrypt';

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

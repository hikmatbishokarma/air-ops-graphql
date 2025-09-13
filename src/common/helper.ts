import { HttpException, HttpStatus } from '@nestjs/common';
import { hash, compare } from 'bcrypt';
import { extname } from 'path';
import puppeteer, { Browser } from 'puppeteer';

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

  today.setUTCHours(0, 0, 0, 0);

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

        // filter = {
        //   createdAt: { $gte: startDate, $lte: endDate },
        // };
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

export const getDuration = (start: string, end: string) => {
  const [startH, startM] = start.split(':').map(Number);
  const [endH, endM] = end.split(':').map(Number);
  let durationMins = endH * 60 + endM - (startH * 60 + startM);
  if (durationMins < 0) durationMins += 1440;

  const h = Math.floor(durationMins / 60);
  const m = durationMins % 60;
  return `${h}h ${m}m`;
};

export async function createPDF(
  filePath: string,
  htmlContent: string,
): Promise<string> {
  const isLocal = process.env.NODE_ENV !== 'production'; // <--- Auto detect!

  const browser = await puppeteer.launch({
    headless: true,
    args: isLocal
      ? []
      : [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--single-process',
        ],
  });

  const page = await browser.newPage();
  // await page.setContent(htmlContent, { waitUntil: 'networkidle0' }); // better
  // Increase the timeout to 60 seconds
  await page.setContent(htmlContent, {
    waitUntil: 'networkidle0',
    timeout: 60000,
  });
  await page.pdf({ path: filePath, format: 'A4' });

  await browser.close();
  return filePath;
}

// // Replace all <img src="http..."> with base64 before sending to Puppeteer
async function inlineImages(html: string): Promise<string> {
  const regex = /<img[^>]+src="([^">]+)"/g;
  let match;

  while ((match = regex.exec(html)) !== null) {
    const url = match[1];
    if (/^https?:\/\//.test(url)) {
      try {
        const res = await fetch(url); // ✅ native fetch in Node 18+
        const buffer = await res.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        const contentType = res.headers.get('content-type') || 'image/png';
        const dataUri = `data:${contentType};base64,${base64}`;
        html = html.replace(url, dataUri);
      } catch (err) {
        console.error(`⚠️ Failed to fetch image: ${url}`, err);
      }
    }
  }

  return html;
}

// export async function createPDFv1(processedHtml: string): Promise<Buffer> {
//   // // Inline images before rendering
//   const html = await inlineImages(processedHtml);

//   const browser = await puppeteer.launch({ headless: true });
//   const page = await browser.newPage();

//   await page.setContent(html, { waitUntil: 'domcontentloaded' });

//   const pdfBuffer = await page.pdf({
//     format: 'A4',
//     printBackground: true,
//   });

//   await browser.close();

//   return Buffer.from(pdfBuffer);
// }

export async function createPDFv1(html: string): Promise<Buffer> {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: 'domcontentloaded' });

  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
  });

  await browser.close();

  return Buffer.from(pdfBuffer);
}

const imageCache = new Map<string, string>(); // ✅ simple in-memory cache

async function fetchImageBase64(url: string): Promise<string> {
  if (imageCache.has(url)) return imageCache.get(url)!;

  try {
    const res = await fetch(url);
    const buffer = await res.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const contentType = res.headers.get('content-type') || 'image/png';
    const dataUri = `data:${contentType};base64,${base64}`;
    imageCache.set(url, dataUri);
    return dataUri;
  } catch (err) {
    console.error(`⚠️ Failed to fetch image: ${url}`, err);
    return url; // fallback to original URL
  }
}

export async function inlineImagesParallel(html: string): Promise<string> {
  // const regex = /<img[^>]+src="([^">]+)"/g;

  const regex = /<img[^>]+src=['"]([^'">]+)['"]/g;
  const urls: string[] = [];
  let match;

  while ((match = regex.exec(html)) !== null) {
    const url = match[1];
    if (/^https?:\/\//.test(url)) urls.push(url);
  }

  const results = await Promise.all(urls.map(fetchImageBase64));
  results.forEach((dataUri, index) => {
    html = html.replaceAll(urls[index], dataUri);
  });

  return html;
}

let browser: Browser | null = null;

async function getBrowser(): Promise<Browser> {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: true,
      args:
        process.env.NODE_ENV === 'production'
          ? [
              '--no-sandbox',
              '--disable-setuid-sandbox',
              '--disable-dev-shm-usage',
              '--disable-gpu',
              '--single-process',
            ]
          : [],
    });
  }
  return browser;
}

export async function createPDFBuffer(htmlContent: string): Promise<Buffer> {
  const browser = await getBrowser();
  const page = await browser.newPage();

  // ✅ Inline images first
  // const processedHtml = await inlineImagesParallel(htmlContent);

  const html = await inlineImages(htmlContent);

  await page.setContent(html, {
    waitUntil: 'networkidle0',
    timeout: 60000,
  });

  // Puppeteer gives Uint8Array → wrap into Buffer
  const pdfUint8 = await page.pdf({ format: 'A4' });
  const buffer = Buffer.from(pdfUint8); // ✅ convert

  await page.close();
  return buffer;
}

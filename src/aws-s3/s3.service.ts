import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Readable } from 'stream';
import { ConfigService } from '@nestjs/config';
import path from 'path';
import * as mime from 'mime-types';
import { sanitizeFilename } from 'src/common/helper';
import { Upload } from '@aws-sdk/lib-storage';

@Injectable()
export class S3Service {
  private s3: S3Client;
  private bucket: string;
  private cloudFrontBaseUrl: string;

  constructor(private readonly config: ConfigService) {
    this.s3 = new S3Client({
      region: this.config.get<string>('s3.aws_region'),
      credentials: {
        accessKeyId: this.config.get<string>('s3.aws_access_key_id'),
        secretAccessKey: this.config.get<string>('s3.aws_secret_access_key'),
      },
    });

    this.bucket = this.config.get<string>('s3.aws_bucket_name');
    this.cloudFrontBaseUrl = this.config.get<string>(
      's3.aws_cloudfront_base_url',
    );
  }

  //   async uploadFile(file: Express.Multer.File, category: string) {
  //     // const fileKey = `${category}/${Date.now()}-${path.basename(file.originalname)}`;

  //     const baseName = path.basename(file.originalname);
  //     const safeBaseName = sanitizeFilename(baseName); // Clean the name

  //     const fileKey = `${category}/${Date.now()}-${safeBaseName}`; // Use the safe name

  //     // Get the file extension
  //     const extension = path.extname(file.originalname).toLowerCase();

  //     let contentType = 'application/octet-stream';

  //     // 🛑 Critical Fix: Explicitly set Content-Type for SVG
  //     if (extension === '.svg') {
  //       contentType = 'image/svg+xml';
  //     } else {
  //       // Fallback to mime-type lookup for other types (like .png, .jpeg)
  //       contentType =
  //         mime.lookup(file.originalname) || 'application/octet-stream';
  //     }
  //     const command = new PutObjectCommand({
  //       Bucket: this.bucket,
  //       Key: fileKey,
  //       Body: file.buffer,
  //       ContentType: contentType,
  //     });

  //     try {
  //       // Send the command and wait for the upload to complete
  //       await this.s3.send(command);
  //     } catch (error) {
  //       console.error('S3 Upload Failed:', error);
  //       // It's a good idea to throw an exception here
  //       throw new InternalServerErrorException(
  //         'Media upload failed on the server side.',
  //       );
  //     }

  //     // 1. Get the pre-signed URL immediately after upload
  //     const signedUrl = await this.getSignedUrl(fileKey);

  //     return {
  //       key: fileKey, // <--- Store this in your database
  //       previewUrl: signedUrl, // <--- Use this for immediate display/preview
  //     };
  //   }

  async uploadFile(file: Express.Multer.File, category: string) {
    const baseName = path.basename(file.originalname);
    // Assuming sanitizeFilename is available and correct
    const safeBaseName = sanitizeFilename(baseName);
    const fileKey = `${category}/${Date.now()}-${safeBaseName}`;

    const extension = path.extname(file.originalname).toLowerCase();
    let contentType = 'application/octet-stream';

    // Set Content-Type correctly
    if (extension === '.svg') {
      contentType = 'image/svg+xml';
    } else {
      contentType =
        mime.lookup(file.originalname) || 'application/octet-stream';
    }

    const fileStream = Readable.from(file.buffer);

    // 🔑 Replace PutObjectCommand with Upload utility
    const uploader = new Upload({
      client: this.s3, // Your S3 client instance
      params: {
        Bucket: this.bucket,
        Key: fileKey,
        Body: fileStream, // Use the buffer as the body
        ContentType: contentType,
        ContentDisposition: 'inline', // Recommended for direct browser display
      },
      queueSize: 4, // Optional: Number of concurrent parts to upload
      partSize: 5242880, // Optional: Part size (defaults to 5MB)
    });

    try {
      // The .done() method waits for the entire multipart upload to finish
      const result = await uploader.done();

      return {
        key: fileKey,
        previewUrl: `${this.cloudFrontBaseUrl}${fileKey}`,
      };
    } catch (error) {
      console.error('S3 Upload Failed via Upload utility:', error);
      throw new InternalServerErrorException(
        'Media upload failed on the server side.',
      );
    }
  }

  /** ✅ Delete a file from S3 */
  async deleteFile(key: string) {
    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
    return { message: 'Deleted successfully', key };
  }

  /** ✅ Generate pre-signed URL for temporary access */
  async getSignedUrl(key: string, expiresInSeconds = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    return getSignedUrl(this.s3, command, { expiresIn: expiresInSeconds });
  }

  /** ✅ Get object stream (e.g. for PDF inlining) */
  async getObjectStream(key: string): Promise<Readable> {
    const { Body } = await this.s3.send(
      new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
    return Body as Readable;
  }
}

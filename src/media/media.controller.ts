import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage, memoryStorage } from 'multer';
import { generateFileName, imageFileFilter } from 'src/common/helper';
import * as path from 'path';
import * as fs from 'fs/promises';
import { S3Service } from 'src/aws-s3/s3.service';
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

@Controller('api/media')
export class MediaController {
  constructor(private readonly s3Service: S3Service) {}

  // @Post('upload/:category')
  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     storage: diskStorage({
  //       destination: (req, file, callback) => {
  //         const category = req.params.category || 'others';
  //         const uploadPath = path.join('media', category);

  //         // Ensure folder exists
  //         // fs.mkdirSync(uploadPath, { recursive: true });
  //         fs.mkdir(uploadPath, { recursive: true });

  //         callback(null, uploadPath);
  //       },
  //       filename: (req, file, callback) => {
  //         const fileName = generateFileName(file); // Your existing logic
  //         callback(null, fileName);
  //       },
  //     }),
  //   }),
  // )
  // uploadFile(
  //   @Param('category') category: string,
  //   @UploadedFile() file: Express.Multer.File,
  //   @Body() body,
  // ) {
  //   const filePath = path
  //     .join('media', category, file.filename)
  //     .replace(/\\/g, '/');

  //   return {
  //     message: 'File uploaded successfully',
  //     filePath,
  //   };
  // }

  // @Post('uploads/:category')
  // @UseInterceptors(
  //   FilesInterceptor('files', 10, {
  //     storage: diskStorage({
  //       destination: async (req, file, callback) => {
  //         try {
  //           const category = req.params.category || 'others';
  //           const uploadPath = path.join('media', category);
  //           await fs.mkdir(uploadPath, { recursive: true }); // ✅ Non-blocking
  //           callback(null, uploadPath);
  //         } catch (err) {
  //           callback(err, '');
  //         }
  //       },
  //       filename: (req, file, callback) => {
  //         const fileName = generateFileName(file);
  //         callback(null, fileName);
  //       },
  //     }),
  //     fileFilter: imageFileFilter,
  //     limits: {
  //       fileSize: 5 * 1024 * 1024, // 5MB per file
  //     },
  //   }),
  // )
  // async uploadFiles(
  //   @Param('category') category: string,
  //   @Body() body,
  //   @UploadedFiles() files: Express.Multer.File[],
  // ) {
  //   if (!files?.length) {
  //     throw new BadRequestException('No files uploaded.');
  //   }

  //   const filePaths = files.map((file) =>
  //     path.join('media', category, file.filename).replace(/\\/g, '/'),
  //   );

  //   return {
  //     message: 'Files uploaded successfully',
  //     filePaths,
  //   };
  // }

  @Delete('delete/:category')
  async deleteFile(
    @Param('category') category: string,
    @Query('filename') filename: string,
  ) {
    if (!filename) {
      throw new BadRequestException('Filename query param is required');
    }

    const filePath = path.join(
      __dirname,
      '..',
      '..',
      'media',
      category,
      filename,
    );

    try {
      // Check if file exists
      await fs.access(filePath);

      // Delete the file
      await fs.unlink(filePath);

      return {
        message: 'File deleted successfully',
        filename,
        category,
      };
    } catch (err) {
      throw new BadRequestException(
        'File does not exist or could not be deleted',
      );
    }
  }

  // Inside MediaController
  @Delete('delete') // <--- New simpler path
  async deleteFileFromS3(
    @Query('key') key: string, // <--- Accepts the full S3 Key
  ) {
    if (!key) {
      throw new BadRequestException('S3 Key query param is required');
    }
    // Call the S3 Service directly with the full key
    return await this.s3Service.deleteFile(key);
    // ... (return success)
  }

  @Post('upload/:category')
  @UseInterceptors(
    FileInterceptor('file', {
      // 🔑 FINAL FIX: Explicitly set storage to memoryStorage()
      storage: memoryStorage(),
      limits: {
        fileSize: MAX_FILE_SIZE,
      },
    }),
  )
  async uploadToS3(
    @Param('category') category: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // CRITICAL CHECK: Ensure 'file' is present
    if (!file) {
      throw new BadRequestException(
        'No file uploaded or file rejected by server.',
      );
    }
    // CRITICAL CHECK: Ensure 'file.buffer' is present and not empty
    if (!file.buffer || file.buffer.length === 0) {
      throw new BadRequestException(
        'File content is empty. Check server limits.',
      );
    }
    return await this.s3Service.uploadFile(file, category);
  }

  @Post('uploads/:category')
  // @UseInterceptors(FilesInterceptor('files', 10)) // Max 10 files
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      // 🔑 Critical Fix: Force memory storage for the buffer
      storage: memoryStorage(),
      // 🔑 Set limits for size
      limits: {
        fileSize: MAX_FILE_SIZE,
        // You can add other limits here if needed
      },
    }),
  )
  async uploadMultipleToS3(
    @Param('category') category: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    // CRITICAL CHECK: Ensure ALL files have buffer content
    for (const file of files) {
      if (!file.buffer || file.buffer.length === 0) {
        throw new BadRequestException(
          `File '${file.originalname}' content is empty. Check server limits.`,
        );
      }
    }

    // Use Promise.all to concurrently upload all files to S3
    const uploadPromises = files.map((file) =>
      this.s3Service.uploadFile(file, category),
    );

    // Wait for all uploads to complete
    const results = await Promise.all(uploadPromises);

    // 'results' will be an array of the return values from s3Service.uploadFile
    // which likely contains the S3 key, URL, or ETag.

    return {
      message: 'Files uploaded to S3 successfully',
      files: results,
    };
  }

  @Get('signed-url')
  async getSignedUrl(@Query('key') key: string) {
    if (!key) throw new BadRequestException('key is required');
    const url = await this.s3Service.getSignedUrl(key);
    return { key, url };
  }
}

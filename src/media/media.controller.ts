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
import { diskStorage } from 'multer';
import { generateFileName, imageFileFilter } from 'src/common/helper';
import * as path from 'path';
import * as fs from 'fs/promises';

@Controller('api/media')
export class MediaController {
  // @Post('upload')
  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     storage: diskStorage({
  //       destination: './media/files',
  //       filename: (req, file, callback) => {
  //         const fileName = generateFileName(file); // Generate unique filename for each file
  //         callback(null, fileName); // Save the file with the generated name
  //       },
  //     }),
  //   }),
  // )
  // uploadFile(@Body() body, @UploadedFile() file: Express.Multer.File) {
  //   console.log('file', body, file);
  //   // Normalize the file path and replace backslashes with forward slashes
  //   const filePath = path
  //     .join('media', 'files', file.filename)
  //     .replace(/\\/g, '/');
  //   return {
  //     message: 'File uploaded successfully',
  //     filePath: filePath, // Returning the relative path to the uploaded file
  //   };
  // }

  @Post('upload/:category')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, callback) => {
          const category = req.params.category || 'others';
          const uploadPath = path.join('media', category);

          // Ensure folder exists
          // fs.mkdirSync(uploadPath, { recursive: true });
          fs.mkdir(uploadPath, { recursive: true });

          callback(null, uploadPath);
        },
        filename: (req, file, callback) => {
          const fileName = generateFileName(file); // Your existing logic
          callback(null, fileName);
        },
      }),
    }),
  )
  uploadFile(
    @Param('category') category: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body,
  ) {
    const filePath = path
      .join('media', category, file.filename)
      .replace(/\\/g, '/');

    return {
      message: 'File uploaded successfully',
      filePath,
    };
  }

  // @Post('uploads')
  // @UseInterceptors(
  //   FilesInterceptor('files', 10, {
  //     storage: diskStorage({
  //       destination: './media/files',
  //       filename: (req, file, callback) => {
  //         const fileName = generateFileName(file); // Generate unique filename for each file
  //         callback(null, fileName); // Save the file with the generated name
  //       },
  //     }),
  //     fileFilter: imageFileFilter,
  //     limits: {
  //       fileSize: 5 * 1024 * 1024, // Set the file size limit to 5MB (in bytes)
  //     },
  //   }),
  // )
  // uploadFiles(@Body() body, @UploadedFiles() files: Express.Multer.File[]) {
  //   if (files.some((file) => file.size > 5 * 1024 * 1024)) {
  //     throw new BadRequestException('File size exceeds the 5MB limit');
  //   }

  //   // Normalize the file path and replace backslashes with forward slashes
  //   const filePaths = files.map((file) =>
  //     path.join('media', 'files', file.filename).replace(/\\/g, '/'),
  //   );

  //   return {
  //     message: 'Files uploaded successfully',
  //     filePaths: filePaths, // Returning the paths for all uploaded files
  //   };
  // }

  // @Post('uploads/:category')
  // @UseInterceptors(
  //   FilesInterceptor('files', 10, {
  //     storage: diskStorage({
  //       destination: (req, file, callback) => {
  //         const category = req.params.category || 'others'; // Use the category from the URL parameter
  //         const uploadPath = path.join('media', category);

  //         // Ensure folder exists for the specific category
  //         fs.mkdirSync(uploadPath, { recursive: true });

  //         callback(null, uploadPath); // Set the upload destination dynamically
  //       },
  //       filename: (req, file, callback) => {
  //         const fileName = generateFileName(file); // Generate a unique file name for each file
  //         callback(null, fileName); // Save the file with the generated name
  //       },
  //     }),
  //     fileFilter: imageFileFilter, // Ensure you have a proper image file filter
  //     limits: {
  //       fileSize: 5 * 1024 * 1024, // Set the file size limit to 5MB (in bytes)
  //     },
  //   }),
  // )
  // uploadFiles(
  //   @Param('category') category: string,
  //   @Body() body,
  //   @UploadedFiles() files: Express.Multer.File[],
  // ) {
  //   if (files.some((file) => file.size > 5 * 1024 * 1024)) {
  //     throw new BadRequestException('File size exceeds the 5MB limit');
  //   }

  //   // Normalize the file paths and replace backslashes with forward slashes
  //   const filePaths = files.map((file) =>
  //     path.join('media', category, file.filename).replace(/\\/g, '/'),
  //   );

  //   return {
  //     message: 'Files uploaded successfully',
  //     filePaths: filePaths, // Returning the paths for all uploaded files
  //   };
  // }

  @Post('uploads/:category')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: async (req, file, callback) => {
          try {
            const category = req.params.category || 'others';
            const uploadPath = path.join('media', category);
            await fs.mkdir(uploadPath, { recursive: true }); // ✅ Non-blocking
            callback(null, uploadPath);
          } catch (err) {
            callback(err, '');
          }
        },
        filename: (req, file, callback) => {
          const fileName = generateFileName(file);
          callback(null, fileName);
        },
      }),
      fileFilter: imageFileFilter,
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB per file
      },
    }),
  )
  async uploadFiles(
    @Param('category') category: string,
    @Body() body,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (!files?.length) {
      throw new BadRequestException('No files uploaded.');
    }

    const filePaths = files.map((file) =>
      path.join('media', category, file.filename).replace(/\\/g, '/'),
    );

    return {
      message: 'Files uploaded successfully',
      filePaths,
    };
  }

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

  @Get('upload1')
  getHello(): string {
    return 'i am inside media';
  }
}

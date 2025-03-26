import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { generateFileName, imageFileFilter } from 'src/common/helper';
import * as path from 'path';

@Controller('media')
export class MediaController {
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './media/files',
        filename: (req, file, callback) => {
          const fileName = generateFileName(file); // Generate unique filename for each file
          callback(null, fileName); // Save the file with the generated name
        },
      }),
    }),
  )
  uploadFile(@Body() body, @UploadedFile() file: Express.Multer.File) {
    console.log('file', body, file);
    // Normalize the file path and replace backslashes with forward slashes
    const filePath = path
      .join('media', 'files', file.filename)
      .replace(/\\/g, '/');
    return {
      message: 'File uploaded successfully',
      filePath: filePath, // Returning the relative path to the uploaded file
    };
  }

  @Post('uploads')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './media/files',
        filename: (req, file, callback) => {
          const fileName = generateFileName(file); // Generate unique filename for each file
          callback(null, fileName); // Save the file with the generated name
        },
      }),
      fileFilter: imageFileFilter,
      limits: {
        fileSize: 5 * 1024 * 1024, // Set the file size limit to 5MB (in bytes)
      },
    }),
  )
  uploadFiles(@Body() body, @UploadedFiles() files: Express.Multer.File[]) {
    if (files.some((file) => file.size > 5 * 1024 * 1024)) {
      throw new BadRequestException('File size exceeds the 5MB limit');
    }

    // Normalize the file path and replace backslashes with forward slashes
    const filePaths = files.map((file) =>
      path.join('media', 'files', file.filename).replace(/\\/g, '/'),
    );

    return {
      message: 'Files uploaded successfully',
      filePaths: filePaths, // Returning the paths for all uploaded files
    };
  }

  @Get('upload1')
  getHello(): string {
    return 'i am inside media';
  }
}

import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('material-didatico')
export class MaterialDidaticoUploadController {

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/material-didatico',
        filename: (req, file, callback) => {
          const uniqueName =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(
            null,
            uniqueName + extname(file.originalname),
          );
        },
      }),
    }),
  )
  upload(@UploadedFile() file: Express.Multer.File) {
    return {
      message: 'Upload realizado com sucesso',
      filename: file.filename,
      url: `/uploads/material-didatico/${file.filename}`,
    };
  }
}


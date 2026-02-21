import { BadRequestException, Injectable } from "@nestjs/common";
import sharp from "sharp";
import { FilesService } from "./files.service";

@Injectable()
export class ImagesService {
  private static readonly allowedFormats = new Set(["jpeg", "png", "webp"]);
  private static readonly mimeTypeByFormat: Record<string, string> = {
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp"
  };

  constructor(private readonly filesService: FilesService) {}

  async create(file: Express.Multer.File) {
    await this.assertValidImage(file);
    return this.filesService.create(file);
  }

  async createWithStorageKey(storageKey: string, file: Express.Multer.File) {
    await this.assertValidImage(file);
    return this.filesService.createWithStorageKey(storageKey, file);
  }

  async update(storageKey: string, file: Express.Multer.File) {
    await this.assertValidImage(file);
    return this.filesService.update(storageKey, file);
  }

  private async assertValidImage(file: Express.Multer.File) {
    if (!file.buffer.length) {
      throw new BadRequestException("Uploaded file is empty.");
    }

    const metadata = await sharp(file.buffer)
      .metadata()
      .catch(() => null);
    const format = metadata?.format;

    if (!format || !ImagesService.allowedFormats.has(format)) {
      throw new BadRequestException(
        "Uploaded file must be a valid JPEG, PNG, or WEBP image."
      );
    }

    const expectedMimeType = ImagesService.mimeTypeByFormat[format];
    if (file.mimetype !== expectedMimeType) {
      throw new BadRequestException(
        "File content does not match the provided MIME type."
      );
    }
  }
}

import { HttpException, HttpStatus } from '@nestjs/common';

export class StorageException extends HttpException {
  constructor(message: string, statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR) {
    super(message, statusCode);
  }
}

export class FileNotFoundException extends StorageException {
  constructor(key: string) {
    super(`File not found: ${key}`, HttpStatus.NOT_FOUND);
  }
}

export class StorageOperationException extends StorageException {
  constructor(operation: string, cause?: Error) {
    super(
      `Storage operation failed: ${operation}${cause ? ` - ${cause.message}` : ''}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}


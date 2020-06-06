import { validateSync } from 'class-validator';
import { HttpException, HttpStatus } from '@nestjs/common';

export class BaseValidateDTO {
  validate() {
    const errors = validateSync(this);
    if (errors.length > 0) {
      throw new HttpException(errors, HttpStatus.BAD_REQUEST);
    }
  }
}

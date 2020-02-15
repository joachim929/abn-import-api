import { Injectable } from '@nestjs/common';
import { User } from '../user.entity';

@Injectable()
export class UserValidationService {
  validResponseLength(response: User[]) {
    return response.length === 1;
  }
}

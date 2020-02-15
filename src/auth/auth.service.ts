import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {
  }

  async validateUser(userName: string, pass: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.userService.getUserByUserName(userName).then((user) => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const bycrypt = require('bcrypt');
        bycrypt.compare(pass, user.password).then(result => {
          if (result === true) {
            resolve(user);
          } else {
            resolve(null);
          }
        })
      });
    })
  }
}

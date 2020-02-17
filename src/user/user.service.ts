import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRepositoryService } from './user-repository/user-repository.service';
import { User } from './user.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { UserValidationService } from './user-validation/user-validation.service';
import { UserDTO } from './dtos/user.dto';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepositoryService,
    private validationService: UserValidationService,
  ) {
  }

  getUser(id: number): Promise<User> {
    return new Promise<User>((resolve, reject) => {
      this.userRepository.getUser(id).then((response: User[]) => {
        if (this.validationService.validResponseLength(response)) {
          resolve(response[0]);
        } else {
          throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
        }
      }).catch(reason => reject(reason));
    });
  }

  getUserByUserName(userName: string): Promise<User> {
    return new Promise<User>((resolve, reject) => {
      this.userRepository.getUserByName(userName).then((response: User[]) => {
        if (this.validationService.validResponseLength(response)) {
          resolve(response[0]);
        } else {
          throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
        }
      });
    });
  }

  getUsers(): Promise<UserDTO[]> {
    return new Promise((resolve, reject) => {
      this.userRepository.getUsers().then((response: User[]) => {
        if (response.length > 0) {
          resolve(response.map(user => new UserDTO(user)));
        } else {
          throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
        }
      }).catch(reason => reject(reason));
    });
  }


  patchUser(user: User): Promise<void> {
    return new Promise((resolve, reject) => {
      this.userRepository.updateUser(user.id, user).then((response: UpdateResult) => {
        resolve();
      }).catch(reason => reject(reason));
    });
  }


  deleteUser(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.userRepository.deleteUser(id).then((response: DeleteResult) => {
        if (response.raw.length === 0) {
          resolve();
        } else {
          throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
        }
      }).catch(reason => reject(reason));
    });
  }

  createUser(user: User): Promise<User> {
    return new Promise((resolve, reject) => {
      this.hashPassword(user).then(_user => {
        this.userRepository.createUser(_user).then((response: User) => {
          resolve(response);
        }).catch(reason => reject(reason));
      });
    });
  }

  private hashPassword(user: User) {
    return new Promise(resolve => {
      if (user.password) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const bcrypt = require('bcrypt');
        const saltRounds = 10;
        bcrypt.hash(user.password, saltRounds).then(hash => {
          user.password = hash;
          resolve(user);
        });
      } else {
        throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
      }
    });

  }
}

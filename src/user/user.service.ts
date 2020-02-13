import { Injectable } from '@nestjs/common';
import { UserRepositoryService } from './user-repository/user-repository.service';
import { User } from './user.entity';
import { DeleteResult, UpdateResult } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepositoryService,
  ) {
  }

  getUser(id: number): Promise<User> {
    return new Promise<User>((resolve, reject) => {
      this.userRepository.getUser(id).then((response: User[]) => {
        if (response.length === 1) {
          resolve(response[0]);
        } else if (response.length < 0) {
          reject(`No user with id: ${id}`);
        } else {
          reject(`Found unexpected amount of entries of user.id ${id}`);
        }
      }).catch(reason => reject(reason));
    });
  }

  getUsers(): Promise<User[]> {
    return new Promise((resolve, reject) => {
      this.userRepository.getUsers().then((response: User[]) => {
        if (response.length > 0) {
          resolve(response);
        } else {
          reject(`Found no users`);
        }
      }).catch(reason => reject(reason));
    });
  }


  patchUser(user: User) {
    return new Promise((resolve, reject) => {
      this.userRepository.updateUser(user.id, user).then((response: UpdateResult) => {
        resolve(response);
      }).catch(reason => reject(reason));
    });
  }


  deleteUser(id: number) {
    return new Promise((resolve, reject) => {
      this.userRepository.deleteUser(id).then((response: DeleteResult) => {
        if (response.raw.length === 0) {
          resolve();
        } else {
          reject(response.raw);
        }
      }).catch(reason => reject(reason));
    });
  }

  createUser(user: User) {
    return new Promise((resolve, reject) => {
      this.userRepository.createUser(user).then((response: User) => {
        resolve(response);
      }).catch(reason => reject(reason));
    });
  }
}


import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {BinderKeys} from '../keys';
import {ILogger} from '../logger.interface';
import {User} from '../models/user.model';
import {UserRepository} from '../repositories';
import {userCredentials} from '../types';

export interface IUserSignup {

  signup(email: string, password: string): void;
  authenticateUser(cred: userCredentials): Promise<User>;

}

export class UserSignup implements IUserSignup {

  constructor(
    @inject(BinderKeys.LOGGER)
    private logger: ILogger,
    @repository(UserRepository)
    private userRepository: UserRepository
  ) { }

  signup(email: string, password: string): void {

    if (password.length < 8) {

      this.logger.info('Password length should be more than 8.');
      throw new Error('Password length invalid');
    }

  }
  async authenticateUser(cred: userCredentials): Promise<User> {

    const foundUser = await this.userRepository.findOne(
      {
        where: {
          email: cred.email,
        }
      }
    );

    if (!foundUser) {
      throw new HttpErrors.NotFound(`Customer with this ${cred.email} Id not found`);
    }

    if (!(foundUser.password == cred.password)) {

      throw new HttpErrors.Unauthorized('Password does not match');

    }
    return foundUser;
  }

}


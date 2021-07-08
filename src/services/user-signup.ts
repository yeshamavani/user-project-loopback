
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import * as jwt from 'jsonwebtoken';
import {BinderKeys} from '../keys';
import {ILogger} from '../logger.interface';
import {User} from '../models/user.model';
import {UserRepository} from '../repositories';
import {MyUserProfile, userCredentials} from '../types';


export interface IUserSignup {

  validateCredential(email: string, password: string): void;
  generateToken(userProfile: UserProfile): Promise<string>;
  authenticateUser(cred: userCredentials): Promise<User>;
  verifyCredentials(cred: userCredentials): Promise<User>;
  convertToUserProfile(user: User): UserProfile;
}

export class UserSignup implements IUserSignup {

  constructor(
    @inject(BinderKeys.LOGGER)
    private logger: ILogger,
    @repository(UserRepository)
    private userRepository: UserRepository
  ) { }

  validateCredential(email: string, password: string): void {

    if (password.length < 8) {

      this.logger.info('Password length should be more than 8.');
      throw new Error('Password length invalid');
    }

  }

  async generateToken(userProfile: UserProfile): Promise<string> {

    if (!userProfile) {
      throw new Error('User Profile is null');
    }

    let token = '';
    try {
      token = await jwt.sign(userProfile, '123asdf', {
        expiresIn: '7d'
      });
    } catch (error) {
      throw error;
    }

    return token;
  }

  // async getUserfromEmail(useremail: email): Promise<User> {

  //   const foundUser = await this.userRepository.findOne(
  //     {
  //       where: {
  //         email: useremail.email,
  //       }
  //     }
  //   );

  //   if (!foundUser) {
  //     throw new HttpErrors.NotFound(`Customer with this ${useremail.email} email not found`);
  //   }

  //   return foundUser;
  // }


  async authenticateUser(credentials: userCredentials): Promise<User> {

    const foundUser = await this.userRepository.findOne(
      {
        where: {
          email: credentials.email,
        }
      }
    );

    if (!foundUser) {
      throw new HttpErrors.NotFound(`Customer with this ${credentials.email} Id not found`);
    }

    if (!(foundUser.password == credentials.password)) {

      throw new HttpErrors.Unauthorized('Password does not match');

    }
    return foundUser;
  }

  convertToUserProfile(user: User): MyUserProfile {

    console.log('Role -- ', user.role);
    return {
      [securityId]: (user.uid ? user.uid.toString() : ''),
      name: user.firstName,
      id: user.uid,
      email: user.email,
      role: user.role,
      permissions: []
    };

  }

  async verifyCredentials(credentials: userCredentials): Promise<User> {

    const foundUser = await this.userRepository.findOne(
      {
        where: {
          email: credentials.email,
        }
      }
    );

    if (!foundUser) {
      throw new HttpErrors.NotFound(`Customer with this ${credentials.email} Id not found`);
    }

    if (!(foundUser.password == credentials.password)) {

      throw new HttpErrors.Unauthorized('Password does not match');

    }
    return foundUser;


  }
}


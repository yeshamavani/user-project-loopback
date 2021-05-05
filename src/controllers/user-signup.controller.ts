import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {getModelSchemaRef, post, requestBody, response} from '@loopback/rest';
import * as jwt from 'jsonwebtoken';
import {BinderKeys} from '../keys';
import {User} from '../models/user.model';
import {UserRepository} from '../repositories';
import {UserSignup} from '../services/user-signup';
import {userCredentials} from '../types';

export class UserSignupController {
  constructor(
    @repository(UserRepository)
    private userRepository: UserRepository,
    @inject(BinderKeys.USERSIGNUP)
    private signupService: UserSignup,
  ) { }


  @post('/users/signup')
  @response(200, {
    description: 'Creating a new user',
    content: {'application/json': {schema: getModelSchemaRef(User)}}
  })
  async createUser(
    @requestBody()
    req: User,
  ): Promise<User> {

    //any validations if required
    this.signupService.signup(req.email, (req.password ? req.password : ''));
    const addedUser = await this.userRepository.create(req);
    delete addedUser.password;

    return addedUser;

  }

  @post('/users/login')
  @response(200, {
    description: 'Login Token',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            token: {
              type: 'string'
            }
          }
        }
      }
    }
  }
  )

  async userLogin(
    @requestBody()
    cred: userCredentials): Promise<{token: string}> {

    const foundUser = await this.signupService.authenticateUser(cred);
    const payload = cred.email;
    const token = await jwt.sign(payload, '123asdf5');

    return Promise.resolve({token});
  }



}

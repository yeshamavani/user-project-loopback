import {authenticate, AuthenticationBindings, TokenService} from '@loopback/authentication';
import {TokenServiceBindings} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {get, getModelSchemaRef, post, requestBody, response, SchemaObject} from '@loopback/rest';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {BinderKeys} from '../keys';
import {User} from '../models/user.model';
import {UserRepository} from '../repositories/user.repository';
import {UserSignup} from '../services/user-signup';
import {MyUserProfile, userCredentials} from '../types';



const CredentialsSchema: SchemaObject = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
    },
    password: {
      type: 'string',
      minLength: 8,
    },
  },
};

export const CredentialsRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': {schema: CredentialsSchema},
  },
};

export class UserSignupController {

  constructor(
    @repository(UserRepository)
    private userRepository: UserRepository,
    @inject(BinderKeys.USERSIGNUP)
    private signupService: UserSignup,
    @inject(SecurityBindings.USER, {optional: true})
    public user: UserProfile,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
  ) { }

  @post('/users/signup2')
  @response(200, {
    description: 'Get the user details after',
    content: {'application/json': {schema: getModelSchemaRef(User)}}
  })
  async addUser(
    @requestBody()
    req: User,
  ): Promise<User> {

    //any validations if required
    this.signupService.validateCredential(req.email, (req.password ? req.password : ''));
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
    @requestBody(CredentialsRequestBody)
    cred: userCredentials): Promise<{token: string}> {

    const foundUser = await this.signupService.verifyCredentials(cred);
    const userProfile = this.signupService.convertToUserProfile(foundUser);
    console.log('user Profile from controller', JSON.stringify(userProfile));
    //const token = await this.signupService.generateToken(userProfile);
    const token = await this.jwtService.generateToken(userProfile);
    return Promise.resolve({token});
  }

  @authenticate('jwt')
  @get('/getauthuser')
  async getUser(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUserProfile: MyUserProfile,
  ): Promise<UserProfile> {
    return currentUserProfile;
  }


}


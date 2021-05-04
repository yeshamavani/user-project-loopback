import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {getModelSchemaRef, post, requestBody, response} from '@loopback/rest';
import * as jwt from 'jsonwebtoken';
import {BinderKeys} from '../keys';
import {Customer} from '../models/customer.model';
import {CustomerRepository} from '../repositories/customer.repository';
import {CustomerLogin} from '../services/customer-login';
import {CustomerSignup} from '../services/customer-signup';
import {credentials} from '../types';

export class CustomerSignupContoller {

  constructor(
    @repository(CustomerRepository)
    private customerRepository: CustomerRepository,
    @inject(BinderKeys.CUSTOMERSIGNUP)
    private signupService: CustomerSignup,
    @inject(BinderKeys.CUSTOMERLOGIN)
    private loginService: CustomerLogin
  ) { }

  @post('/customers/signup')
  @response(200, {
    description: 'Creating a new user',
    content: {'application/json': {schema: getModelSchemaRef(Customer)}}
  })
  async createCustomer(
    @requestBody()
    req: Customer,
  ): Promise<Customer> {

    //any validations if required
    this.signupService.signup(req.id, (req.password ? req.password : ''));
    const addedCustomer = await this.customerRepository.create(req);
    delete addedCustomer.password;

    return addedCustomer;

  }
  @post('/customers/login')
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

  async customerLogin(
    @requestBody()
    cred: credentials): Promise<{token: string}> {

    const foundUser = await this.loginService.authenticateUser(cred);
    const payload = cred.id.toString();
    const token = await jwt.sign(cred, '123asdf5', {
      expiresIn: '10h'
    })

    return Promise.resolve({token});
  }


}

import {BindingKey} from '@loopback/core';
import {ILogger} from './logger.interface';
import {ICustomerSignup} from './services/customer-signup';
import {IUserSignup} from './services/user-signup';

export namespace BinderKeys {

  export const LOGGER = BindingKey.create<ILogger>('winston.logger');
  export const CUSTOMERSIGNUP = BindingKey.create<ICustomerSignup>('customer.signup');
  export const USERSIGNUP = BindingKey.create<IUserSignup>('user.signup');


}

import {BindingKey} from '@loopback/core';
import {ILogger} from './logger.interface';
import {ICustomerLogin} from './services/customer-login';
import {ICustomerSignup} from './services/customer-signup';

export namespace BinderKeys {

  export const LOGGER = BindingKey.create<ILogger>('winston.logger');
  export const CUSTOMERSIGNUP = BindingKey.create<ICustomerSignup>('customer.signup');
  export const CUSTOMERLOGIN = BindingKey.create<ICustomerLogin>('customer.login');


}

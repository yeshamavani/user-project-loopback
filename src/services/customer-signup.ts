import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {BinderKeys} from '../keys';
import {ILogger} from '../logger.interface';
import {CustomerRepository} from '../repositories';

export interface ICustomerSignup {

  signup(id: number, password: string): void;
}



export class CustomerSignup implements ICustomerSignup {

  constructor(
    @repository(CustomerRepository)
    private custRepository: CustomerRepository,
    @inject(BinderKeys.LOGGER)
    private logger: ILogger
  ) { }

  signup(id: number, password: string): void {

    // const customer = this.custRepository.findById(id);
    // console.log(customer);
    // console.log('-------------');
    // console.log(id);
    // console.log('-------------');
    // if (customer) {

    //   throw new Error('Customer with same id already exists.');
    // }

    if (password.length < 8) {

      this.logger.info('Password length should be more than 8.');
      throw new Error('Password length invalid');
    }


  }
}


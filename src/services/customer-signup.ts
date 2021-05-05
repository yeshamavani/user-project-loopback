import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {BinderKeys} from '../keys';
import {ILogger} from '../logger.interface';
import {Customer} from '../models/customer.model';
import {CustomerRepository} from '../repositories';
import {credentials} from '../types';

export interface ICustomerSignup {

  signup(id: number, password: string): void;
  authenticateCustomer(cred: credentials): Promise<Customer>;

}

export class CustomerSignup implements ICustomerSignup {

  constructor(
    @repository(CustomerRepository)
    private custRepository: CustomerRepository,
    @inject(BinderKeys.LOGGER)
    private logger: ILogger
  ) { }

  signup(id: number, password: string): void {

    if (password.length < 8) {

      this.logger.info('Password length should be more than 8.');
      throw new Error('Password length invalid');
    }

  }

  async authenticateCustomer(cred: credentials): Promise<Customer> {

    const foundCustomer = await this.custRepository.findOne(
      {
        where: {
          id: cred.id,
        }
      }
    );

    console.log(foundCustomer);
    console.log(typeof (foundCustomer));

    if (!foundCustomer) {
      throw new HttpErrors.NotFound(`Customer with this ${cred.id} Id not found`);
    }

    if (!(foundCustomer.password == cred.password)) {

      throw new HttpErrors.Unauthorized('Password does not match');

    }
    return foundCustomer;
  }

}


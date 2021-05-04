import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {Customer} from '../models/customer.model';
import {CustomerRepository} from '../repositories/customer.repository';
import {credentials} from '../types';

export interface ICustomerLogin {

  authenticateUser(cred: credentials): Promise<Customer>;
}

export class CustomerLogin implements ICustomerLogin {

  constructor(
    @repository(CustomerRepository)
    private custRepository: CustomerRepository,
  ) { }


  async authenticateUser(cred: credentials): Promise<Customer> {

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

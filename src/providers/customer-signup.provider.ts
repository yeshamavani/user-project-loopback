import {Provider, ValueOrPromise} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Customer} from '../models/customer.model';
import {CustomerRepository} from '../repositories/customer.repository';


export class CustomerSignupProvider implements Provider<Customer> {

  addedCustomer: Customer;

  constructor(
    @repository(CustomerRepository)
    public custRepository: CustomerRepository
  ) { }

  value(): ValueOrPromise<Customer> {
    throw new Error('Method not implemented.');
  }

  // async value() {

  //   return await this.doCustomerSignUp(model: Customer);
  //throw new Error('Method not implemented.');
  // }

  // async doCustomerSignUp(model: Customer) {

  //   const cust = await this.custRepository.findById(model.id);

  //   if (!cust) {
  //     throw new Error('Customer Already exists, not allowed to create user with same id');
  //   }

  //   this.addedCustomer = await this.custRepository.create(model);
  //   return this.addedCustomer;

  // }
  // }

}

import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Role,
  Customer,
} from '../models';
import {RoleRepository} from '../repositories';

export class RoleCustomerController {
  constructor(
    @repository(RoleRepository)
    public roleRepository: RoleRepository,
  ) { }

  @get('/roles/{id}/customer', {
    responses: {
      '200': {
        description: 'Customer belonging to Role',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Customer)},
          },
        },
      },
    },
  })
  async getCustomer(
    @param.path.string('id') id: typeof Role.prototype.name,
  ): Promise<Customer> {
    return this.roleRepository.customer(id);
  }
}

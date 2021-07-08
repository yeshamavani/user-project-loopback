import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasOneRepositoryFactory, BelongsToAccessor} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {Role, RoleRelations, User, Customer} from '../models';
import {UserRepository} from './user.repository';
import {CustomerRepository} from './customer.repository';

export class RoleRepository extends DefaultCrudRepository<
  Role,
  typeof Role.prototype.name,
  RoleRelations
> {

  public readonly user: HasOneRepositoryFactory<User, typeof Role.prototype.name>;

  public readonly customer: BelongsToAccessor<Customer, typeof Role.prototype.name>;

  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>, @repository.getter('CustomerRepository') protected customerRepositoryGetter: Getter<CustomerRepository>,
  ) {
    super(Role, dataSource);
    this.customer = this.createBelongsToAccessorFor('customer', customerRepositoryGetter,);
    this.registerInclusionResolver('customer', this.customer.inclusionResolver);
    this.user = this.createHasOneRepositoryFactoryFor('user', userRepositoryGetter);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}

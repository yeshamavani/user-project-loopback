import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Customer} from './customer.model';

@model()
export class User extends Entity {
  @property({
    type: 'number',
    generated: true,
    required: false,
  })
  uid?: number;

  @property({
    type: 'string',
    required: true,
    name: 'firstname'
  })
  firstName: string;

  @property({
    type: 'string',
    name: 'middlename'
  })
  middleName?: string;

  @property({
    type: 'string',
    name: 'lastname'
  })
  lastName?: string;

  @property({
    type: 'string',
    required: true,
    id: true,
    name: 'email'
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  role: string;

  @property({
    type: 'string',
  })
  phone?: string;

  @property({
    type: 'string',
  })
  address?: string;

  @property({
    type: 'date',
    name: 'createdon',
    default: new Date()
  })
  createdOn?: string;

  @property({
    type: 'date',
    name: 'modifiedon',
    default: new Date()
  })
  modifiedOn?: string;

  @property({
    type: 'string',
    name: 'password',
    required: false
  })
  password?: string;

  @belongsTo(() => Customer)
  customerId: number;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;

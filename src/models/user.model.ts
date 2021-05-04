import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Customer} from './customer.model';

@model()
export class User extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: false,
    required: true,
  })
  uid: number;

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
    name: 'createdon'
  })
  createdOn?: string;

  @property({
    type: 'date',
    name: 'modifiedon'
  })
  modifiedOn?: string;

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

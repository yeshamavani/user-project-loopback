import {Entity, model, property, hasOne, belongsTo} from '@loopback/repository';
import {User} from './user.model';
import {Customer} from './customer.model';

@model()
export class Role extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  key: string;

  @property({
    type: 'string',
    required: true,
  })
  description: string;

  @hasOne(() => User, {keyTo: 'role'})
  user: User;

  @belongsTo(() => Customer)
  customerId: number;

  constructor(data?: Partial<Role>) {
    super(data);
  }
}

export interface RoleRelations {
  // describe navigational properties here
}

export type RoleWithRelations = Role & RoleRelations;

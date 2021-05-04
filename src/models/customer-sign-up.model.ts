import {AnyObject, Model, model, property} from '@loopback/repository';

@model()
export class CustomerSignUp<T = AnyObject> extends Model {
  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'object',
    required: true,
  })
  data: T;


  constructor(data?: Partial<CustomerSignUp>) {
    super(data);
  }
}

export interface CustomerSignUpRelations {
  // describe navigational properties here
}

export type CustomerSignUpWithRelations = CustomerSignUp & CustomerSignUpRelations;

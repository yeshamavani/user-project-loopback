import {UserProfile} from '@loopback/security';


export type credentials = {
  id: number,
  password: string,
}

export type userCredentials = {
  email: string,
  password: string
}

export interface MyUserProfile extends UserProfile {

  role: string;
  permissions: string[]

}

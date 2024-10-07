import { SubscriptionType } from '../enum/enum';

export interface findUserRequest {
  email: string;
  password: string;
}

export interface createUser {
  email: string;
  password: string;
  subscriptionType: SubscriptionType;
}

export interface loginRequest {
  email: string;
  password: string;
}

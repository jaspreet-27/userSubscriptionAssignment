import * as Yup from 'yup';
import { SubscriptionType } from '../utils/enum/enum';

// Registration Validation Schema
export const registrationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email format').required('Email is required.'),
  password: Yup.string().min(6, 'Password must be at least 6 characters long').required('Password is required.'),
  subscriptionType: Yup.string().oneOf(Object.values(SubscriptionType), 'Invalid subscription type').required('Subscription type is required.'),
});

// Login Validation Schema
export const loginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email format').required('Email is required.'),
  password: Yup.string().required('Password is required.'),
});

// delete Validation Schema
export const updateSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email format').optional(),
  password: Yup.string().min(6, 'Password must be at least 6 characters long').optional(),
  subscriptionType: Yup.string().oneOf(Object.values(SubscriptionType), 'Invalid subscription type').optional(),
});

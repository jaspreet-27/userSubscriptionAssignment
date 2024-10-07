import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createUser, findUser, getUsersWithValidSubscriptions, loginUser, updateUser, deletedUser } from '../services/userService';
import { createSubscription } from './taskController';
import { SuccessMessages, ErrorMessages, StatusCode } from '../utils/message/message';
import { loginRequest } from '../utils/interface/interface';
import { registrationSchema, loginSchema, updateSchema } from '../validations/validation';
import logger from '../utils/logger/logger';

import dotenv from 'dotenv';
dotenv.config();

/**
 * @description Handles user registration
 * @param req - The request object containing user details
 * @param res - The response object used to send responses
 * @returns A response containing the created user or an error message
 * @developedBy jaspreet
 */
async function register(req: any, res: any) {
  try {
    await registrationSchema.validate(req.body, { abortEarly: false });
    const { email } = req.body;
    // Check if the email is missing or empty
    if (!email) {
      return res.status(StatusCode.badRequest).json({ message: ErrorMessages.notExist('Email') });
    }

    // Check if a user with the same email already exists
    let existingUser: Promise<any> | null;
    try {
      existingUser = await findUser(email);
    } catch (error) {
      logger.error('Error checking existing user', error);
      return res.status(StatusCode.internalServerError).json({ message: ErrorMessages.somethingWentWrong });
    }
    if (existingUser) {
      logger.info('Attempt to register an already existing user', { email });
      return res.status(StatusCode.badRequest).json({ message: ErrorMessages.alreadyExists('User with the same email') });
    }

    // Create a new user
    let newUser: any;
    try {
      newUser = await createUser(req.body);
    } catch (error) {
      logger.error('Error creating user', error);
      return res.status(StatusCode.internalServerError).json({ message: ErrorMessages.somethingWentWrong });
    }

    // Once user is created, create a subscription for the user
    try {
      const subscription = await createSubscription(newUser._id, newUser.subscriptionType);
    } catch (error) {
      logger.error('Error creating subscription', error);
      return res.status(StatusCode.internalServerError).json({ message: ErrorMessages.somethingWentWrong });
    }
    logger.info('User created successfully', { userId: newUser._id });
    return res.status(StatusCode.created).json({
      message: SuccessMessages.create('User'),
      data: newUser,
    });
  } catch (error) {
    // Handle Yup validation errors
    if (error) {
      return res.status(StatusCode.badRequest).json({
        message: 'Validation errors occurred',
        errors: error, // Send the validation error messages
      });
    }

    logger.error('Unexpected error during registration', error); // Logging unexpected errors
    return res.status(StatusCode.internalServerError).json({ message: ErrorMessages.somethingWentWrong });
  }
}

/**
 * @description Handles user login
 * @param req - The request object containing login credentials
 * @param res - The response object used to send responses
 * @returns A response containing a JWT token and a success message or an error message
 */

async function login(req: any, res: any) {
  try {
    await loginSchema.validate(req.body, { abortEarly: false });

    const { email, password }: loginRequest = req.body;

    // Check if the email or password is missing
    if (!email || !password) {
      return res.status(StatusCode.badRequest).json({ message: ErrorMessages.notExist('Email or password') });
    }
    const user = await loginUser(req.body);
    if (!user) {
      logger.info('Invalid login attempt', { email });
      return res.status(StatusCode.notFound).json({ message: ErrorMessages.invalidLogin });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      // Logging incorrect password attempt
      logger.info('Incorrect password attempt', { email });
      return res.status(StatusCode.failed).json({ message: ErrorMessages.wrongPassowrd });
    }

    const token = jwt.sign({ userId: user._id }, process.env.TOKEN_KEY as string);
    // Logging successful login
    logger.info('User logged in successfully', { userId: user._id });
    return res.json({ token, message: SuccessMessages.login });
  } catch (error) {
    // // Handle Yup validation errors
    if (error) {
      return res.status(StatusCode.badRequest).json({
        message: 'Validation errors occurred',
        // Send the validation error messages
        errors: error,
      });
    }
    logger.error('Unexpected error during login', error);
    return res.status(StatusCode.internalServerError).json({ message: ErrorMessages.somethingWentWrong });
  }
}

/**
 * @description Fetch users with valid subscriptions
 * @param req - The request object containing query parameters
 * @param res - The response object used to send responses
 * @returns A response containing the list of users with valid subscriptions or an error message
 */

async function fetchUsersWithValidSubscriptions(req: any, res: any) {
  try {
    const result = await getUsersWithValidSubscriptions(req.query);
    return res.status(StatusCode.success).json({ message: SuccessMessages.fetchedAllCodes, result });
  } catch (error) {
    // Logging the error
    logger.error('Error fetching users with valid subscriptions', error);
    return res.status(StatusCode.internalServerError).json({ message: ErrorMessages.somethingWentWrong });
  }
}

/**
 * @description Update user details
 * @param req - The request object containing user ID and new user data
 * @param res - The response object used to send responses
 * @returns A response containing the updated user data or an error message
 */

async function update(req: any, res: any) {
  try {
    const { id } = req.params;
    const userData = req.body;

    await updateSchema.validate(req.body, { abortEarly: false });

    // Call the service to update the user
    const updatedUsers = await updateUser(id, userData);

    if (!updatedUsers) {
      return res.status(StatusCode.notFound).json({ message: ErrorMessages.notExist('User') });
    }

    // Logging successful update
    logger.info('User updated successfully', { userId: id });
    return res.status(StatusCode.success).json({
      message: SuccessMessages.upadate,
      data: updatedUsers,
    });
  } catch (error) {
    // Handle Yup validation errors
    if (error) {
      return res.status(StatusCode.badRequest).json({
        message: 'Validation errors occurred',
        // Send the validation error messages
        errors: error,
      });
    }

    // Logging unexpected errors
    logger.error('Error updating user', error);
    return res.status(StatusCode.internalServerError).json({ message: ErrorMessages.somethingWentWrong });
  }
}

/**
 * @description Delete a user by ID
 * @param req - The request object containing user ID
 * @param res - The response object used to send responses
 * @returns A response indicating the result of the deletion or an error message
 */

async function deleteUser(req: any, res: any) {
  try {
    // Get the user ID from the URL
    const { id } = req.params;

    // Call the service to delete the user
    const result = await deletedUser(id);
    if (!result) {
      return res.status(StatusCode.notFound).json({ message: ErrorMessages.notExist('User') });
    }

    // Logging successful deletion
    logger.info('User deleted successfully', { userId: id });
    return res.status(StatusCode.success).json({
      message: SuccessMessages.delete,
    });
  } catch (error) {
    // Logging unexpected errors
    logger.error('Error deleting user', error);
    return res.status(StatusCode.internalServerError).json({ message: ErrorMessages.somethingWentWrong });
  }
}

export { register, login, fetchUsersWithValidSubscriptions, update, deleteUser };

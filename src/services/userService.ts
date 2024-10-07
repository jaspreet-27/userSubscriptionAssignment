import User from '../models/userModel';
import bcrypt from 'bcrypt';
import Task from '../models/taskModel';
import { createUser, findUserRequest } from '../utils/interface/interface';

/**
 * @description Finds a user by their email address.
 * @param userData - The login request object containing user credentials.
 * @returns The user object if found, otherwise null.
 */

export async function findUser(userData: findUserRequest): Promise<any> {
  try {
    // Find the user by email
    const user = await User.findOne({ email: userData });
    // Return the user    const user = await User.findOne({if found, else return null
    if (user === null) {
      return null;
    } else {
      return user;
    }
  } catch (error) {
    console.error('Error finding user:', error);
    throw new Error('Error fetching user from database'); // Provide a more descriptive error
  }
}

/**
 * @description Creates a new user and hashes their password.
 * @param userData - An object containing user details including password.
 * @returns The newly created user object.
 */

export async function createUser(userData: createUser) {
  try {
    const { password } = userData;
    const saltRounds: number = 10;

    // Hash the password
    const hashedPassword: string = await bcrypt.hash(password, saltRounds);

    // Store the hashed password back in userData
    userData.password = hashedPassword;

    // Create a new user in the database
    const newUser: any = await User.create(userData);

    // Return the newly created user
    return newUser;
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Error creating user');
  }
}

/**
 * @description Logs in a user by their email address.
 * @param userData - An object containing user credentials (email).
 * @returns The user object if found.
 */

export async function loginUser(userData: any) {
  const { email } = userData;
  return await User.findOne({ email: email });
}

/**
 * @description Fetches users with valid subscriptions.
 * @param query - An object containing pagination parameters.
 * @returns An object containing valid subscriptions and pagination details.
 */

export async function getUsersWithValidSubscriptions(query: any) {
  const currentDate = new Date();

  // Get pagination parameters
  const page = parseInt(query.page as string) || 1;
  const limit = parseInt(query.limit as string) || 10;
  const skip = (page - 1) * limit;

  // Fetch total number of valid subscriptions
  const totalSubscriptions = await Task.countDocuments({
    nextExecution: { $gt: currentDate },
  });

  // Fetch valid subscriptions with pagination
  const validSubscriptions = await Task.find({
    nextExecution: { $gt: currentDate },
  })
    .populate('userId')
    .skip(skip)
    .limit(limit);

  // Calculate total pages
  const totalPages = Math.ceil(totalSubscriptions / limit);

  return {
    data: validSubscriptions,
    pagination: {
      totalItems: totalSubscriptions,
      totalPages,
      currentPage: page,
      limit,
    },
  };
}
export async function updateUser(userId: string, userData: any) {
  try {
    // Update the user in the database
    const updatedUsers = await User.findByIdAndUpdate(userId, userData, { new: true, runValidators: true });

    // If the user is not found, return null
    if (!updatedUsers) {
      return null; // Indicate that the user was not found
    }
    return updatedUsers; // Return the updated user
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error('Error updating user');
  }
}

export async function deletedUser(userId: string) {
  try {
    // Delete the user from the database
    const result = await User.findByIdAndDelete(userId);

    return result; // If the user is found and deleted, it returns the deleted document
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new Error('Error deleting user');
  }
}

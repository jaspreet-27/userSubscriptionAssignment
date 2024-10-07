import Task from '../models/taskModel';
import { Request, Response } from 'express';
import moment from 'moment';

async function renewSubscription() {
  const now = new Date();
  // Find subscriptions that are due for renewal
  const dueSubscriptions = await Task.find({ nextExecution: { $lte: now }, isActive: true });

  for (const sub of dueSubscriptions) {
    // Calculate the new start date and next execution date
    const newStartDate = new Date();
    let newNextExecution: Date;

    switch (sub.subscriptionType) {
      case 'daily':
        newNextExecution = moment(newStartDate).add(1, 'day').toDate();
        break;
      case 'weekly':
        newNextExecution = moment(newStartDate).add(1, 'week').toDate();
        break;
      case 'monthly':
        newNextExecution = moment(newStartDate).add(1, 'month').toDate();
        break;
      case 'yearly':
        newNextExecution = moment(newStartDate).add(1, 'year').toDate();
        break;
      case '5mins': // New case for 5 minutes
        newNextExecution = moment(newStartDate).add(5, 'minutes').toDate();
        break;
      default:
        // Skip if the subscription type is invalid
        continue; 
    }

    // Create a new subscription entry
    const newSubscription = new Task({
      userId: sub.userId,
      subscriptionType: sub.subscriptionType,
      startDate: newStartDate,
      nextExecution: newNextExecution,
      isActive: true, // or based on your business logic
    });

    // Update the existing subscription entry
    // sub.startDate = newStartDate;
    // sub.nextExecution = newNextExecution;

    await newSubscription.save();
    //   Save the updated subscription
    //   await sub.save();

    // Optionally, you might want to update the original subscription to deactivate it
    // sub.isActive = false;
    // await sub.save();
  }
}

// Create a new subscription
async function createSubscription(userId: string, subscriptionType: string) {
  const startDate = new Date();
  let nextExecution: Date | null = null;

  switch (subscriptionType) {
    case 'daily':
      nextExecution = moment(startDate).add(1, 'day').toDate();
      break;
    case 'weekly':
      nextExecution = moment(startDate).add(1, 'week').toDate();
      break;
    case 'monthly':
      nextExecution = moment(startDate).add(1, 'month').toDate();
      break;
    case 'yearly':
      nextExecution = moment(startDate).add(1, 'year').toDate();
      break;
    case '5mins': // New case for 5 minutes
      nextExecution = moment(startDate).add(5, 'minutes').toDate();
      break;
    default:
      throw new Error('Invalid subscription type');
  }

  const subscription = new Task({
    userId,
    subscriptionType,
    startDate,
    nextExecution,
  });

  await subscription.save();
  return subscription;
}

// Logic to check for due subscriptions
export const checkSubscriptions = async () => {
  const now = new Date();
  const dueSubscriptions = await Task.find({ nextExecution: { $lte: now } }).lean(true);

  dueSubscriptions.forEach(async (sub: any) => {
    let nextExecution: Date | null = null;

    switch (sub.subscriptionType) {
      case 'daily':
        nextExecution = moment(sub.nextExecution).add(1, 'day').toDate();
        break;
      case 'weekly':
        nextExecution = moment(sub.nextExecution).add(1, 'week').toDate();
        break;
      case 'monthly':
        nextExecution = moment(sub.nextExecution).add(1, 'month').toDate();
        break;
      case 'yearly':
        nextExecution = moment(sub.nextExecution).add(1, 'year').toDate();
        break;
      case '5mins': // New case for 5 minutes
        nextExecution = moment(sub.nextExecution).add(5, 'minutes').toDate();
        break;
      default:
        return; // Skip if the subscription type is invalid
    }

    sub.nextExecution = nextExecution;
    await sub.save();
  });
};

export { createSubscription, renewSubscription };

// // taskController.ts
// import { Request, Response } from 'express';
// import { createSubscription, renewSubscription, checkSubscriptions } from '../services/taskService';
// import logger from '../utils/logger/logger';

// /**
//  * @description Creates a new subscription for a user.
//  * @param req - Express request object containing user and subscription type.
//  * @param res - Express response object.
//  */
// export async function handleCreateSubscription(req: Request, res: Response) {
//   try {
//     const { userId, subscriptionType } = req.body;
//     const subscription = await createSubscription(userId, subscriptionType);
//     logger.info(`Subscription created for user: ${userId} with type: ${subscriptionType}`);
//     return res.status(201).json(subscription);
//   } catch (error) {
//     logger.error('Error creating subscription:', error);
//     return res.status(400).json({ message: 'Error creating subscription' });
//   }
// }

// /**
//  * @description Renews subscriptions that are due for renewal.
//  * @param req - Express request object.
//  * @param res - Express response object.
//  */
// export async function handleRenewSubscriptions(req: Request, res: Response) {
//   try {
//     await renewSubscription(); // Call the service to renew subscriptions
//     logger.info('Subscriptions renewed successfully');
//     return res.status(200).json({ message: 'Subscriptions renewed successfully' });
//   } catch (error) {
//     logger.error('Error renewing subscriptions:', error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// }

// /**
//  * @description Checks for subscriptions that are due and updates their next execution date.
//  * @param req - Express request object.
//  * @param res - Express response object.
//  */
// export async function handleCheckSubscriptions(req: Request, res: Response) {
//   try {
//     await checkSubscriptions();
//     logger.info('Checked subscriptions successfully');
//     return res.status(200).json({ message: 'Checked subscriptions successfully' });
//   } catch (error) {
//     logger.error('Error checking subscriptions:', error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// }

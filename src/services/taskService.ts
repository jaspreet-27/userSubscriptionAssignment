// // taskService.ts
// import Task from '../models/taskModel';
// import moment from 'moment';
// import logger from '../utils/logger/logger';

// /**
//  * @description Renews subscriptions that are due for renewal.
//  */
// export async function renewSubscription() {
//   const now = new Date();
//   // Find subscriptions that are due for renewal
//   const dueSubscriptions = await Task.find({ nextExecution: { $lte: now }, isActive: true });

//   for (const sub of dueSubscriptions) {
//     // Calculate the new start date and next execution date
//     const newStartDate = new Date();
//     let newNextExecution: Date;

//     switch (sub.subscriptionType) {
//       case 'daily':
//         newNextExecution = moment(newStartDate).add(1, 'day').toDate();
//         break;
//       case 'weekly':
//         newNextExecution = moment(newStartDate).add(1, 'week').toDate();
//         break;
//       case 'monthly':
//         newNextExecution = moment(newStartDate).add(1, 'month').toDate();
//         break;
//       case 'yearly':
//         newNextExecution = moment(newStartDate).add(1, 'year').toDate();
//         break;
//       case '5mins': // New case for 5 minutes
//         newNextExecution = moment(newStartDate).add(5, 'minutes').toDate();
//         break;
//       default:
//         // logger.warn(`Invalid subscription type: ${sub.subscriptionType}`);
//         continue; // Skip if the subscription type is invalid
//     }

//     // Create a new subscription entry
//     const newSubscription = new Task({
//       userId: sub.userId,
//       subscriptionType: sub.subscriptionType,
//       startDate: newStartDate,
//       nextExecution: newNextExecution,
//       isActive: true,
//     });

//     await newSubscription.save(); // Save the new subscription
//     logger.info(`New subscription created for user: ${sub.userId}`);
//   }
// }

// /**
//  * @description Creates a new subscription.
//  * @param userId - ID of the user.
//  * @param subscriptionType - Type of the subscription.
//  * @returns The created subscription object.
//  */
// export async function createSubscription(userId: string, subscriptionType: string) {
//   const startDate = new Date();
//   let nextExecution: Date | null = null;

//   switch (subscriptionType) {
//     case 'daily':
//       nextExecution = moment(startDate).add(1, 'day').toDate();
//       break;
//     case 'weekly':
//       nextExecution = moment(startDate).add(1, 'week').toDate();
//       break;
//     case 'monthly':
//       nextExecution = moment(startDate).add(1, 'month').toDate();
//       break;
//     case 'yearly':
//       nextExecution = moment(startDate).add(1, 'year').toDate();
//       break;
//     case '5mins':
//       nextExecution = moment(startDate).add(5, 'minutes').toDate();
//       break;
//     default:
//       logger.error('Invalid subscription type');
//       throw new Error('Invalid subscription type');
//   }

//   const subscription = new Task({
//     userId,
//     subscriptionType,
//     startDate,
//     nextExecution,
//   });

//   await subscription.save(); // Save the new subscription
//   logger.info(`Subscription created for user: ${userId} with type: ${subscriptionType}`);
//   return subscription; // Return the created subscription
// }

// /**
//  * @description Checks for subscriptions that are due and updates their next execution date.
//  */
// export const checkSubscriptions = async () => {
//   const now = new Date();
//   const dueSubscriptions = await Task.find({ nextExecution: { $lte: now } }).lean(true);

//   dueSubscriptions.forEach(async (sub: any) => {
//     let nextExecution: Date | null = null;

//     switch (sub.subscriptionType) {
//       case 'daily':
//         nextExecution = moment(sub.nextExecution).add(1, 'day').toDate();
//         break;
//       case 'weekly':
//         nextExecution = moment(sub.nextExecution).add(1, 'week').toDate();
//         break;
//       case 'monthly':
//         nextExecution = moment(sub.nextExecution).add(1, 'month').toDate();
//         break;
//       case 'yearly':
//         nextExecution = moment(sub.nextExecution).add(1, 'year').toDate();
//         break;
//       case '5mins':
//         nextExecution = moment(sub.nextExecution).add(5, 'minutes').toDate();
//         break;
//       default:
//         // logger.warn(`Invalid subscription type for subscription ID: ${sub._id}`);
//         return; // Skip if the subscription type is invalid
//     }

//     sub.nextExecution = nextExecution; // Update the next execution date
//     await sub.save(); // Save the updated subscription
//     logger.info(`Updated next execution for subscription ID: ${sub._id}`);
//   });
// };

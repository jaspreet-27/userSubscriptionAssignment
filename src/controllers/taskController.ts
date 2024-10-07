import Task from '../models/taskModel';
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
      isActive: true,
    });

    //   Save the updated subscription
    await newSubscription.save();
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

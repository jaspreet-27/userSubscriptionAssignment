import { createSubscription, renewSubscription } from '../controllers/taskController';
import { auth } from '../utils/auth/auth';

const userRoute = (app: any) => {
  // Public route for user subscription
  app.post('/subscription', auth, createSubscription);

  // Public route for user renewSubscription
  app.post('/renew', auth, renewSubscription);
};
export default userRoute;

import express from 'express';
import connectToMongoDB from './config/index';
import routes from './routes/userRoute';
import dotenv from 'dotenv';
dotenv.config();
import userRoute from './routes/userRoute';
import taskRoute from './routes/taskRoute';
import { renewSubscription } from './controllers/taskController';
// import userRoute from './routes/userRoute';

dotenv.config();

const app = express();
app.use(express.json());

userRoute(app);

app.use('/api/auth', userRoute);
// app.use('/api/subscriptions', taskRoute);

let PORT = process.env.PORT;
connectToMongoDB();

// Custom function to renew subscriptions every 2 minutes
const renewSubscriptionsPeriodically = () => {
  setInterval(
    async () => {
      console.warn('Checking for subscriptions to renew...');
      try {
        await renewSubscription();
        console.warn('Renewal check completed successfully.');
      } catch (err) {
        console.warn('Error during renewal:', err);
      }
    },
    2 * 60 * 1000,
  ); // 2 minutes in milliseconds
};
// Start the subscription renewal process
renewSubscriptionsPeriodically();

// Test the renewal function immediately (for debugging)
renewSubscription()
  .then(() => {
    console.warn('Renewal function called successfully for testing.');
  })
  .catch((err) => {
    console.warn('Error calling renewal function for testing:', err);
  });

app.listen(PORT, () => {
  console.warn(`Server is up and running on http://localhost:${PORT}`);
});

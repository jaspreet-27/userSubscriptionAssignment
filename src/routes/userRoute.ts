import { register, login, fetchUsersWithValidSubscriptions, update, deleteUser } from '../controllers/userController';
import { auth } from '../utils/auth/auth';

const userRoute = (app: any) => {
  // Public route for user registration
  app.post('/register', register);

  // Public route for user login
  app.post('/login', login);

  // Private route for user update
  app.put('/:id', auth, update);

  // Public route for login registration
  app.delete('/:id', auth, deleteUser);

  // Public route for get all user detals
  app.get('/getUsersWithValidSubscriptions', fetchUsersWithValidSubscriptions);
};
export default userRoute;

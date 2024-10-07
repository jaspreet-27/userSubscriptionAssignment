import mongoose from 'mongoose';
import timestamp from '../utils/timstamp';
import { v4 as uuidv4 } from 'uuid';
import { SubscriptionType } from '../utils/enum/enum';

// Define the user schema
const UserSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: { type: String, required: true },
  subscriptionType: {
    type: String,
    enum: Object.values(SubscriptionType),
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  timestamp,
});

// Create the user model
const User = mongoose.model('User', UserSchema);

export default User;

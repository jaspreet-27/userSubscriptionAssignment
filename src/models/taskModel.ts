import moment from 'moment';
import { Schema, model, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const taskSchema = new Schema({
  id: {
    type: String,
    default: uuidv4,
    unique: true,
    required: true,
  },
  userId: { type: String, required: true },
  subscriptionType: { type: String, required: true },
  startDate: { type: Number, default: moment(), required: true },
  nextExecution: { type: Number, default: moment(), required: true },
  isActive: { type: Boolean, default: true },
});

const Task = model('Task', taskSchema);
export default Task;

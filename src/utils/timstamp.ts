import moment from 'moment';

const timestamp = {
  createdAt: {
    type: Number,
    default: moment(),
  },

  updatedAt: {
    type: Number,
    default: moment(),
  },
};

export default timestamp;

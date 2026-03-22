import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['match_found', 'application_update', 'system_alert'],
    default: 'system_alert',
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId, // Could be a Job ID or Application ID
  }
}, {
  timestamps: true,
});

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
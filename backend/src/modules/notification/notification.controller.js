import Notification from './notification.model.js';

export const getMyNotifications = async (req, res, next) => {
  try {
    // Fetch the latest 20 notifications for the logged-in user
    const notifications = await Notification.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({
      status: 'success',
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.status(200).json({
      status: 'success',
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from "../../../utils/api";

export const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);

  // This query will automatically ping the server every 30 seconds
  const { data: notifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data } = await api.get('/notifications'); // Assumes you have a GET route for user notifications
      return data.data;
    },
    refetchInterval: 30000, // 👈 Polling interval: 30 seconds
    refetchIntervalInBackground: false, // Don't poll if they switch browser tabs
  });

  const unreadCount = notifications?.filter((n: any) => !n.isRead).length || 0;

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
      >
        {/* Bell Icon */}
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
        </svg>

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
          <div className="px-4 py-2 border-b border-gray-100 font-bold text-gray-700">
            Notifications
          </div>
          <div className="max-h-64 overflow-y-auto">
            {notifications?.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">No new notifications</div>
            ) : (
              notifications?.map((notif: any) => (
                <div key={notif._id} className={`px-4 py-3 border-b border-gray-50 ${!notif.isRead ? 'bg-blue-50' : ''}`}>
                  <p className="text-sm text-gray-800">{notif.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(notif.createdAt).toLocaleDateString()}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
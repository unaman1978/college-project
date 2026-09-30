import React, { useState } from 'react';
import { AppNotification, UserProfile } from '../types';

interface HeaderProps {
  currentUser?: UserProfile;
  notifications: AppNotification[];
  onOpenNotifications: () => void;
  onScrollToSmartAdd: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  notifications,
  onOpenNotifications,
  onScrollToSmartAdd,
  onLogout,
}) => {
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const userName = currentUser?.name || 'Rahul Sharma';
  const userAvatar =
    currentUser?.avatarUrl ||
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDhwU9iLEZRWiao1RJbIf3ZVrTGkUBH0UXF1qrNLX6MIlC8tzzXMOrKOSdk3hNuEhEybhRUAyzR1T2ppZBuRlvX8vEOAI7TMKcLHz9rtf6y6Ps1YR9ZnMd-MxV4mXk-0i-l4KoWcIT96sqbLC3W0tPRK9Qzu1To__IwRp7w8a6SqHatn1Mhl2UJfOH2DMhtO4lHijOWa3xIZOBSirX7b92BchYhmRX4kTGeQyHmm3yy_MSsLPLBvLFY';

  return (
    <header className="bg-surface-container-lowest shadow-xs sticky top-0 z-40 border-b border-surface-container-high/60">
      <div className="flex justify-between items-center w-full px-4 h-16 max-w-7xl mx-auto">
        {/* Leading: Avatar + User Greeting */}
        <div className="flex items-center space-x-3 relative">
          <div
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="relative cursor-pointer active:scale-95 transition-transform duration-150"
            title="Click for account profile menu"
          >
            <img
              alt={userName}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-surface-container-high shadow-xs"
              src={userAvatar}
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-primary-container border-2 border-surface-container-lowest rounded-full" />
          </div>
          <div>
            <div className="flex items-center space-x-1">
              <span className="text-label-md text-on-surface-variant font-medium">
                Hi, {userName}
              </span>
              <span
                className="material-symbols-outlined text-[15px] text-primary"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified
              </span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xl font-bold text-primary tracking-tight">SpendWise</span>
            </div>
          </div>

          {/* User Profile Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute left-0 top-14 w-64 bg-surface-container-lowest rounded-2xl shadow-xl border border-surface-container-high p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center space-x-3 pb-3 border-b border-surface-container">
                <img
                  src={userAvatar}
                  alt={userName}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20"
                />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-on-surface truncate">{userName}</div>
                  <div className="text-[11px] text-on-surface-variant truncate">
                    {currentUser?.email || 'rahul.sharma@example.com'}
                  </div>
                </div>
              </div>

              <div className="py-2 space-y-1 text-xs text-on-surface">
                <div className="px-2 py-1.5 rounded-lg bg-surface-container-low text-[11px] text-on-surface-variant flex items-center justify-between">
                  <span>Currency</span>
                  <span className="font-bold text-primary">INR (₹)</span>
                </div>
                <div className="px-2 py-1.5 rounded-lg bg-surface-container-low text-[11px] text-on-surface-variant flex items-center justify-between">
                  <span>Sync Status</span>
                  <span className="font-bold text-emerald-600">Active</span>
                </div>
              </div>

              <div className="pt-2 border-t border-surface-container">
                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    if (onLogout) onLogout();
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-error-container/30 hover:bg-error-container/60 text-error text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">logout</span>
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Trailing: Notifications & Add Expense Button */}
        <div className="flex items-center space-x-2 relative">
          <button
            aria-label="Notifications"
            className="relative p-2 rounded-full hover:bg-surface-container-low text-on-surface-variant hover:text-on-surface active:scale-95 transition-transform duration-150 cursor-pointer"
            onClick={() => setShowNotifMenu(!showNotifMenu)}
          >
            <span className="material-symbols-outlined text-[24px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-error rounded-full ring-2 ring-surface-container-lowest animate-pulse" />
            )}
          </button>

          <button
            className="hidden sm:flex items-center space-x-1 bg-primary text-on-primary px-3 py-1.5 rounded-lg text-sm font-semibold active:scale-95 transition-all shadow-xs hover:bg-primary-container cursor-pointer"
            onClick={onScrollToSmartAdd}
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Add Expense</span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifMenu && (
            <div className="absolute right-0 top-12 w-80 sm:w-96 bg-surface-container-lowest rounded-2xl shadow-xl border border-surface-container-high p-4 z-50">
              <div className="flex items-center justify-between pb-3 border-b border-surface-container">
                <div className="flex items-center space-x-2">
                  <h4 className="font-bold text-on-surface">Notifications</h4>
                  {unreadCount > 0 && (
                    <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-semibold">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <button
                  className="text-xs text-primary hover:underline cursor-pointer"
                  onClick={onOpenNotifications}
                >
                  View all
                </button>
              </div>

              <div className="divide-y divide-surface-container-low max-h-72 overflow-y-auto">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`py-3 flex items-start space-x-3 hover:bg-surface-container-low/60 rounded-xl px-2 transition-colors ${
                      !item.read ? 'bg-surface-container-low/40' : ''
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        item.type === 'warning'
                          ? 'bg-amber-100 text-amber-700'
                          : item.type === 'success'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-blue-100 text-primary'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {item.type === 'warning'
                          ? 'warning'
                          : item.type === 'success'
                          ? 'check_circle'
                          : 'info'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-on-surface truncate">{item.title}</span>
                        <span className="text-[10px] text-on-surface-variant">{item.timestamp}</span>
                      </div>
                      <p className="text-xs text-on-surface-variant mt-0.5 line-clamp-2">{item.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};


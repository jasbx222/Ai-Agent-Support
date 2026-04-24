import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, Clock, Filter, MoreHorizontal, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications, Notification } from '../../Hooks/useNotifications';
import { router } from '@inertiajs/react';

export function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getPriorityColor = (priority: string) => {
        switch (priority?.toLowerCase()) {
            case 'high': return 'text-red-400 bg-red-400/10';
            case 'medium': return 'text-orange-400 bg-orange-400/10';
            case 'low': return 'text-green-400 bg-green-400/10';
            default: return 'text-blue-400 bg-blue-400/10';
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-gray-400 transition-all hover:bg-white/10 hover:text-white"
            >
                <Bell className={`h-5 w-5 ${unreadCount > 0 ? 'animate-bounce' : ''}`} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white shadow-lg shadow-blue-500/30">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-4 w-96 overflow-hidden rounded-2xl border border-white/10 bg-[#161c27] shadow-2xl z-[1000]"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-bottom border-white/5 bg-white/5 p-4">
                            <div>
                                <h3 className="font-bold text-white">Notifications</h3>
                                <p className="text-xs text-gray-400">You have {unreadCount} unread alerts</p>
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    onClick={markAllAsRead}
                                    title="Mark all as read"
                                    className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/5 text-gray-400 hover:text-white"
                                >
                                    <Check className="h-4 w-4" />
                                </button>
                                <button className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/5 text-gray-400 hover:text-white">
                                    <Settings className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {/* List */}
                        <div className="max-h-[400px] overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 px-8 text-center">
                                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5 text-gray-600">
                                        <Bell className="h-8 w-8" />
                                    </div>
                                    <h4 className="font-medium text-gray-400">No notifications yet</h4>
                                    <p className="mt-1 text-xs text-gray-500">We'll notify you when new tickets arrive.</p>
                                </div>
                            ) : (
                                notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        onClick={() => {
                                            markAsRead(notification.id);
                                            router.visit(`/tickets-dashboard`);
                                            setIsOpen(false);
                                        }}
                                        className={`group relative flex cursor-pointer gap-4 p-4 transition-colors hover:bg-white/5 ${!notification.read_at ? 'bg-blue-500/5' : ''}`}
                                    >
                                        {!notification.read_at && (
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
                                        )}
                                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold ${getPriorityColor(notification.data.priority)}`}>
                                            {notification.data.user_name.charAt(0)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <span className={`text-[10px] font-bold uppercase tracking-wider ${getPriorityColor(notification.data.priority)}`}>
                                                    {notification.data.priority}
                                                </span>
                                                <span className="flex items-center gap-1 text-[10px] text-gray-500">
                                                    <Clock className="h-3 w-3" />
                                                    {new Date(notification.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <h4 className="mt-0.5 text-sm font-semibold text-white line-clamp-1">{notification.data.subject}</h4>
                                            <p className="mt-1 text-xs text-gray-400 line-clamp-1">{notification.data.message}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        <button className="w-full border-t border-white/5 bg-white/5 p-3 text-center text-xs font-bold text-blue-400 transition-colors hover:bg-white/10 hover:text-blue-300">
                            View All Notifications
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, AlertCircle } from 'lucide-react';
import { NotificationData } from '../../Hooks/useNotifications';
import { router } from '@inertiajs/react';

interface Props {
    notification: NotificationData | null;
    onClose: () => void;
}

export function NotificationToast({ notification, onClose }: Props) {
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                onClose();
            }, 6000);
            return () => clearTimeout(timer);
        }
    }, [notification, onClose]);

    const getPriorityColor = (priority: string) => {
        switch (priority?.toLowerCase()) {
            case 'high': return 'bg-red-500 shadow-red-500/20 text-red-100';
            case 'medium': return 'bg-orange-500 shadow-orange-500/20 text-orange-100';
            case 'low': return 'bg-green-500 shadow-green-500/20 text-green-100';
            default: return 'bg-blue-500 shadow-blue-500/20 text-blue-100';
        }
    };

    const getPriorityGlow = (priority: string) => {
        switch (priority?.toLowerCase()) {
            case 'high': return 'shadow-[0_0_20px_rgba(239,68,68,0.4)] border-red-500/50';
            case 'medium': return 'shadow-[0_0_20px_rgba(249,115,22,0.4)] border-orange-500/50';
            case 'low': return 'shadow-[0_0_20px_rgba(34,197,94,0.4)] border-green-500/50';
            default: return 'shadow-[0_0_20px_rgba(59,130,246,0.4)] border-blue-500/50';
        }
    };

    if (!notification) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -20, x: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                onClick={() => {
                    router.visit(`/tickets-dashboard`); // Redirect to tickets
                    onClose();
                }}
                className={`fixed top-6 right-6 z-[9999] w-96 cursor-pointer overflow-hidden rounded-2xl border bg-[#1a2234]/95 backdrop-blur-xl p-4 ${getPriorityGlow(notification.priority)}`}
            >
                <div className="flex gap-4">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${getPriorityColor(notification.priority)}`}>
                        <Bell className="h-6 w-6" />
                        {notification.priority?.toLowerCase() === 'high' && (
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                className="absolute -top-1 -right-1"
                            >
                                <AlertCircle className="h-4 w-4 text-white fill-red-600" />
                            </motion.div>
                        )}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                New Ticket #{notification.id}
                            </span>
                            <button 
                                onClick={(e) => { e.stopPropagation(); onClose(); }}
                                className="rounded-lg p-1 text-gray-500 hover:bg-white/5 hover:text-white"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        <h4 className="mt-1 font-bold text-white line-clamp-1">{notification.subject}</h4>
                        <p className="mt-1 text-sm text-gray-400 line-clamp-2">{notification.message}</p>
                        
                        <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="h-6 w-6 rounded-full bg-blue-600/20 flex items-center justify-center text-[10px] font-bold text-blue-400">
                                    {notification.user_name.charAt(0)}
                                </div>
                                <span className="text-xs text-gray-500">{notification.user_name}</span>
                            </div>
                            <span className="text-[10px] text-gray-600 font-medium">Just now</span>
                        </div>
                    </div>
                </div>
                
                {/* Progress bar */}
                <motion.div 
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: 6, ease: "linear" }}
                    className={`absolute bottom-0 left-0 h-1 ${getPriorityColor(notification.priority)} opacity-50`}
                />
            </motion.div>
        </AnimatePresence>
    );
}

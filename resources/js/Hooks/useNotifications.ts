import { useState, useEffect, useCallback } from 'react';
import { usePage, router } from '@inertiajs/react';

export interface NotificationData {
    id: string;
    ticket_id: number;
    subject: string;
    message: string;
    priority: string;
    status: string;
    user_name: string;
    created_at: string;
}

export interface Notification {
    id: string;
    data: NotificationData;
    read_at: string | null;
    created_at: string;
}

export function useNotifications() {
    const { auth } = usePage().props as any;
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [lastToast, setLastToast] = useState<NotificationData | null>(null);

    const fetchNotifications = useCallback(async () => {
        try {
            const response = await fetch('/notifications');
            const data = await response.json();
            setNotifications(data.data);
            setUnreadCount(data.total - data.data.filter((n: Notification) => n.read_at).length);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    }, []);

    const markAsRead = async (id: string) => {
        try {
            await fetch(`/notifications/${id}/read`, { method: 'POST' });
            setNotifications(prev => 
                prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await fetch('/notifications/read-all', { method: 'POST' });
            setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date().toISOString() })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    const playSound = useCallback(() => {
        const audio = new Audio('/sounds/notification.mp3');
        audio.play().catch(e => console.error('Audio play failed:', e));
    }, []);

    useEffect(() => {
        fetchNotifications();

        if (window.Echo) {
            const channel = window.Echo.private('admin.notifications');
            
            channel.listen('TicketCreated', (event: NotificationData) => {
                // Smart Logic: Don't show toast if viewing the same ticket
                const isViewingTicket = window.location.pathname.includes(`/tickets-dashboard/${event.ticket_id}`);
                
                if (!isViewingTicket) {
                    setLastToast(event);
                    playSound();
                }

                // If tab is inactive, we could do something more here (like title flash)
                if (document.hidden) {
                    document.title = `🔔 New Ticket: ${event.subject}`;
                }

                // Refresh notification list
                fetchNotifications();
            });

            return () => {
                channel.stopListening('TicketCreated');
            };
        }
    }, [fetchNotifications, playSound]);

    return {
        notifications,
        unreadCount,
        lastToast,
        setLastToast,
        markAsRead,
        markAllAsRead,
        fetchNotifications
    };
}

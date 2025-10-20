'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { mockNotifications, getUnreadNotificationCount } from '@/lib/mock-data';
import type { Notification } from '@/lib/types';

/**
 * 알림 벨 컴포넌트
 *
 * 기능:
 * - 읽지 않은 알림 개수 Badge 표시
 * - 드롭다운 메뉴로 알림 목록 표시
 * - 알림 클릭 시 읽음 처리 및 해당 링크로 이동
 * - localStorage에 읽음 상태 저장
 */

/** 알림 아이템 컴포넌트 */
function NotificationItem({ notification, onMarkAsRead }: {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}) {
  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
  };

  // 시간 표시 (상대 시간)
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return '방금 전';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}일 전`;
    return date.toLocaleDateString('ko-KR');
  };

  return (
    <DropdownMenuItem asChild>
      <Link
        href={notification.link || '#'}
        onClick={handleClick}
        className={`flex flex-col items-start gap-1 p-3 cursor-pointer ${
          !notification.read ? 'bg-blue-50 dark:bg-blue-950/20' : ''
        }`}
      >
        <div className="flex items-center gap-2 w-full">
          {notification.actor?.avatarUrl && (
            <img
              src={notification.actor.avatarUrl}
              alt={notification.actor.username}
              className="w-8 h-8 rounded-full"
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{notification.title}</p>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {notification.message}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {getRelativeTime(notification.createdAt)}
            </p>
          </div>
          {!notification.read && (
            <Badge variant="default" className="ml-auto shrink-0 w-2 h-2 p-0 rounded-full" />
          )}
        </div>
      </Link>
    </DropdownMenuItem>
  );
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [unreadCount, setUnreadCount] = useState(0);

  // localStorage에서 읽음 상태 로드
  useEffect(() => {
    try {
      const stored = localStorage.getItem('notification_read_status');
      if (stored) {
        const readIds: string[] = JSON.parse(stored);
        const updated = mockNotifications.map((notif) => ({
          ...notif,
          read: readIds.includes(notif.id) || notif.read,
        }));
        setNotifications(updated);
        setUnreadCount(updated.filter((n) => !n.read).length);
      } else {
        setUnreadCount(getUnreadNotificationCount('current_user'));
      }
    } catch (error) {
      console.error('Failed to load notification read status:', error);
      setUnreadCount(getUnreadNotificationCount('current_user'));
    }
  }, []);

  // 알림을 읽음 처리
  const markAsRead = (id: string) => {
    const updated = notifications.map((notif) =>
      notif.id === id ? { ...notif, read: true } : notif
    );
    setNotifications(updated);
    setUnreadCount(updated.filter((n) => !n.read).length);

    // localStorage에 저장
    try {
      const readIds = updated.filter((n) => n.read).map((n) => n.id);
      localStorage.setItem('notification_read_status', JSON.stringify(readIds));
    } catch (error) {
      console.error('Failed to save notification read status:', error);
    }
  };

  // 모두 읽음 처리
  const markAllAsRead = () => {
    const updated = notifications.map((notif) => ({ ...notif, read: true }));
    setNotifications(updated);
    setUnreadCount(0);

    // localStorage에 저장
    try {
      const readIds = updated.map((n) => n.id);
      localStorage.setItem('notification_read_status', JSON.stringify(readIds));
    } catch (error) {
      console.error('Failed to save notification read status:', error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="알림">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center text-xs px-1"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>알림</span>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              모두 읽음
            </button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            알림이 없습니다
          </div>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={markAsRead}
            />
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

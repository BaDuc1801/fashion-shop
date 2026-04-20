import { useEffect, useRef } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  GetNotificationsResponse,
  Notification,
  notificationService,
} from '../api';

const LIMIT = 4;

export interface NotificationInfinityListProps {
  setOpen?: (open: boolean) => void;
  pages?: GetNotificationsResponse[];
}

export const NotificationInfinityList = ({
  setOpen,
  pages,
}: NotificationInfinityListProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const loaderRef = useRef<HTMLDivElement | null>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['notifications-infinite'],
      queryFn: ({ pageParam = 1 }) =>
        notificationService.getNotifications({
          page: pageParam,
          limit: LIMIT,
        }),
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.data.length < LIMIT) return undefined;
        return allPages.length + 1;
      },
      initialPageParam: 1,
    });

  // flatten data
  const notifications = data?.pages.flatMap((p) => p.data) || [];

  useEffect(() => {
    if (!loaderRef.current) return;
    if (!hasNextPage) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isFetchingNextPage) {
        fetchNextPage();
      }
    });

    observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleClick = async (item: Notification) => {
    await notificationService.markAsRead(item._id);

    queryClient.setQueryData(
      ['notifications-infinite'],
      (old: GetNotificationsResponse[]) => {
        if (!old) return old;

        return old.map((page) => ({
          ...page,
          data: page.data.map((n) =>
            n._id === item._id ? { ...n, isRead: true } : n,
          ),
        }));
      },
    );

    queryClient.setQueryData<{ total: number }>(
      ['unread-notifications-count'],
      (old) => {
        if (!old) return old;
        return { total: Math.max(0, old.total - 1) };
      },
    );

    if (item.data?.orderId) {
      navigate(`/orders/${item.data.orderId}`);
    }

    setOpen?.(false);
  };

  return (
    <div className="w-80 max-h-96 overflow-y-auto rounded-lg shadow-xl border border-gray-200 bg-white">
      {notifications.map((item) => (
        <div
          key={item._id}
          onClick={() => handleClick(item)}
          className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${
            item.isRead ? '' : 'bg-blue-50'
          }`}
        >
          <div className="font-medium text-sm">
            {item.title || 'Notification'}
          </div>
          <div className="text-xs text-gray-500">{item.message}</div>
        </div>
      ))}

      <div ref={loaderRef} className="flex justify-center py-3">
        {isFetchingNextPage ? (
          <span className="text-sm text-gray-400">Loading...</span>
        ) : null}

        {!hasNextPage && notifications.length > 0 && (
          <span className="text-xs text-gray-400">No more notifications</span>
        )}
      </div>
    </div>
  );
};

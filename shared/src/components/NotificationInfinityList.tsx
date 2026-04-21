import { useNavigate } from 'react-router-dom';
import { GetNotificationsResponse, Notification } from '../api';
import {
  InfiniteData,
  useInfiniteQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useAuthStore } from '../stores';
import { useEffect, useRef } from 'react';

export interface NotificationInfinityListProps {
  setOpen?: (open: boolean) => void;
  queryKeyPrefix: string;
  getList: (params: {
    page: number;
    limit: number;
  }) => Promise<GetNotificationsResponse>;
  markAsRead: (id: string) => Promise<{ success: boolean }>;
  unreadKey: string;
  isAdmin?: boolean;
}

const LIMIT = 4;

export const NotificationInfinityList = ({
  setOpen,
  queryKeyPrefix,
  getList,
  markAsRead,
  unreadKey,
  isAdmin = false,
}: NotificationInfinityListProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  const loaderRef = useRef<HTMLDivElement | null>(null);

  const queryKey = [queryKeyPrefix, user?.userId];

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey,
      queryFn: ({ pageParam = 1 }) =>
        getList({
          page: pageParam,
          limit: LIMIT,
        }),
      getNextPageParam: (lastPage) => {
        if (lastPage.page >= lastPage.totalPages) return undefined;
        return lastPage.page + 1;
      },
      initialPageParam: 1,
      enabled: !!user?.userId,
    });

  const notifications = data?.pages.flatMap((p) => p.data) || [];

  useEffect(() => {
    const el = loaderRef.current;
    if (!el || !hasNextPage) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isFetchingNextPage) {
        fetchNextPage();
      }
    });

    observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleClick = async (item: Notification) => {
    await markAsRead(item._id);

    queryClient.setQueryData(
      queryKey,
      (old: InfiniteData<GetNotificationsResponse>) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((p) => ({
            ...p,
            data: p.data.map((n) =>
              n._id === item._id ? { ...n, isRead: true } : n,
            ),
          })),
        };
      },
    );

    queryClient.setQueryData(
      [unreadKey, user?.userId],
      (old: { total: number }) => ({
        total: Math.max(0, (old?.total ?? 1) - 1),
      }),
    );

    setOpen?.(false);

    if (item.data?.orderId && isAdmin) {
      navigate(`/orders/${item.data.orderId}`);
    } else if (item.data?.orderId) {
      navigate(`/user/orders?orderCode=${item.data.orderCode}`);
    }
  };

  return (
    <div className="w-80 max-h-[400px] overflow-y-auto rounded-lg shadow-xl border bg-white">
      {notifications.map((item) => (
        <div
          key={item._id + item.isRead}
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
        {isFetchingNextPage && (
          <span className="text-sm text-gray-400">Loading...</span>
        )}

        {!hasNextPage && notifications.length > 0 && (
          <span className="text-xs text-gray-400">No more notifications</span>
        )}
      </div>
    </div>
  );
};

import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tag, Spin, Card } from 'antd';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { orderService, formatUsd, OrderDetailData } from '@shared';

const LIMIT = 5;

const OrderInfiniteList = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [orders, setOrders] = useState<OrderDetailData[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const loaderRef = useRef<HTMLDivElement | null>(null);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['orders-infinite', page],
    queryFn: () =>
      orderService.getAllOrders({
        page,
        limit: LIMIT,
      }),
  });

  useEffect(() => {
    if (!data?.orders) return;

    if (page === 1) {
      setOrders(data.orders);
    } else {
      setOrders((prev) => [...prev, ...data.orders]);
    }

    if (data.orders.length < LIMIT) {
      setHasMore(false);
    }
  }, [data, page]);

  useEffect(() => {
    setOrders([]);
    setPage(1);
    setHasMore(true);
  }, []);

  useEffect(() => {
    if (!loaderRef.current) return;
    if (!hasMore) return;

    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target.isIntersecting && !isFetching) {
        setPage((prev) => prev + 1);
      }
    });

    observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [hasMore, isFetching]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'green';
      case 'shipping':
        return 'blue';
      case 'pending':
        return 'gold';
      case 'cancelled':
        return 'red';
      default:
        return 'default';
    }
  };

  return (
    <Card title="Recent Orders">
      <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto">
        {orders.map((order) => (
          <div
            key={order._id}
            onClick={() => navigate(`/orders/${order._id}`)}
            className="cursor-pointer rounded-lg border p-3 hover:shadow transition"
          >
            <div className="flex items-center justify-between">
              <div className="font-medium">{order.orderCode}</div>

              <Tag color={getStatusColor(order.orderStatus)}>
                {order.orderStatus}
              </Tag>
            </div>

            <div className="mt-1 flex justify-between text-sm text-gray-600">
              <span>{formatUsd(order.total)}</span>
              <span>{dayjs(order.createdAt).format('DD/MM/YYYY HH:mm')}</span>
            </div>
          </div>
        ))}

        <div ref={loaderRef} className="flex justify-center py-3">
          {isLoading || isFetching ? <Spin /> : null}
          {!hasMore && orders.length > 0 && (
            <span className="text-gray-400 text-sm">No more orders</span>
          )}
        </div>
      </div>
    </Card>
  );
};

export default OrderInfiniteList;

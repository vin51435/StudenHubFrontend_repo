import { Card, Table, Typography, Pagination, Spin, Button, Popconfirm } from 'antd';
import { ReactNode, useEffect, useState } from 'react';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;

type PaginatedTableDashboardProps<T> = {
  title: string;
  pageSize?: number;
  columns: ColumnsType<T>;
  refreshKey?: number;
  extra?: ReactNode;
  form?: ReactNode;
  fetchData: (page: number, pageSize: number) => Promise<{ data: T[]; totalItems: number }>;
};

export function PaginatedTableDashboard<T extends { _id: string }>({
  title,
  columns,
  pageSize = 20,
  refreshKey,
  extra,
  form,
  fetchData,
}: PaginatedTableDashboardProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchData(page, pageSize);
      setData(res.data);
      setTotal(res.totalItems);
    } catch (error) {
      console.error(`Failed to fetch ${title}`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, refreshKey]);

  return (
    <Card
      className="rounded-2xl shadow-md dark:!bg-[var(--primary-dark)]"
      classNames={{
        title: 'text-start flex justify-center px-1',
        body: 'dark:!bg-[var(--primary-dark)] !pt-0',
      }}
      extra={extra}
      title={
        <Title className="!m-0 !p-0" level={4}>
          {title}
        </Title>
      }
    >
      <Spin spinning={loading}>
        {form && <div className="mb-4">{form}</div>}
        <Table
          className="dark:!bg-[var(--primary-dark)]"
          columns={columns}
          dataSource={data}
          rowKey="_id"
          key={`${title}-${refreshKey ?? ''}`}
          pagination={false}
          scroll={{ x: 800 }}
        />
      </Spin>
      <div className="mt-4 text-right">
        <Pagination
          current={page}
          pageSize={pageSize}
          total={total}
          onChange={(p) => setPage(p)}
          showSizeChanger={false}
        />
      </div>
    </Card>
  );
}

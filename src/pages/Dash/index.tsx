import { useEffect, useState } from 'react';
import { Card, Table, Typography, Pagination, Spin, Button, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import AdminOp from '@src/api/adminOperations';
import { LogEntry } from '@src/types/app';
import { MdDelete } from 'react-icons/md';

const { Title } = Typography;

const columns: ColumnsType<LogEntry> = [
  {
    title: 'IP Address',
    dataIndex: 'ip',
    key: 'ip',
  },
  // {
  //   title: 'Username',
  //   dataIndex: 'username',
  //   key: 'username',
  //   render: (text) => text || 'N/A',
  // },
  {
    title: 'Device Info',
    key: 'device',
    render: (_, record) =>
      `${record.device?.os || '-'} / ${record.device?.browser || '-'} / ${
        record.device?.platform || '-'
      }`,
  },
  {
    title:'Path',
    dataIndex:'path',
    key:'path',
    render: (text) => (
      <div title={text} className="overflow-hidden overflow-ellipsis whitespace-nowrap" style={{ maxWidth: 200 }}>
        {text}
      </div>
    ),
  },
  {
    title: 'Location',
    key: 'location',
    render: (_, record) =>
      `${record.location?.city || '-'}, ${record.location?.region || '-'}, ${
        record.location?.country || '-'
      }`,
  },
  {
    title: 'Time',
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: (text) => new Date(text).toLocaleString(),
  },
];

export default function AccessLogDashboard() {
  const [data, setData] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await AdminOp.getAccessLogs(page, pageSize);
      setData(res.data);
      setTotal(res.totalItems);
    } catch (error) {
      console.error('Failed to fetch logs', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteLogs = async () => {
    setLoading(true);
    try {
      const res = await AdminOp.deleteAccessLogs();
      setData([]);
      setTotal(0);
    } catch (error) {
      console.error('Failed to fetch logs', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page]);

  return (
    <div className="p-4">
      <Card
        className="rounded-2xl shadow-md dark:!bg-[var(---primiary-dark)]"
        classNames={{ body: 'dark:!bg-[var(---primiary-dark)]' }}
      >
        <div className="flex justify-between items-center mb-4">
          <Title level={4}>API Access Logs</Title>
          <Popconfirm
            title="Are you sure to delete all logs?"
            okText="Yes"
            cancelText="No"
            onConfirm={deleteLogs}
          >
            <Button type="primary" danger>
              <MdDelete />
            </Button>
          </Popconfirm>
        </div>
        <Spin spinning={loading}>
          <Table
            className="dark:!bg-[var(---primiary-dark)]"
            columns={columns}
            dataSource={data}
            rowKey="_id"
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
    </div>
  );
}

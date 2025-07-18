import type { ColumnsType } from 'antd/es/table';
import { LogEntry } from '@src/types/app';
import { Popconfirm, Button } from 'antd';
import { MdDelete } from 'react-icons/md';

export const accessLogColumns = (onDelete: (id: string) => void): ColumnsType<LogEntry> => [
  {
    title: 'IP Address',
    dataIndex: 'ip',
    key: 'ip',
    render: (text) => (
      <span onClick={() => navigator.clipboard.writeText(text)} style={{ cursor: 'pointer' }}>
        {text}
      </span>
    ),
  },
  {
    title: 'Device Info',
    key: 'device',
    render: (_, record) =>
      `${record.device?.os || '-'} / ${record.device?.browser || '-'} / ${
        record.device?.platform || '-'
      }`,
  },
  {
    title: 'Path',
    dataIndex: 'path',
    key: 'path',
    render: (text) => (
      <div
        title={text}
        className="overflow-hidden overflow-ellipsis whitespace-nowrap"
        style={{ maxWidth: 200 }}
      >
        {text}
      </div>
    ),
  },
  {
    title: 'Location',
    key: 'location',
    render: (_, record) =>
      `${record.location?.city || '-'}, ${record.location?.region || '-'}, ${record.location?.country || '-'}`,
  },
  {
    title: 'Time',
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: (text) => new Date(text).toLocaleString(),
  },
  {
    title: 'Actions',
    key: 'actions',
    render: (_, record) => (
      <Popconfirm
        title="Are you sure you want to delete this data?"
        onConfirm={() => onDelete(record._id)}
        okText="Yes"
        cancelText="No"
      >
        <Button danger size="small" icon={<MdDelete />} />
      </Popconfirm>
    ),
  },
];

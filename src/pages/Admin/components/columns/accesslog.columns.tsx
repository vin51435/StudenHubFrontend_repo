import type { ColumnsType } from 'antd/es/table';
import { LogEntry } from '@src/types/app';

export const accessLogColumns: ColumnsType<LogEntry> = [
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
];

import { Popconfirm, Button, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { AiOutlineUnlock } from 'react-icons/ai';

export const bannedIpsColumns = (
  onUnban: (id: string) => void
): ColumnsType<{ _id: string; ip: string; reason: string; banNetwork: boolean }> => [
  {
    title: 'IP Address',
    key: 'ip',
    dataIndex: 'ip',
  },
  {
    title: 'Reason',
    key: 'reason',
    dataIndex: 'reason',
    render: (text) => (
      <div
        title={text}
        className="overflow-hidden overflow-ellipsis whitespace-nowrap"
        style={{ maxWidth: 200 }}
      >
        {text || 'N/A'}
      </div>
    ),
  },
  {
    title: 'Ban Network',
    key: 'banNetwork',
    dataIndex: 'banNetwork',
    render: (text) => (text ? 'Yes' : 'No'),
  },
  {
    title: 'Actions',
    key: 'actions',
    render: (_, record) => (
      <Popconfirm
        title="Are you sure you want to unban this IP?"
        onConfirm={() => onUnban(record._id)}
        okText="Yes"
        cancelText="No"
      >
        <Tooltip title="Unban">
          <Button danger size="small" icon={<AiOutlineUnlock />} />
        </Tooltip>
      </Popconfirm>
    ),
  },
];

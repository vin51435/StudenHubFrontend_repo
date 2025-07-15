import { ColumnsType } from 'antd/es/table';
import { ICommunity } from '@src/types/app';
import { Popconfirm, Button } from 'antd';
import { MdDelete } from 'react-icons/md';

export const communityColumns = (onDelete: (id: string) => void): ColumnsType<ICommunity> => [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Slug',
    dataIndex: 'slug',
    key: 'slug',
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
    render: (text) => text.charAt(0).toUpperCase() + text.slice(1),
  },
  {
    title: 'Owner ID',
    dataIndex: 'owner',
    key: 'owner',
  },
  {
    title: 'Members',
    dataIndex: 'membersCount',
    key: 'membersCount',
  },
  {
    title: 'Followers',
    dataIndex: 'followersCount',
    key: 'followersCount',
  },
  {
    title: 'Created',
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: (text) => new Date(text).toLocaleDateString(),
  },
  {
    title: 'Actions',
    key: 'actions',
    render: (_, record) => (
      <Popconfirm
        title="Are you sure you want to delete this user?"
        onConfirm={() => onDelete(record._id)}
        okText="Yes"
        cancelText="No"
      >
        <Button danger size="small" icon={<MdDelete />} />
      </Popconfirm>
    ),
  },
];

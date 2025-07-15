import { ColumnsType } from 'antd/es/table';
import { IUser } from '@src/types/app';
import { Button, Popconfirm } from 'antd';
import { MdDelete } from 'react-icons/md';

export const userColumns = (onDelete: (id: string) => void): ColumnsType<IUser> => [
  {
    title: 'Name',
    key: 'name',
    render: (_, record) => `${record.firstName} ${record.lastName}`,
  },
  {
    title: 'Username',
    dataIndex: 'username',
    key: 'username',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Institute',
    key: 'institute',
    render: (_, record) => record.additionalInfo?.institute || 'N/A',
  },
  {
    title: 'Role',
    dataIndex: 'role',
    key: 'role',
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

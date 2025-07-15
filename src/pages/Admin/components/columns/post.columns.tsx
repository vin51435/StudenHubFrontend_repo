import { ColumnsType } from 'antd/es/table';
import { IPost } from '@src/types/app';
import { Popconfirm, Button } from 'antd';
import { MdDelete } from 'react-icons/md';

export const postColumns = (onDelete: (id: string) => void): ColumnsType<IPost> => [
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
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
    title: 'Author',
    key: 'authorId',
    render: (_, record) =>
      typeof record.authorId === 'string' ? record.authorId : record.authorId?.username,
  },
  {
    title: 'Community',
    key: 'communityId',
    render: (_, record) =>
      typeof record.communityId === 'string' ? record.communityId : record.communityId?.name,
  },
  {
    title: 'Votes (↑/↓)',
    key: 'votes',
    render: (_, record) => `${record.upvotesCount} / ${record.downvotesCount}`,
  },
  {
    title: 'Views',
    dataIndex: 'views',
    key: 'views',
  },
  {
    title: 'Comments',
    dataIndex: 'commentsCount',
    key: 'commentsCount',
  },
  {
    title: 'Saved Count',
    dataIndex: 'savesCount',
    key: 'savesCount',
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

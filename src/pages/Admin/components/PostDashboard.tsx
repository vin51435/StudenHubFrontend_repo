import AdminOp from '@src/api/adminOperations';
import { PaginatedTableDashboard } from '@src/components/PaginatedTableDashboard';
import { postColumns } from '@src/pages/Admin/components/columns/post.columns';
import { message, Button } from 'antd';
import { useState } from 'react';

export default function PostDashboard() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleDelete = async (id: string) => {
    try {
      await AdminOp.deletePost(id);
      message.success('User deleted');
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      message.error('Delete failed');
    }
  };

  return (
    <PaginatedTableDashboard
      title="Posts"
      extra={
        <Button onClick={() => setRefreshKey((prev) => prev + 1)} type="default">
          Refresh
        </Button>
      }
      refreshKey={refreshKey}
      columns={postColumns(handleDelete)}
      fetchData={AdminOp.getPosts}
      //   deleteAll={AdminOp.deletePosts}
    />
  );
}

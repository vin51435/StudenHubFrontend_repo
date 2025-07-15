import { useState } from 'react';
import { message, Button } from 'antd';
import AdminOp from '@src/api/adminOperations';
import { PaginatedTableDashboard } from '@src/components/PaginatedTableDashboard';
import { userColumns } from '@src/pages/Admin/components/columns/user.columns';
import { IUser } from '@src/types/app';

export default function UserDashboard() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleDelete = async (id: string) => {
    try {
      await AdminOp.deleteUser(id);
      message.success('User deleted');
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      message.error('Delete failed');
    }
  };

  return (
    <PaginatedTableDashboard<IUser>
      title="Users"
      extra={
        <Button onClick={() => setRefreshKey((prev) => prev + 1)} type="default">
          Refresh
        </Button>
      }
      refreshKey={refreshKey}
      columns={userColumns(handleDelete)}
      fetchData={AdminOp.getUsers}
    />
  );
}

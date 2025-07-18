import { useState } from 'react';
import { Button, message, Popconfirm } from 'antd';
import AdminOp from '@src/api/adminOperations';
import { PaginatedTableDashboard } from '@src/components/PaginatedTableDashboard';
import { accessLogColumns } from '@src/pages/Admin/components/columns/accesslog.columns';
import { LogEntry } from '@src/types/app';

export default function AccessLogDashboard() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleDeleteAll = async () => {
    try {
      await AdminOp.deleteAccessLogs();
      message.success('Access logs cleared');
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      message.error('Failed to delete logs');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await AdminOp.deleteAccessLogs(id);
      message.success('Data deleted');
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      message.error('Delete failed');
    }
  };

  return (
    <PaginatedTableDashboard<LogEntry>
      title="API Access Logs"
      extra={
        <div className="flex gap-4">
          <Button onClick={() => setRefreshKey((prev) => prev + 1)} type="default">
            Refresh
          </Button>
          <Popconfirm
            title="Are you sure you want to delete all access logs?"
            onConfirm={handleDeleteAll}
            okText="Yes"
            cancelText="No"
          >
            <Button danger type="primary">
              Delete All
            </Button>
          </Popconfirm>
        </div>
      }
      refreshKey={refreshKey}
      columns={accessLogColumns(handleDelete)}
      fetchData={AdminOp.getAccessLogs}
    />
  );
}

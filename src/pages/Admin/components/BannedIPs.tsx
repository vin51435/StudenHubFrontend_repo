import { useState } from 'react';
import { message, Button, Form, Input, Switch } from 'antd';
import AdminOp from '@src/api/adminOperations';
import { PaginatedTableDashboard } from '@src/components/PaginatedTableDashboard';
import { bannedIpsColumns } from '@src/pages/Admin/components/columns/bannedIPs.columns';

export default function BannedIPsDashboard() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUnban = async (id: string) => {
    try {
      await AdminOp.unbanIP(id);
      message.success('IP Unbanned');
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      message.error('Failed');
    }
  };

  return (
    <PaginatedTableDashboard
      title="Banned IPs"
      extra={
        <Button onClick={() => setRefreshKey((prev) => prev + 1)} type="default">
          Refresh
        </Button>
      }
      form={<BanIPForm onSuccess={() => setRefreshKey((prev) => prev + 1)} />}
      refreshKey={refreshKey}
      columns={bannedIpsColumns(handleUnban)}
      fetchData={AdminOp.getBannedIPs}
    />
  );
}

function BanIPForm({ onSuccess }: { onSuccess: () => void }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleBan = async () => {
    setLoading(true);
    const values = form.getFieldsValue();
    try {
      await AdminOp.banIP(values);
      message.success('IP Banned');
      form.resetFields();
      onSuccess();
    } catch (error) {
      message.error('Failed to ban IP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} layout="inline" onFinish={handleBan} className="mb-4">
      <Form.Item name="ip" rules={[{ required: true, message: 'Please enter an IP address' }]}>
        <Input placeholder="IP Address" />
      </Form.Item>
      <Form.Item name="reason">
        <Input placeholder="Reason" />
      </Form.Item>
      <Form.Item name="banNetwork" valuePropName="checked" initialValue={false}>
        <Switch checkedChildren="Ban Network" unCheckedChildren="Only IP" />
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit" type="primary" loading={loading}>
          Ban
        </Button>
      </Form.Item>
    </Form>
  );
}

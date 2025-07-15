import AccessLogDashboard from '@src/pages/Admin/components/AccessLogs';
import BannedIPsDashboard from '@src/pages/Admin/components/BannedIPs';
import CommunityDashboard from '@src/pages/Admin/components/CommunityDashboard';
import PostDashboard from '@src/pages/Admin/components/PostDashboard';
import UserDashboard from '@src/pages/Admin/components/UserDashboard';

const AdminDashboard = () => {
  return (
    <div className="flex flex-col gap-4">
      <BannedIPsDashboard />
      <AccessLogDashboard />
      <UserDashboard />
      <PostDashboard />
      <CommunityDashboard />
    </div>
  );
};

export default AdminDashboard;

import { useLogout } from '@src/hooks/useLogout';
import { Button } from 'antd';

export default function Home() {
  const logout = useLogout();
  return (
    <div>
      <div className="bg-white dark:bg-gray-900 text-black dark:text-white">Hello</div>
      <div className="bg-white text-black dark:bg-gray-900 dark:text-white p-4 rounded">
        Dark mode test
      </div>

      <br />
      <Button onClick={logout}>Logout</Button>
    </div>
  );
}

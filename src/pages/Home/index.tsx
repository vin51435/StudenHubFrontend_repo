import { useLogout } from '@src/hooks/useLogout';

export default function Home() {
  const logout = useLogout();
  return (
    <div>
      <div className="bg-white dark:bg-gray-900 text-black dark:text-white">Hello</div>

      <br />
      <button onClick={logout}>Logout</button>
    </div>
  );
}

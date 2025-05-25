import { useLogout } from '@src/hooks/useLogout';
import { get } from '@src/libs/apiConfig';
import { Button } from 'antd';
import { useEffect } from 'react';

export default function Home() {

  useEffect(() => {
    FetchFeed();
  }, [])

  async function FetchFeed() {
    const res = await get('FEED', { BASE_URLS: 'user' });
    console.log('feed: ', res.data);
  }

  return (
    <div>
      HOme
    </div>
  );
}

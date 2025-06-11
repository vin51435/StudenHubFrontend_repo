import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom'; // or next/router for Next.js

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[var(--primary-dark)]">
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button type="primary" onClick={() => navigate('/')}>
            Back Home
          </Button>
        }
      />
    </div>
  );
};

export default NotFoundPage;

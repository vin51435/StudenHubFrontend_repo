import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Form, Input, Button, message, Typography } from 'antd';
import { CiLock } from 'react-icons/ci';
import { resetPasswordSchema } from '@src/validation/authSchema';
import { patch } from '@src/libs/apiConfig';
import { AUTH_ENDPOINTS } from '@src/libs/apiEndpoints';
import { ZodError } from 'zod';
import { setZodErrorsToForm } from '@src/validation';
import { Link } from 'react-router-dom';
import { getRoutePath } from '@src/utils/getRoutePath';
import { useLogout } from '@src/hooks/useLogout';

const { Title } = Typography;

const ResetPassword: React.FC = () => {
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { resetToken } = useParams<{ resetToken: string }>();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const logout = useLogout();

  useEffect(() => {
    if (!email || !resetToken) {
      message.error('Malformed URL or missing email.');
      navigate('/login', { replace: true });
    }
  }, [email, resetToken, navigate]);

  const onFinish = async () => {
    const values = form.getFieldsValue();
    setTouched(true);
    try {
      resetPasswordSchema.parse(values);
      setLoading(true);
      await patch(AUTH_ENDPOINTS.USER_FORGOT_PASSWORD(resetToken), {
        BASE_URLS: 'auth',
        data: values,
      });

      message.success('Password reset successfully');
      logout();
    } catch (error) {
      if (error instanceof ZodError) {
        setZodErrorsToForm(error, form);
      } else {
        message.error((error as Error)?.message || 'Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!email || !resetToken) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 ">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 my-4">
        <Title level={3} className="text-center">
          Reset Password
        </Title>
        {email && (
          <span className="block text-start text-sm text-gray-600 mb-4">
            <p>
              Resetting password for <span className="font-semibold">{email}</span>
            </p>
          </span>
        )}
        <Form
          disabled={loading}
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          className="space-y-4"
        >
          <Form.Item
            name="password"
            label="New Password"
            rules={[{ required: true, message: 'Please enter your new password' }]}
          >
            <Input.Password prefix={<CiLock />} placeholder="Enter new password" />
          </Form.Item>

          <Form.Item
            name="passwordConfirm"
            label="Confirm Password"
            dependencies={['password']}
            rules={[{ required: true, message: 'Please confirm your password' }]}
          >
            <Input.Password prefix={<CiLock />} placeholder="Confirm new password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block className={'rounded-xl'}>
              Reset Password
            </Button>
          </Form.Item>
        </Form>
        <div>
          <Link to={getRoutePath('LOGIN')} replace>
            <Typography.Text type="secondary">Back to login</Typography.Text>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

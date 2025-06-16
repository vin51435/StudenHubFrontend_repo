import React, { useState } from 'react';
import { Form, Input, Button, Typography, FormInstance } from 'antd';
import { useNavigate } from 'react-router-dom';
import { post } from '@src/libs/apiConfig';
import {
  FormLogin1Schema,
  login1FormSchema,
  passwordResetSchema,
} from '@src/validation/authSchema';
import { ZodError } from 'zod';
import { useNotification } from '@src/contexts/NotificationContext';
import { getRoutePath } from '@src/utils/getRoutePath';
import { AUTH_ENDPOINTS } from '@src/libs/apiEndpoints';

const { Link } = Typography;

const LoginForm: React.FC = () => {
  const [form] = Form.useForm();
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormLogin1Schema, string>>>({});
  const [form2] = Form.useForm();
  const [touched, setTouched] = useState(false);

  const [step, setStep] = useState(1);
  const [load, setLoad] = useState(false);

  const navigate = useNavigate();
  const { notif } = useNotification();

  const handleFinish = () => {
    const values = form.getFieldsValue();
    setTouched(true);

    // Zod validation
    try {
      login1FormSchema.parse(values);
      setFormErrors({});

      // return;
      setLoad(true);

      post('USER_LOGIN', {
        BASE_URLS: 'auth',
        data: values,
      })
        .then((response) => {
          if (!response.redirectUrl) {
            navigate(getRoutePath('APP'));
          }
        })
        .catch((err) => {
          notif(err.message);
        })
        .finally(() => {
          setLoad(false);
        });
    } catch (zodError) {
      if (zodError instanceof ZodError) {
        const errorFields = zodError.errors.map((err) => ({
          name: [err.path[0]], // AntD requires name to be an array
          errors: [err.message],
        }));

        form.setFields(errorFields); // Show Zod errors in AntD
      }
      return; // Stop submission if validation fails
    } // API call using then/catch
  };

  const handleForgotPasswordSubmit = () => {
    const values = form.getFieldsValue(); // Get raw form values without validation
    setTouched(true);

    try {
      passwordResetSchema.parse(values); // Validate with Zod only
      setLoad(true);

      post(AUTH_ENDPOINTS.USER_FORGOT_PASSWORD(), {
        BASE_URLS: 'auth',
        data: { email: values.email },
      })
        .then((response) => {
          if (response.status === 'success') {
            notif(response.message, null, {
              type: 'success',
            });
          } else {
            notif(response.message);
          }
        })
        .catch((err) => {
          notif(err.message || 'Something went wrong');
        })
        .finally(() => {
          setLoad(false);
        });
    } catch (zodError) {
      if (zodError instanceof ZodError) {
        const fieldErrors = zodError.errors.map((err) => ({
          name: err.path,
          errors: [err.message],
        }));
        form2.setFields(fieldErrors);
      }
    }
  };

  const handleFormChange = () => {
    if (!touched) return;

    const schema = step === 1 ? login1FormSchema : passwordResetSchema;
    const formInstance: FormInstance = step === 1 ? form : form2;

    const values = formInstance.getFieldsValue(true);

    try {
      schema.parse(values); // Clear ALL errors manually
      const fieldNames = Object.keys(values);
      const clearedErrors = fieldNames.map((name) => ({
        name: [name],
        errors: [],
      }));
      formInstance.setFields(clearedErrors);
    } catch (err) {
      if (err instanceof ZodError) {
        const zodFields = Object.keys(values);
        const errorMap: Record<string, string> = {};
        err.errors.forEach((e) => {
          errorMap[e.path[0] as string] = e.message;
        });

        const updatedFields = zodFields.map((name) => ({
          name: [name],
          errors: errorMap[name] ? [errorMap[name]] : [],
        }));

        formInstance.setFields(updatedFields);
      }
    }
  };

  return (
    <div className="auth_form- w-full">
      {step === 1 ? (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          className="space-y-4"
          onValuesChange={handleFormChange}
        >
          <Form.Item label="Email" name="email" required>
            <Input />
          </Form.Item>

          <Form.Item label="Password" name="password" required>
            <Input.Password />
          </Form.Item>

          <div className="w-full text-right !mb-1">
            <Link
              onClick={() => {
                setFormErrors({});
                setStep(2);
              }}
            >
              Forgot password?
            </Link>
          </div>

          <Button type="primary" htmlType="submit" loading={load} className="w-full mt-4">
            Login
          </Button>
        </Form>
      ) : (
        <Form
          form={form2}
          layout="vertical"
          onFinish={handleForgotPasswordSubmit}
          className="space-y-4"
          onValuesChange={handleFormChange}
        >
          <Form.Item label="Email" name="email" required>
            <Input type="email" />
          </Form.Item>

          <div className="w-full text-right">
            <Link
              onClick={() => {
                setStep(1);
                setFormErrors({});
              }}
            >
              Back to login
            </Link>
          </div>

          <Button type="primary" htmlType="submit" loading={load} className="w-full mt-4">
            Send reset link
          </Button>
        </Form>
      )}
    </div>
  );
};

export default LoginForm;

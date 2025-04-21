import { LeftOutlined } from '@ant-design/icons';
import appConfig from '@src/config/appConfig';
import { ErrorCodes } from '@src/contants/errorCodes';
import { useNotification } from '@src/contexts/NotificationContext';
import { post } from '@src/libs/apiConfig';
import { loginSuccess } from '@src/redux/reducers/auth';
import {
  SignupFormSchema,
  EmailVerificationSchema,
  EmailCodeVerificationSchema,
  emailVerificationSchema,
  emailCodeVerificationSchema,
  signupSchema,
} from '@src/validation/authSchema';
import { Button, Form, FormInstance, Input, Spin } from 'antd';
import React, { useState, FormEvent, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ZodError } from 'zod';

interface SignupFormProps {
  setShowLoginService: React.Dispatch<React.SetStateAction<boolean>>;
}

const SignupForm: React.FC<SignupFormProps> = ({ setShowLoginService }: SignupFormProps) => {
  const [emailForm] = Form.useForm();
  const [codeForm] = Form.useForm();
  const [signupForm] = Form.useForm();
  const [otpState, setOtpState] = useState({
    email: '',
    count: 0,
    remaining: 0,
    waiting: false,
  });
  const [formErrors, setFormErrors] = useState<
    Partial<
      Record<
        keyof (SignupFormSchema & EmailVerificationSchema & EmailCodeVerificationSchema),
        string
      >
    >
  >({});
  const [touched, setTouched] = useState(false);

  const [step, setStep] = useState<number>(1);
  const [load, setLoad] = useState<boolean>(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { notif } = useNotification();

  const maxWait = appConfig.app.otpResend;
  useEffect(() => {
    if (otpState.count > 0) {
      setOtpState((prev) => ({ ...prev, remaining: maxWait, waiting: true }));

      const interval = setInterval(() => {
        setOtpState((prev) => {
          if (prev.remaining <= 1) {
            clearInterval(interval);
            return { ...prev, remaining: 0, waiting: false };
          }
          return { ...prev, remaining: prev.remaining - 1 };
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [otpState.count]);

  // useEffect(() => setShowLoginService(step !== 3), [step]);

  const handleSendVerification = () => {
    const values = step === 1 ? emailForm.getFieldsValue() : { email: otpState.email };
    setTouched(true);
    // Zod validation
    try {
      emailVerificationSchema.parse(values);
      setFormErrors({});

      // return;
      setLoad(true);

      post('USER_EMAIL_REG', {
        BASE_URLS: 'auth',
        data: values,
      })
        .then((response) => {
          notif(response.message, null, {
            type: 'info',
          });
          setOtpState((prev) => ({ ...prev, count: prev.count + 1, email: values.email }));
          if (response.errorCode === ErrorCodes.SIGNUP.EMAIL_ALREADY_VERIFIED) {
            setShowLoginService(false); // don't show login service, useEffect is visiually slower to hide service
            setStep(3);
          } else if (response.status === 'success') {
            setStep(2);
          }
        })
        .catch((err) => {
          notif(err.message, null, {
            type: 'info',
          });
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

        emailForm.setFields(errorFields); // Show Zod errors in AntD
      }
      return; // Stop submission if validation fails
    } // API call using then/catch
  };

  const handleCodeVerification = () => {
    const values = codeForm.getFieldsValue();
    setTouched(true);
    // Zod validation
    try {
      emailCodeVerificationSchema.parse(values);
      setFormErrors({});

      // return;
      setLoad(true);

      post('USER_EMAIL_VERIFY', {
        BASE_URLS: 'auth',
        data: values,
      })
        .then((response) => {
          setLoad(false);
          if (response.status === 'success') {
            setStep(3);
            notif(response?.message, null, {
              type: 'success',
            });
          }
        })
        .catch((err) => {
          notif(err?.message);
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

        codeForm.setFields(errorFields); // Show Zod errors in AntD
      }
      return; // Stop submission if validation fails
    } // API call using then/catch
  };

  const handleSignup = () => {
    const values = signupForm.getFieldsValue();
    setTouched(true);
    // Zod validation
    try {
      signupSchema.parse(values);
      setFormErrors({});

      // return;
      setLoad(true);

      post('USER_SIGNUP', {
        BASE_URLS: 'auth',
        data: values,
      })
        .then((response) => {
          dispatch(loginSuccess({ token: response.token, user: response.data.user }));
          navigate('/additionalinfo');
        })
        .catch((err) => {
          notif('Server Error', err?.message, {
            type: 'error',
          });
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

        signupForm.setFields(errorFields); // Show Zod errors in AntD
      }
      return; // Stop submission if validation fails
    } // API call using then/catch
  };

  const handleFormChange = () => {
    if (!touched) return;

    const schema =
      step === 1
        ? emailVerificationSchema
        : step === 1
        ? emailCodeVerificationSchema
        : signupSchema;
    const formInstance: FormInstance = step === 1 ? emailForm : step === 2 ? codeForm : signupForm;

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
    <div className=" ">
      {step === 1 && (
        <Form
          form={emailForm}
          layout="vertical"
          onFinish={handleSendVerification}
          className="space-y-4"
          onValuesChange={handleFormChange}
        >
          <Form.Item label="Email" name="email" required>
            <Input />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            className="w-full mt-6"
            loading={
              !!otpState.remaining
                ? {
                    icon: <Spin percent={(100 * (maxWait - otpState.remaining)) / maxWait} />,
                  }
                : load
            }
          >
            Verify Email
          </Button>
        </Form>
      )}

      {step === 2 && (
        <Form
          form={codeForm}
          initialValues={{
            email: otpState.email,
          }}
          layout="vertical"
          onFinish={handleCodeVerification}
          className="space-y-4"
          onValuesChange={handleFormChange}
        >
          <Button
            type="text"
            icon={<LeftOutlined />}
            onClick={() => setStep(1)}
            className="!m-0 !p-0 !flex !ml-auto -top-3 relative text-sm"
          >
            Back
          </Button>
          <Form.Item label="Email" name="email" required>
            <Input disabled />
          </Form.Item>
          <Form.Item label="OTP" name="otp" required>
            <Input.OTP length={appConfig.app.otpLength} />
          </Form.Item>

          <div className="d-flex w-100 !space-x-4 mt-6">
            <Button
              className="!mr-4"
              onClick={handleCodeVerification}
              loading={load}
              htmlType="button"
              type="primary"
            >
              Verify
            </Button>
            <Button
              className=""
              onClick={handleSendVerification}
              htmlType="button"
              type="primary"
              loading={
                !!otpState.remaining
                  ? {
                      icon: <Spin percent={(100 * (maxWait - otpState.remaining)) / maxWait} />,
                    }
                  : load
              }
            >
              {touched ? 'Resend OTP' : 'Send OTP'}
            </Button>
          </div>
        </Form>
      )}

      {step === 3 && (
        <Form
          form={signupForm}
          layout="vertical"
          initialValues={{
            email: otpState.email,
          }}
          onFinish={handleSignup}
          className="space-y-4 !mt-5"
          onValuesChange={handleFormChange}
        >
          {/* <Button
            type="text"
            icon={<LeftOutlined />}
            onClick={() => setStep(2)}
            className="!m-0 !p-0 !flex !ml-auto -top-3 relative text-sm"
          >
            Back
          </Button> */}
          <Form.Item label="Email" name="email" required>
            <Input disabled />
          </Form.Item>

          <div className="flex gap-4">
            <Form.Item label="First Name" name="firstName" required className="w-1/2">
              <Input />
            </Form.Item>

            <Form.Item label="Last Name" name="lastName" required className="w-1/2">
              <Input />
            </Form.Item>
          </div>

          <Form.Item label="Password" name="password" required>
            <Input.Password />
          </Form.Item>

          <Form.Item label="Confirm Password" name="passwordConfirm" required>
            <Input.Password />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={load} className="w-full !mt-6">
            Signup
          </Button>
        </Form>
      )}
    </div>
  );
};

export default SignupForm;

import React, { useEffect, useState } from 'react';
import { Avatar, Button, Form, Input, message, Select, Row, Col } from 'antd';
import { RootState } from '@src/redux/store';
import { useSelector } from 'react-redux';
import ImageUpload from '@src/components/ImageUpload';
import { get, patch } from '@src/libs/apiConfig';
import { profileSchema } from '@src/validation/profileSchema';
import { ZodError } from 'zod';
import { setZodErrorsToForm } from '@src/validation';

const { TextArea } = Input;
const { Option } = Select;

export const Profile: React.FC = () => {
  const [editMode, setEditMode] = useState(false);
  const [interest, setInterest] = useState({ data: [], required: 0 });
  const [form] = Form.useForm();

  const { user } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    form.setFieldsValue(user);
    getInterests();
  }, [form]);

  async function getInterests() {
    get('GET_INTERESTS', {
      BASE_URLS: 'userFormats',
    }).then((response) => {
      if (response.data) {
        setInterest((prev) => ({
          ...prev,
          data: response.data.interests,
          required: response.data.required,
        }));
      }
    });
  }

  const handleImageUpload = async (file: File | undefined) => {
    // if (!file) return;

    const formData = new FormData();
    if (!file) {
      formData.append('deletePicture', 'true');
    } else {
      formData.append('image', file);
    }

    setLoading(true);
    try {
      const response = await patch('USER_PICTURE', {
        BASE_URLS: 'user',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: formData,
      });

      console.log(response);
      message.success('Profile picture updated successfully!');
    } catch (error) {
      console.error(error);
      message.error('Failed to update profile picture.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const values = form.getFieldsValue();

    try {
      profileSchema.parse(values);
      setLoading(true);
      await patch('USER', {
        BASE_URLS: 'user',
        data: values,
      });
      message.success('User Saved!');
      setEditMode(false);
    } catch (err) {
      if (err instanceof ZodError) {
        setZodErrorsToForm(err, form);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto  bg-white dark:bg-gray-900 p-3 rounded-xl shadow">
      <Row className="flex items-center space-x-6 mb-8">
        <Col className="flex flex-col items-center">
          <ImageUpload
            multiple={false}
            value={user?.profilePicture ?? undefined}
            onChange={(files) => {
              // if (!files.length) return;
              handleImageUpload(files[0].file);
            }}
          />
        </Col>
        <Col className="text-left">
          <h2 className="text-2xl font-semibold dark:text-white">{user!.fullName}</h2>
          <p className="text-gray-500 dark:text-gray-400">@{user!.username}</p>
          <p className="text-gray-600 dark:text-gray-300">{user!.email}</p>
        </Col>
      </Row>

      <Form layout="vertical" form={form} onFinish={handleSave} disabled={loading}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <Form.Item name="firstName" label="First Name">
            <Input disabled={!editMode} />
          </Form.Item>

          <Form.Item name="lastName" label="Last Name">
            <Input disabled={!editMode} />
          </Form.Item>

          <Form.Item name={['additionalInfo', 'institute']} label="Institute" required>
            <Input disabled={!editMode} />
          </Form.Item>

          {/* <Form.Item name={['additionalInfo', 'userType']} label="User Type">
            <Select disabled={!editMode}>
              <Option value="student">Student</Option>
              <Option value="teacher">Teacher</Option>
            </Select>
          </Form.Item> */}

          <Form.Item name={['additionalInfo', 'gender']} label="Gender">
            <Select disabled={!editMode}>
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item name="bio" label="Bio">
            <TextArea disabled={!editMode} rows={3} />
          </Form.Item>

          {/* <Form.Item name="interests" label="Interests">
            <Select mode="tags" disabled={!editMode} />
          </Form.Item> */}
        </div>

        <div className="mt-4 flex justify-end">
          {editMode ? (
            <>
              <Button onClick={() => setEditMode(false)} className="mr-2">
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </>
          ) : (
            <Button type="default" onClick={() => setEditMode(true)}>
              Edit Profile
            </Button>
          )}
        </div>
      </Form>
    </div>
  );
};

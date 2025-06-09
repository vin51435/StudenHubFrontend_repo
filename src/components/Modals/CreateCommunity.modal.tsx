import ImageUpload from '@src/components/ImageUpload';
import { BasicModalProps } from '@src/components/Modals';
import { post } from '@src/libs/apiConfig';
import { getRoutePath } from '@src/utils/getRoutePath';
import { setZodErrorsToForm } from '@src/validation';
import { communityCreateSchema } from '@src/validation/community.schema';
import { Button, Col, Form, Input, message, Row, Switch } from 'antd';
import Modal from 'antd/es/modal/Modal';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ZodError } from 'zod';

const CreateCommunityModal: React.FC<BasicModalProps> = ({ modalProps, closeModal }) => {
  const [load, setLoad] = useState(false);

  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async () => {
    const values = form.getFieldsValue();
    const formData = new FormData();

    try {
      setLoad(true);
      communityCreateSchema.parse(values);

      Object.keys(values).forEach((key) => {
        if (!values[key] || key === 'avatar') return;
        if (!values[key] || key === 'banner') return;
        formData.append(key, values[key]);
      });

      if (values.avatar && values.avatar.length && values.avatar[0].file) {
        formData.append('avatar', values.avatar[0].file);
      }
      if (values.banner && values.banner.length && values.banner[0].file) {
        formData.append('banner', values.banner[0].file);
      }

      const res = await post('COMMUNITY', {
        BASE_URLS: 'center',
        bodyType: 'form-data',
        data: formData,
      });

      message.success('Community created successfully');
      form.resetFields();
      navigate(getRoutePath('COMMUNITY').replace(':slug', res?.data?.slug));
      closeModal();
    } catch (err) {
      if (err instanceof ZodError) {
        setZodErrorsToForm(err, form);
      } else {
        message.info((err as Error).message);
        console.error((err as Error).message);
      }
    } finally {
      setLoad(false);
    }
  };

  return (
    <Modal
      className="dark:!bg-[var(--primary-dark)] rounded-2xl"
      classNames={{
        header: '!bg-inherit',
        body: '',
        content: 'dark:!bg-[var(--primary-dark)]',
      }}
      open={modalProps?.open}
      title="Create Custom Feed"
      onCancel={closeModal}
      footer={null}
      destroyOnHidden
    >
      <Form
        className="overflow-auto custom-scrollbar !p-2"
        style={{ maxHeight: '70vh' }}
        form={form}
        layout="vertical"
        onFinish={onFinish}
        disabled={load}
      >
        <Form.Item
          id="name"
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Name is required' }]}
        >
          <Input maxLength={50} />
        </Form.Item>

        <Form.Item name="description" label="Description">
          <Input.TextArea maxLength={500} showCount rows={4} />
        </Form.Item>
        <div className="flex gap-4">
          <Form.Item name={'avatar'}>
            <ImageUpload multiple={false} imageDetails={[{ name: 'Community Image' }]} />
          </Form.Item>
          <Form.Item name={'banner'}>
            <ImageUpload multiple={false} imageDetails={[{ name: 'Banner' }]} />
          </Form.Item>
        </div>

        <Form.Item name="private" valuePropName="checked">
          <div className="flex  items-center">
            <span className="font-medium text-center mr-3">Make private</span>
            <Switch />
          </div>
        </Form.Item>

        <div className="flex justify-end gap-2 pt-4">
          <Button onClick={closeModal}>Cancel</Button>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateCommunityModal;

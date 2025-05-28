import ImageUpload from '@src/components/ImageUpload';
import { BasicModalProps } from '@src/components/Modals';
import { post } from '@src/libs/apiConfig';
import { setZodErrorsToForm } from '@src/validation';
import { communityCreateSchema } from '@src/validation/community.schema';
import { Button, Form, Input, message, Switch } from 'antd';
import AvatarContext from 'antd/es/avatar/AvatarContext';
import Modal from 'antd/es/modal/Modal';
import React, { useState } from 'react';
import { ZodError } from 'zod';

const CreateCommunityModal: React.FC<BasicModalProps> = ({ modalProps, closeModal }) => {
  const [load, setLoad] = useState(false);
  const [form] = Form.useForm();
  const formData = new FormData();

  const onFinish = async () => {
    const values = form.getFieldsValue();
    const formData = new FormData();

    try {
      setLoad(true);
      communityCreateSchema.parse(values);

      Object.keys(values).forEach((key) => {
        if (!values[key] || key === 'avatar') return;
        formData.append(key, values[key]);
      });

      // ✅ Append actual file, not object
      if (values.avatar && values.avatar.length && values.avatar[0].file) {
        formData.append('avatar', values.avatar[0].file);
      }

      const res = await post('COMMUNITY', {
        BASE_URLS: 'center',
        bodyType: 'form-data',
        data: formData,
      });

      message.success('Community created successfully');
      form.resetFields();

      // closeModal();
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
      open={modalProps?.open}
      title="Create Custom Feed"
      onCancel={closeModal}
      footer={null}
      destroyOnHidden
    >
      <Form
        className="overflow-auto "
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

        <Form.Item id="description" name="description" label="Description">
          <Input.TextArea maxLength={200} showCount rows={4} />
        </Form.Item>
        <Form.Item name={'avatar'}>
          <ImageUpload multiple={false} imageDetails={[{ name: 'Community Image' }]} />
        </Form.Item>

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

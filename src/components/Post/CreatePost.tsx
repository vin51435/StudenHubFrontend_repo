import { useEffect, useRef, useState } from 'react';
import { Form, Input, Select, Button, Typography, message, Card } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageUpload from '@src/components/ImageUpload';
import CustomSelect from '@src/components/Select';
import { ICommunity } from '@src/types/app';
import CommunityOp from '@src/api/communityOperations';
import { useNavigate, useParams } from 'react-router-dom';
import { getRoutePath } from '@src/utils/getRoutePath';
import TagInput from '@src/components/TagInput';
import { createPostSchema } from '@src/validation/postSchema';
import { setZodErrorsToForm } from '@src/validation';
import { ZodError } from 'zod';
import UserOp from '@src/api/userOperations';

const { Title } = Typography;

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote', 'code-block'],
    [{ align: [] }],
    ['link'],
    // ['link', 'image'],
    ['clean'], // remove formatting button
  ],
  clipboard: {
    matchVisual: false,
  },
};

const CreatePost = () => {
  const [options,setOptions] =useState<ICommunity[]>([])
  const [selectedCommunity, setSelectedCommunity] = useState<ICommunity | null>(null);
  const [load, setLoad] = useState(false);

  const { slug } = useParams<{ slug: string }>();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  
  useEffect(() => {
    getAllFollowedCommunities()
  },[])

  useEffect(() => {
    getCommunity();
  }, [slug]);

  async function getAllFollowedCommunities() {
    const res = await UserOp.fetchFollowedCommunity();
    if (res?.data) {
      setOptions(res?.data);
    }
  }
  
  async function getCommunity() {
    const res = await CommunityOp.fetchCommunityDetails(slug);
    if (!res?.data || !res?.data?.isFollowing) {
      message.error('You are not following this community');
      navigate(getRoutePath('APP'));
      return;
    }

    setSelectedCommunity(res?.data);
  }

  const handleFinish = async (values: any) => {
    values.files = values?.files?.map((fileData: any) => fileData?.file);
    const formData = new FormData();

    try {
      setLoad(true);
      createPostSchema.parse(values);

      Object.entries(values).forEach(([key, value]) => {
        if (key === 'files' && Array.isArray(value)) {
          value.forEach((file: File) => {
            formData.append('files', file);
          });
        } else if (key === 'tags' && Array.isArray(value)) {
          formData.append('tags', JSON.stringify(value));
        } else if (typeof value === 'string') {
          formData.append(key, value);
        } else if (typeof value === 'number' || typeof value === 'boolean') {
          formData.append(key, value.toString());
        } else if (Array.isArray(value)) {
          value.forEach((item) => {
            formData.append(key, item.toString()); // Or JSON.stringify(item) depending on backend
          });
        }
      });
      const res = await CommunityOp.createPost(formData, selectedCommunity?._id);

      message.success('Post created successfully');

      if (res?.data?._id) {
        navigate(
          getRoutePath('POST')
            .replace(':postSlug', res.data.slug)
            .replace(':slug', (selectedCommunity?.slug as string) ?? 'xyz')
        );
      }

      form.resetFields();
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
    <Card className="p-4 rounded-xl max-w-3xl !mx-auto create-post_container dark:!bg-[var(--primary-dark)]">
      <Title level={4} className="text-start">
        Create a Post
      </Title>
      <Form form={form} disabled={load} name="createPost" layout="vertical" onFinish={handleFinish}>
        <Form.Item
          // name="community"
          label="Post in"
          rules={[{ required: true, message: 'Please select a community' }]}
          wrapperCol={{ span: 10 }}
        >
          {selectedCommunity && (
            <CustomSelect
              type="FollwedCommunities"
              selectValue={selectedCommunity?._id ?? null}
              handleChange={(id, fulloption) => {
                setSelectedCommunity(fulloption);
                if (fulloption) {
                  navigate(getRoutePath('CREATE_POST').replace(':slug', fulloption?.slug));
                }
              }}
              defaultData={options}
            />
          )}
        </Form.Item>

        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
          <Input maxLength={300} placeholder="Title" />
        </Form.Item>

        <Form.Item name="tags" label="Tags">
          <TagInput maxTags={5} />
        </Form.Item>

        <Form.Item name="files" label="Upload Image">
          <ImageUpload multiple={true} maxCount={5} />
        </Form.Item>

        <Form.Item name="content">
          <ReactQuill theme="snow" className="" modules={quillModules} />
        </Form.Item>

        <div className="flex justify-end gap-2">
          <Button htmlType="reset">Reset</Button>
          <Button type="primary" htmlType="submit">
            Post
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default CreatePost;

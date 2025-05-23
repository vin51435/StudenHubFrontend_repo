import { PlusOutlined } from '@ant-design/icons';
import { GetProp, UploadProps, UploadFile, Upload, Image } from 'antd';
import { UploadFileStatus } from 'antd/es/upload/interface';
import React, { useState, useEffect } from 'react';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

interface ImageUploadProps {
  multiple?: boolean;
  value?: string | string[]; // initial image(s)
  onChange?: (files: { base64: string; file: File }[]) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ multiple = false, value, onChange }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    if (value) {
      const initialFiles = (Array.isArray(value) ? value : [value]).map((src, index) => ({
        uid: `-init-${index}`,
        name: `image-${index}`,
        status: 'done' as UploadFileStatus,
        url: src,
      }));
      setFileList(initialFiles);
    }
  }, [value]);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps['onChange'] = async ({ fileList: newFileList }) => {
    setFileList(newFileList);

    const result = await Promise.all(
      newFileList.map(async (file) => {
        let base64: string | undefined = file.preview as string;
        if (!base64 && file.originFileObj) {
          base64 = await getBase64(file.originFileObj as FileType);
          file.preview = base64;
        }

        return {
          base64,
          file: file.originFileObj as FileType,
        };
      })
    );

    onChange?.(result);
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 0 }}>Upload</div>
    </button>
  );

  return (
    <>
      <Upload
        // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        accept="image/jpeg,image/png,image/jpg"
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        beforeUpload={() => false} // prevents auto-upload
        multiple={multiple}
        pastable
      >
        {multiple
          ? fileList.length >= 8
            ? null
            : uploadButton
          : fileList.length >= 1
          ? null
          : uploadButton}
      </Upload>
      {previewImage && (
        <Image
          wrapperStyle={{ display: 'none' }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(''),
            toolbarRender: () => null, // disable zoom, rotate, etc.
          }}
          src={previewImage}
        />
      )}
    </>
  );
};

export default ImageUpload;

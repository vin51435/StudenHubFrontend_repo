import { PlusOutlined } from '@ant-design/icons';
import { GetProp, UploadProps, UploadFile, Upload, Image } from 'antd';
import { UploadChangeParam, UploadFileStatus } from 'antd/es/upload/interface';
import React, { useState, useEffect, useCallback } from 'react';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

interface ImageDetails {
  name: string;
  size?: number;
  type?: string;
}

interface ImageUploadProps {
  multiple?: boolean;
  base64URLValue?: string | string[]; // initial image(s)
  onChange?: (files: { base64: string; file: File }[]) => void;
  imageDetails?: ImageDetails[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  multiple = false,
  base64URLValue,
  onChange,
  imageDetails,
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    if (base64URLValue) {
      const initialFiles: UploadFile[] = (
        Array.isArray(base64URLValue) ? base64URLValue : [base64URLValue]
      ).map((src, index) => {
        const file: UploadFile = {
          uid: `-init-${index}`,
          name: `image-${index}`,
          status: 'done' as UploadFileStatus,
        };
        if (!src.startsWith('https://')) {
          file.thumbUrl = src;
        } else {
          file.url = src;
        }
        return file;
      });
      setFileList(initialFiles);
    }
  }, [base64URLValue]);

  const handlePreview = useCallback(
    async (file: UploadFile) => {
      if (!file.url && !file.preview) {
        const base64 = await getBase64(file.originFileObj as FileType);
        file.preview = base64;
      }
      setPreviewImage(file.url || (file.preview as string));
      setPreviewOpen(true);
    },
    [base64URLValue]
  );

  const handleChange: UploadProps['onChange'] = async (uploadChange: UploadChangeParam) => {
    const newFileList = uploadChange.fileList;
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

  const uploadButton = () => {
    const count = fileList.length;
    const details = imageDetails?.[count];
    return (
      <button style={{ border: 0, background: 'none' }} type="button">
        <PlusOutlined />
        <div style={{ marginTop: 0 }}>{`${details?.name || 'Upload'} `}</div>
      </button>
    );
  };

  return (
    <>
      <Upload
        // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        accept="image/jpeg,image/png,image/jpg"
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={(info) => {
          handleChange(info);
        }}
        beforeUpload={() => false} // prevents auto-upload
        multiple={multiple}
        pastable
      >
        {multiple
          ? fileList.length >= 8
            ? null
            : uploadButton()
          : fileList.length >= 1
          ? null
          : uploadButton()}
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

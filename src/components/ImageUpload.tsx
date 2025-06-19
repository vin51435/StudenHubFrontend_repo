import { FaPlus } from 'react-icons/fa6';
import { GetProp, UploadProps, UploadFile, Upload, Image, ImageProps, message, Button } from 'antd';
import { UploadFileStatus } from 'antd/es/upload/interface';
import React, { useState, useEffect, useCallback, useRef } from 'react';

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
  imageDetails?: ImageDetails[];
  maxCount?: number;
  uploadProps?: Omit<UploadProps, 'onChange'>;
  imagePreviewProps?: Omit<ImageProps, 'onChange'>;
  showImage?: boolean;
  uploadButtonNode?: React.ReactNode;
  onChange?: (files: { base64: string; file: File }[]) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  base64URLValue,
  imageDetails,
  multiple = false,
  maxCount = 1,
  showImage = true,
  uploadButtonNode,
  onChange,
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(showImage ? '' : null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const fileListRef = useRef<UploadFile[]>([]);

  useEffect(() => {
    fileListRef.current = fileList;
  }, [fileList]);

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
      if (showImage) {
        setPreviewImage(file.url || (file.preview as string));
      }
      setPreviewOpen(true);
    },
    [base64URLValue]
  );

  const handleChange: UploadProps['onChange'] = async (uploadChange) => {
    let newFiles = uploadChange.fileList.slice(0, maxCount); // enforce maxCount manually

    if (newFiles.length > maxCount) {
      message.warning(`You can only upload up to ${maxCount} image(s).`);
      newFiles = newFiles.slice(0, maxCount);
    }

    setFileList(newFiles);
    const result = await Promise.all(
      newFiles.map(async (file) => {
        let base64 = file.preview as string;
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
      <button
        className="flex flex-col items-center justify-center"
        style={{ border: 0, background: 'none' }}
        type="button"
      >
        <FaPlus />
        <div style={{ marginTop: 0 }}>{`${details?.name || 'Upload'} `}</div>
      </button>
    );
  };

  const maxImageReach = () => {
    message.warning(`You can only upload up to ${maxCount} image(s).`);
  };

  return (
    <>
      <Upload
        accept="image/jpeg,image/png,image/jpg"
        listType={uploadButtonNode ? 'text' : 'picture-card'}
        fileList={fileList}
        onPreview={uploadButtonNode ? undefined : handlePreview}
        onChange={handleChange}
        beforeUpload={(file, newFiles) => {
          const total = fileListRef.current.length + newFiles.length;
          if (total > maxCount) {
            maxImageReach();
            return Upload.LIST_IGNORE;
          }
          return false;
        }}
        multiple={multiple}
        pastable
        rootClassName="image-upload_root"
        className="image-upload"
      >
        {(!multiple && fileList.length >= 1) || fileList.length >= maxCount
          ? null
          : uploadButtonNode || uploadButton()}
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

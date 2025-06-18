import { IoIosClose } from 'react-icons/io';
import { IoMdSend } from 'react-icons/io';

import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import PostOp from '@src/api/postOperations';
import { ICommentData, IPostCommentDTO } from '@src/types/post.types';

interface CommentInputProps {
  postId: string;
  child: boolean;
  placeholder?: string;
  comment?: ICommentData;
  showEditorByDefault?: boolean;
  value?: string;
  postButtonLabel?: string | null;
  edit?: boolean;
  onCancel?: () => void;
  updateComment: (comment: ICommentData) => void;
}

const CommentInput: React.FC<CommentInputProps> = ({
  postId,
  child,
  placeholder = 'What are your thoughts?',
  comment,
  showEditorByDefault = false,
  value: defaultValue = '',
  postButtonLabel = null,
  edit = false,
  onCancel,
  updateComment,
}) => {
  const [value, setValue] = useState(defaultValue);
  const [showEditor, setShowEditor] = useState(showEditorByDefault);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue, edit]);

  const newComment = async (value: string) => {
    const data: IPostCommentDTO = { content: value };
    if (child && comment) {
      data.parentId = comment._id;
    }
    const res = await PostOp.postComment(postId, data);
    if (comment && updateComment && child) {
      comment.children = comment.children ?? [];
      comment.children.push(res.data);
      comment.childrenCount += 1;
      updateComment(comment);
    } else if (updateComment) {
      updateComment(res.data);
    }
    setValue('');
    setShowEditor(false);
  };

  const editComment = async (value: string) => {
    if (!comment) return;
    const updatedComment = { ...comment, content: value, updatedAt: `${new Date()}` };
    await PostOp.editComment(comment?._id!, value);
    updateComment(updatedComment);
    setValue('');
    setShowEditor(false);
  };

  const handleSubmit = async () => {
    if (!value.trim()) return;
    if (edit) {
      editComment(value);
    } else {
      newComment(value);
    }
  };

  const handleCancel = () => {
    setValue('');
    setShowEditor(false);
    onCancel?.();
  };

  return (
    <div className="comment_input bg-white border rounded-xl p-3 shadow-sm mt-2">
      {!showEditor ? (
        <div
          onClick={() => setShowEditor(true)}
          className="cursor-text text-gray-500 px-2 py-2  rounded"
        >
          {placeholder}
        </div>
      ) : (
        <>
          <ReactQuill
            theme="snow"
            value={value}
            onChange={setValue}
            placeholder={placeholder}
            className="mb-2"
          />
          <div className="flex justify-end gap-2 mt-2">
            <Button
              icon={<IoIosClose />}
              onClick={handleCancel}
              className="border-none text-gray-600 hover:text-gray-900"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              icon={<IoMdSend />}
              onClick={handleSubmit}
              disabled={!value.trim()}
            >
              {postButtonLabel || 'Comment'}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default CommentInput;

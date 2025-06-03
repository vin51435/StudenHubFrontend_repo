import React, { useState } from 'react';
import { Button, Space, Tooltip } from 'antd';
import {
  MessageOutlined,
  DownOutlined,
  UpOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { ICommentData } from '@src/types/post.types';
import CommentInput from '@src/components/CommentInput';
import { useSelector } from 'react-redux';
import { RootState } from '@src/redux/store';
import VoteIcon from '@src/components/Vote.svg';
import { post } from '@src/libs/apiConfig';
import { VoteEnum } from '@src/types/enum';
import { IUser } from '@src/types/app';
import PostOp from '@src/api/postOperations';

interface CommentProps {
  comment: ICommentData;
  activeComment: string;
  showDelete?: boolean;
  showEdit?: boolean;
  user?: IUser;
  editActive?: boolean;
  handleVote: (comment: ICommentData, type: 1 | -1) => void;
  setEditActive?: React.Dispatch<React.SetStateAction<boolean>>;
  deleteComment?: (comment: ICommentData) => void;
  lastComment?: (comment: ICommentData) => void;
  updateComment: (comment: ICommentData) => void;
  setActiveComment: React.Dispatch<React.SetStateAction<string>>;
  depth?: number;
}

const Comment: React.FC<CommentProps> = ({
  comment,
  depth = 0,
  activeComment,
  showEdit = false,
  showDelete = false,
  user,
  editActive = false,
  handleVote,
  setEditActive,
  deleteComment,
  lastComment,
  setActiveComment,
  updateComment,
}) => {
  const toggleCommentCollapse = () => {
    updateComment?.({
      ...comment,
      isCollapsed: !comment.isCollapsed || false,
    });
  };

  const ChildComments = () => {
    if (comment.isCollapsed) return;
    if (comment.childrenCount > 0 && !comment.children) {
      lastComment?.(comment);
      return;
    }
    if (!comment.isCollapsed && comment.children) {
      return (
        <div className="mt-2">
          {comment.children.map((child) => (
            <Comment
              key={child._id}
              user={user}
              comment={child}
              depth={depth + 1}
              handleVote={handleVote}
              setEditActive={setEditActive}
              activeComment={activeComment}
              showDelete={child.userId === user?._id}
              showEdit={child.userId === user?._id}
              editActive={child.userId === user?._id}
              deleteComment={deleteComment}
              setActiveComment={setActiveComment}
              updateComment={updateComment}
            />
          ))}
        </div>
      );
    }
  };

  return (
    <div className={`pl-${depth * 4} border-l border-gray-200 ml-4 my-3`}>
      <div className="flex flex-col-reverse items-start">
        <div className="flex items-center mt-1"></div>
        <div className="flex-1">
          {!comment.isDeleted ? (
            <div className="p-2 rounded-md">
              <div
                className="text-sm"
                dangerouslySetInnerHTML={{ __html: comment.content ?? '' }}
              />
              <div className="flex items-center gap-2 mt-2">
                <Space className="float-right">
                  <div className="flex items-center ">
                    <Button
                      type="text"
                      className="dark:text-white"
                      icon={
                        <VoteIcon
                          dir="up"
                          className={`text-gray-400 ${
                            comment?.voteType === VoteEnum.upVote && 'text-orange-500'
                          }
                            `}
                        />
                      }
                      onClick={() => handleVote(comment, 1)}
                    />
                    <span className="text-xs text-gray-600">
                      {comment.upvotesCount - comment.downvotesCount}
                    </span>
                  </div>
                  <Button
                    type="text"
                    className="dark:text-white"
                    icon={
                      <VoteIcon
                        dir="down"
                        className={`text-gray-400 ${
                          comment?.voteType === VoteEnum.downVote && 'text-purple-500'
                        }
                           `}
                      />
                    }
                    onClick={() => handleVote(comment, -1)}
                  />
                  {showEdit && (
                    <Button
                      type="text"
                      size="small"
                      className="dark:text-white"
                      icon={<EditOutlined />}
                      onClick={() => {
                        setActiveComment(comment._id);
                        setEditActive?.(true);
                      }}
                    />
                  )}
                  {showDelete && (
                    <Button
                      type="text"
                      size="small"
                      className="dark:text-white"
                      icon={<DeleteOutlined />}
                      onClick={() => deleteComment?.(comment)}
                    />
                  )}
                  <div className="flex gap-3 text-xs text-gray-500">
                    <button
                      onClick={() =>
                        setActiveComment((prev) => (comment._id === prev ? '' : comment._id))
                      }
                      className="hover:underline"
                    >
                      <MessageOutlined /> Reply
                    </button>
                    {comment.childrenCount > 0 && (
                      <button onClick={() => toggleCommentCollapse()} className="hover:underline">
                        {comment.isCollapsed ? <DownOutlined /> : <UpOutlined />}{' '}
                        {comment.isCollapsed ? 'Expand' : 'Collapse'} {comment.childrenCount}{' '}
                        replies
                      </button>
                    )}
                  </div>
                </Space>
              </div>
              {activeComment === comment._id && (
                <CommentInput
                  postId={comment.postId}
                  comment={comment}
                  child
                  edit={editActive && comment.userId === user?._id}
                  value={editActive ? comment.content ?? '' : ''}
                  postButtonLabel={editActive ? 'Save' : 'Reply'}
                  showEditorByDefault={true}
                  onCancel={() => setActiveComment('')}
                  updateComment={updateComment}
                />
              )}
            </div>
          ) : (
            <div className="text-gray-400 italic ml-2">[deleted]</div>
          )}
        </div>
      </div>
      <ChildComments />
    </div>
  );
};

interface CommentSectionProps {
  comments: ICommentData[];
  updateComment: (comment: ICommentData) => void;
  deleteComment?: (comment: ICommentData) => void;
  fetchComments?: (commentId: string | null, page: number) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  fetchComments,
  updateComment,
  deleteComment,
}) => {
  const [commentMeta, setCommentMeta] = useState<{ id: string; page: number; hasMore: boolean }[]>([
    { id: comments[0]._id, page: 1, hasMore: true },
  ]);
  const [activeComment, setActiveComment] = useState<string>('');
  const [editActive, setEditActive] = useState<boolean>(false);
  const { user } = useSelector((state: RootState) => state.auth);

  async function handleVote(comment: ICommentData, type: 1 | -1) {
    await PostOp.toggleCommentVote(comment._id, type);

    let vote: VoteEnum | null = comment?.voteType ?? null;
    let upVote = comment?.upvotesCount;
    let downVote = comment?.downvotesCount;

    const isUp = type === 1;
    const isDown = type === -1;

    if (isUp && comment?.voteType === VoteEnum.upVote) {
      upVote -= 1;
      vote = null;
    } else if (isDown && comment?.voteType === VoteEnum.downVote) {
      downVote -= 1;
      vote = null;
    } else {
      if (isUp) {
        upVote += 1;
        if (comment?.voteType === VoteEnum.downVote) {
          downVote -= 1;
        }
        vote = VoteEnum.upVote;
      } else {
        downVote += 1;
        if (comment?.voteType === VoteEnum.upVote) {
          upVote -= 1;
        }
        vote = VoteEnum.downVote;
      }
    }
    const updatedComment = {
      ...comment,
      upvotesCount: upVote,
      downvotesCount: downVote,
      voteType: vote,
    };
    console.log('updated comment', updatedComment);
    updateComment(updatedComment);
  }

  function updateMeta(id: string) {}

  return (
    <div className="mt-6">
      {comments.map((comment) => (
        <Comment
          key={comment._id}
          showDelete={user?._id === comment.userId}
          showEdit={user?._id === comment.userId}
          user={user!}
          deleteComment={deleteComment}
          editActive={editActive}
          setEditActive={setEditActive}
          handleVote={handleVote}
          comment={comment}
          updateComment={updateComment}
          activeComment={activeComment}
          setActiveComment={setActiveComment}
        />
      ))}
    </div>
  );
};

export default CommentSection;

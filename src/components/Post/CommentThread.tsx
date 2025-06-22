import { BiSolidUpvote, BiUpvote, BiDownvote, BiSolidDownvote } from 'react-icons/bi';
import { MdEdit, MdOutlineReply, MdDelete } from 'react-icons/md';
import { IoIosArrowBack, IoIosArrowDown } from 'react-icons/io';
import React, { useState } from 'react';
import { Avatar, Space } from 'antd';
import { ICommentData } from '@src/types/post.types';
import CommentInput from '@src/components/CommentInput';
import { useSelector } from 'react-redux';
import { RootState } from '@src/redux/store';
import { VoteEnum } from '@src/types/enum';
import { IUser } from '@src/types/app';
import PostOp from '@src/api/postOperations';
import DefaultAvatar from '/profile-default.svg';
import { Link } from 'react-router-dom';
import { getRoutePath } from '@src/utils/getRoutePath';

interface CommentProps {
  comment: ICommentData;
  activeComment: string;
  showDelete?: boolean;
  showEdit?: boolean;
  user?: IUser;
  editActive?: boolean;
  handleVote: (comment: ICommentData, type: 1 | -1) => void;
  setEditActive: React.Dispatch<React.SetStateAction<boolean>>;
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
  if (comment.childrenCount > 0 && !!!comment?.children?.length) {
    comment.isCollapsed = true;
  }

  const toggleCommentCollapse = () => {
    // If the comment is collapsed and has no fetched children element but has children count
    if (comment.isCollapsed && comment.childrenCount > 0 && !!!comment?.children?.length) {
      lastComment?.(comment);
    }

    updateComment?.({
      ...comment,
      isCollapsed: !comment.isCollapsed || false,
    });
  };

  const ChildComments = () => {
    if (comment.isCollapsed) return;
    if (!comment.isCollapsed && comment.children) {
      return (
        <div className="mt-2">
          {comment.children.map((child) => (
            <Comment
              key={child._id}
              user={user}
              comment={child}
              depth={depth + 1}
              activeComment={activeComment}
              showDelete={child.userId._id === user?._id}
              showEdit={child.userId._id === user?._id}
              editActive={editActive}
              lastComment={lastComment}
              handleVote={handleVote}
              setEditActive={setEditActive}
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
              <Link
                to={
                  comment?.userId?.username
                    ? getRoutePath('USER_PROFILE').replace(':username', comment.userId.username)
                    : '#'
                }
                onClick={(e) => {
                  if (!comment?.userId?.username) e.preventDefault();
                }}
                className={`flex items-center gap-1 text-inherit${
                  comment?.userId?.username
                    ? 'cursor-pointer'
                    : 'cursor-not-allowed opacity-50 pointer-events-none'
                }`}
              >
                <Avatar
                  size="small"
                  src={comment?.userId?.profilePicture ?? DefaultAvatar}
                  className="shrink-0"
                />{' '}
                <p className="ml-2 text-sm font-semibold">
                  {comment?.userId?.username ? (
                    `u/${comment.userId.fullName}`
                  ) : (
                    <span className="text-red-500 italic">u/Deleted</span>
                  )}
                </p>
              </Link>
              <div
                className="text-sm"
                dangerouslySetInnerHTML={{ __html: comment.content ?? '' }}
              />
              <div className="flex items-center gap-2 mt-2">
                <Space className="float-right">
                  <div className="flex">
                    {comment.voteType === VoteEnum.upVote ? (
                      <BiSolidUpvote
                        className=" text-orange-700 flex items-center cursor-pointer"
                        size={18}
                        onClick={() => handleVote(comment, 1)}
                      />
                    ) : (
                      <BiUpvote
                        className=" flex items-center cursor-pointer"
                        size={18}
                        onClick={() => handleVote(comment, 1)}
                      />
                    )}
                    <span className="text-xs pl-1 text-gray-600">
                      {comment.upvotesCount - comment.downvotesCount}
                    </span>
                  </div>
                  {comment.voteType === VoteEnum.downVote ? (
                    <BiSolidDownvote
                      className="text-blue-400  flex items-center cursor-pointer"
                      size={18}
                      onClick={() => handleVote(comment, -1)}
                    />
                  ) : (
                    <BiDownvote
                      className=" flex items-center cursor-pointer"
                      size={18}
                      onClick={() => handleVote(comment, -1)}
                    />
                  )}
                  {showEdit && (
                    <MdEdit
                      size={18}
                      className="dark:text-white ml-3 flex items-center cursor-pointer"
                      onClick={() => {
                        setEditActive(true);
                        setActiveComment(comment._id);
                      }}
                    />
                  )}
                  {showDelete && (
                    <MdDelete
                      size={18}
                      className="dark:text-white ml-3 flex items-center cursor-pointer"
                      onClick={() => deleteComment?.(comment)}
                    />
                  )}
                  <div className="flex gap-3 text-xs text-gray-500">
                    <MdOutlineReply
                      size={18}
                      onClick={() => {
                        setEditActive(false);
                        setActiveComment(comment._id);
                      }}
                      className="hover:underline ml-3 flex items-center cursor-pointer"
                    />
                    {comment.childrenCount > 0 && (
                      <button
                        onClick={() => toggleCommentCollapse()}
                        className="hover:underline flex items-center cursor-pointer"
                      >
                        {comment.isCollapsed ? <IoIosArrowDown /> : <IoIosArrowBack />}{' '}
                        {comment.isCollapsed ? 'Expand' : 'Collapse'}{' '}
                        {comment.isCollapsed && `${comment.childrenCount} replies`}
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
                  edit={editActive && comment.userId._id === user?._id}
                  value={editActive ? comment?.content ?? '' : ''}
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
  lastComment?: (comment: ICommentData) => void;
  fetchComments?: (commentId: string | null, page: number) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  fetchComments,
  updateComment,
  deleteComment,
  lastComment,
}) => {
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
    updateComment(updatedComment);
  }

  function commentUpdated(comment: ICommentData) {
    setActiveComment('');
    setEditActive(false);
    updateComment(comment);
  }

  return (
    <div className="mt-6">
      {comments.map((comment) => (
        <Comment
          key={comment._id}
          showDelete={user?._id === comment.userId._id}
          showEdit={user?._id === comment.userId._id}
          user={user!}
          editActive={editActive}
          comment={comment}
          activeComment={activeComment}
          lastComment={lastComment}
          deleteComment={deleteComment}
          updateComment={commentUpdated}
          setEditActive={setEditActive}
          handleVote={handleVote}
          setActiveComment={setActiveComment}
        />
      ))}
    </div>
  );
};

export default CommentSection;

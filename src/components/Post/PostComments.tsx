import PostOp from '@src/api/postOperations';
import CommentInput from '@src/components/CommentInput';
import CommentSection from '@src/components/Post/CommentThread';
import { useAppSelector } from '@src/redux/hook';
import { CommentSortMethod, ICommentData } from '@src/types/post.types';
import { updateNestedArrayById } from '@src/utils/common';
import { Typography, Select } from 'antd';
import { useEffect, useState } from 'react';

const PostComments = ({ postId }: { postId: string }) => {
  const [comments, setComments] = useState<ICommentData[]>([]);
  const [sort, setSort] = useState<CommentSortMethod>(CommentSortMethod.Votes);
  const [loading, setLoading] = useState(true);
  const user = useAppSelector(state => state.auth.user)!;

  useEffect(() => {
    setLoading(true);
    fetchComments();
  }, [sort]);

  async function fetchComments(commentId: string | null = null, page: number = 1) {
    const res = await PostOp.fetchComment(postId!, commentId, { sortMethod: sort });
    if (commentId) {
      updateComment(res.data as ICommentData);
    } else {
      setComments((res.data as ICommentData[]) ?? []);
    }
    setLoading(false);
  }

  function updateComment(comment: ICommentData) {
    const updatedComments = updateNestedArrayById<ICommentData>(
      comments,
      '_id',
      comment._id,
      () => comment,
      'children'
    );
    if (!updatedComments && comment) {
      const newComment :ICommentData={
        ...comment,
        userId:user
      }
      setComments((prev) => [newComment, ...prev]);
      return;
    } else if (updatedComments) {
      setComments(updatedComments);
    }
  }

  async function lastComment(comment: ICommentData) {
    await fetchComments(comment._id);
  }

  async function deleteComment(comment: ICommentData) {
    await PostOp.deleteComment(comment._id);
    const updatedParentComments: ICommentData = {
      ...comment,
      content: '<p><i>[Deleted]</i></p>',
      isDeleted: true,
    };
    const updatedComments = updateNestedArrayById(
      comments,
      '_id',
      comment?._id,
      () => updatedParentComments,
      'children'
    );

    if (updatedComments) {
      setComments(updatedComments);
    }
  }

  return (
    <div>
      <div className="flex items-center mb-3">
        <Typography.Text>Sort by:</Typography.Text>
        <Select
          className="!ml-2 !w-fit"
          defaultValue={sort}
          style={{ width: 120 }}
          onChange={(value: string) => {
            setSort(value as CommentSortMethod);
          }}
        >
          <Select.Option value={CommentSortMethod.Votes}>{CommentSortMethod.Votes}</Select.Option>
          <Select.Option value={CommentSortMethod.Date}>{CommentSortMethod.Date}</Select.Option>
        </Select>
      </div>
      <CommentInput postId={postId} child={false} updateComment={updateComment} />
      {loading ? (
        <div>Loading comments...</div>
      ) : (
        <CommentSection
          comments={comments}
          updateComment={updateComment}
          deleteComment={deleteComment}
          lastComment={lastComment}
          fetchComments={fetchComments}
        />
      )}
    </div>
  );
};

export default PostComments;

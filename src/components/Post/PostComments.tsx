import PostOp from '@src/api/postOperations';
import CommentInput from '@src/components/CommentInput';
import CommentSection from '@src/components/Post/CommentThread';
import { CommentSortMethod, ICommentData } from '@src/types/post.types';
import { updateNestedArrayById } from '@src/utils/common';
import { Typography, Select } from 'antd';
import { useEffect, useState } from 'react';

const PostComments = ({ postId }: { postId: string }) => {
  const [comments, setComments] = useState<ICommentData[]>([]);
  const [sort, setSort] = useState<CommentSortMethod>(CommentSortMethod.Votes);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchComments();
  }, [sort]);

  async function fetchComments(commentId: string | null = null, page: number = 1) {
    const res = await PostOp.fetchComment(postId!, commentId, { sortMethod: sort });
    if (commentId) {
    } else {
      setComments(res.data ?? []);
    }
    setLoading(false);
  }

  function updateComment(comment: ICommentData) {
    const updatedComments = updateNestedArrayById(
      comments,
      '_id',
      comment._id,
      () => comment,
      'children'
    );
    if (!updatedComments && comment) {
      setComments((prev) => [comment, ...prev]);
      return;
    } else if (updatedComments) {
      setComments(updatedComments);
    }
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
      <div className="flex justify-between items-center mb-3">
        <Typography.Text>Sort by:</Typography.Text>
        <Select
          defaultValue={sort}
          style={{ width: 120 }}
          onChange={(value) => {
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
          fetchComments={fetchComments}
        />
      )}
    </div>
  );
};

export default PostComments;

import UserOp from '@src/api/userOperations';
import CommentOverviewItem, {
  CommentOverviewItemProps,
} from '@src/components/Post/CommentOverview';
import PostOverview from '@src/components/Post/PostOverview';
import { IPaginatedResponseData } from '@src/types';
import { IPost } from '@src/types/app';
import { ICommentData } from '@src/types/post.types';
import { Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

interface DisplayProfileContentsProps {
  type: 'overview' | 'posts' | 'comments' | 'saved' | 'upvoted' | 'downvoted';
  userId?: string;
}

type OverviewData = IPost | ICommentData;

async function fetchData(
  type: DisplayProfileContentsProps['type'],
  userId?: string,
  page: number = 1
): Promise<
  | IPaginatedResponseData<IPost>
  | IPaginatedResponseData<ICommentData>
  | IPaginatedResponseData<OverviewData>
  | null
> {
  if (type === 'overview') {
    const post = UserOp.getPosts(page, userId);
    const comments = UserOp.getComments(page);

    const [postResponse, commentsResponse] = await Promise.all([post, comments]);
    const data = [...postResponse.data, ...commentsResponse.data].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const returnData: IPaginatedResponseData<OverviewData> = {
      data: data as unknown as OverviewData[],
      totalItems: postResponse.totalItems + commentsResponse.totalItems,
      totalPages: Math.max(postResponse.totalPages, commentsResponse.totalPages),
      currentPage: Math.max(postResponse.currentPage, commentsResponse.currentPage),
      pageSize: Math.max(postResponse.pageSize, commentsResponse.pageSize),
      hasMore: postResponse.hasMore || commentsResponse.hasMore,
    };

    return returnData;
  } else if (type === 'posts') {
    const paginatedPosts = await UserOp.getPosts(page, userId);
    return paginatedPosts;
  } else if (type === 'comments') {
    const paginatedComments = await UserOp.getComments(page, userId);
    return paginatedComments;
  } else if (type === 'saved') {
    const paginatedSavedPosts = await UserOp.getSavedPosts(page);
    return paginatedSavedPosts;
  } else if (type === 'upvoted') {
    const paginatedUpvotedPosts = await UserOp.getUpvotedPosts(page);
    return paginatedUpvotedPosts;
  } else if (type === 'downvoted') {
    const paginatedDownvotedPosts = await UserOp.getDownvotedPosts(page);
    return paginatedDownvotedPosts;
  } else {
    return null;
  }
}

const DisplayProfileContents: React.FC<DisplayProfileContentsProps> = ({
  type = 'overview',
  userId,
}) => {
  const [data, setData] = useState<
    Record<
      DisplayProfileContentsProps['type'],
      | IPaginatedResponseData<IPost>
      | IPaginatedResponseData<ICommentData>
      | IPaginatedResponseData<OverviewData>
    >
  >(
    {} as Record<
      DisplayProfileContentsProps['type'],
      | IPaginatedResponseData<IPost>
      | IPaginatedResponseData<ICommentData>
      | IPaginatedResponseData<OverviewData>
    >
  );
  const [loading, setLoading] = useState(false);
  const { ref, inView } = useInView();

  useEffect(() => {
    if (!data?.[type]) {
      setLoading(true);
      fetchData(type, userId)
        .then((res) => {
          console.log(res);
          return res;
        })
        .then((res) => setData((prev) => ({ ...prev, [type]: res })))
        .finally(() => setLoading(false));
    }
  }, [userId]);

  useEffect(() => {
    if (inView && data[type].hasMore) {
      fetchData(type, userId, data[type].currentPage + 1)
        .then((res) => {
          console.log(res);
          return res;
        })
        .then((res) =>
          setData((prev) => ({
            ...prev,
            [type]: { res, data: [...prev[type].data, ...(res?.data ?? [])] },
          }))
        );
    }
  }, [inView]);

  function onDataChange(data: IPost | ICommentData) {
    setData((prev) => {
      const updatedData = prev[type]?.data.map((item) => {
        if (item._id === data._id) {
          return data;
        }
        return item;
      });
      return {
        ...prev,
        [type]: {
          ...prev[type],
          data: updatedData,
        },
      };
    });
  }

  return (
    <section>
      {loading ? (
        <div className="flex h-full items-center justify-center">
          <Spin size="large" />
        </div>
      ) : data[type]?.data.length > 0 ? (
        <div className="flex flex-col gap-4">
          {data[type]?.data.map((commentOrPost, i) => (
            <div key={i}>
              {(commentOrPost as ICommentData)?.postId ? (
                <CommentOverviewItem
                  comment={commentOrPost as unknown as CommentOverviewItemProps['comment']}
                />
              ) : (
                <PostOverview
                  post={commentOrPost as IPost}
                  onChangePost={onDataChange}
                  view={false}
                />
              )}
            </div>
          ))}
          {data[type]?.hasMore && (
            <div ref={ref} className="flex h-full items-center justify-center">
              <Spin size="large" />
            </div>
          )}
        </div>
      ) : (
        <div className="flex h-full items-center justify-center">
          <h1>No data found</h1>
        </div>
      )}
    </section>
  );
};

export default DisplayProfileContents;

import React, { useEffect, useState } from 'react';
import { Button, Carousel, Divider, Typography, Row, Col, Image, Popconfirm } from 'antd';
import { FaRegBookmark, FaBookmark } from 'react-icons/fa';
import { IoIosArrowBack } from 'react-icons/io';
import { LuMessageSquareText } from 'react-icons/lu';
import { MdDelete, MdEdit } from 'react-icons/md';
import { VoteEnum } from '@src/types/enum';
import { ICommunity, IPost, IUser } from '@src/types/app';
import { useNavigate, useParams } from 'react-router-dom';
import PostOp from '@src/api/postOperations';
import { useLoader } from '@src/hooks/useLoader';
import Communitysidebar from '@src/components/Community/Community.sidebar';
import { BiSolidUpvote, BiUpvote, BiDownvote, BiSolidDownvote } from 'react-icons/bi';
import PostComments from '@src/components/Post/PostComments';
import { useAppDispatch, useAppSelector } from '@src/redux/hook';
import { appendRecentPost } from '@src/redux/reducers/cache/recents.slice';
import { timeAgo } from '@src/utils/common';
import { getRoutePath } from '@src/utils/getRoutePath';
import { clearPosts } from '@src/redux/reducers/cache/post.slice';

const { Title, Paragraph, Text } = Typography;

const PostDetailPage: React.FC = () => {
  const [post, setPost] = useState<IPost | null>(null);
  const [load, setLoad] = useState(true);
  const user = useAppSelector((state) => state.auth.user);

  const dispatch = useAppDispatch();
  const { slug: communitySlug, postSlug } = useParams();
  const navigate = useNavigate();
  const { startPageLoad, stopPageLoad } = useLoader();

  useEffect(() => {
    startPageLoad();
    (async () => {
      if (communitySlug && postSlug) {
        setLoad(true);
        const res = await PostOp.fetchPost(postSlug, communitySlug);
        setPost(res?.data ?? null);
        setLoad(false);
      }
    })();
    stopPageLoad();
  }, [communitySlug, postSlug]);

  useEffect(() => {
    saveToRecentPosts();
    if (!load && post) {
      // Wait for DOM and media to settle before scrolling
      const timeout = setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'instant' }); // or 'smooth'
      }, 50); // allow slight delay for layout

      return () => clearTimeout(timeout);
    }
  }, [load, post]);

  function saveToRecentPosts() {
    if (post) {
      dispatch(appendRecentPost(post));
    }
  }

  if (!communitySlug || !postSlug || load || !post) {
    return null;
  }

  const handleVote = async (type: 1 | -1) => {
    void PostOp.voteToggle(post._id!, type === 1 ? VoteEnum.upVote : VoteEnum.downVote);

    let vote: VoteEnum | null = post.voteType ?? null;
    let upVote = post.upvotesCount;
    let downVote = post.downvotesCount;
    let netVotes = post.netVotes ?? upVote - downVote;

    const isUp = type === 1;
    const isDown = type === -1;

    if (isUp && post.voteType === VoteEnum.upVote) {
      upVote -= 1;
      netVotes -= 1;
      vote = null;
    } else if (isDown && post.voteType === VoteEnum.downVote) {
      downVote -= 1;
      netVotes += 1;
      vote = null;
    } else {
      if (isUp) {
        upVote += 1;
        netVotes += 1;
        if (post.voteType === VoteEnum.downVote) {
          downVote -= 1;
          netVotes += 1;
        }
        vote = VoteEnum.upVote;
      } else {
        downVote += 1;
        netVotes -= 1;
        if (post.voteType === VoteEnum.upVote) {
          upVote -= 1;
          netVotes -= 1;
        }
        vote = VoteEnum.downVote;
      }
    }

    const updatedPost = {
      ...post,
      upvotesCount: upVote,
      downvotesCount: downVote,
      netVotes,
      voteType: vote,
    };

    setPost(updatedPost);
  };

  const deletePost = async () => {
    await PostOp.deletePost(post._id!, communitySlug);
    dispatch(clearPosts(post._id));
    navigate(getRoutePath('APP'));
  };

  const handleCommunityUpdate = (community: ICommunity) => {
    setPost(
      (prev) =>
        ({
          ...prev,
          community,
        } as IPost)
    );
  };

  const handlePostSave = async () => {
    if (!post._id) return;
    await PostOp._savePostToggle(post._id!);
    setPost(
      (prev) =>
        ({
          ...prev,
          isSaved: prev?.isSaved ?? true,
        } as IPost)
    );
  };

  return (
    <Row
      gutter={[18, 18]}
      className="post-detail_container flex flex-col items-start h-auto min-h-full w-full mx-auto  space-y-6 shadow-md rounded-xl text-start p-6"
    >
      <Col span={24} md={17} className="">
        {!load && !post ? (
          <div className="text-center">
            <h1 className="text-2xl font-bold">Post not found</h1>
          </div>
        ) : (
          <>
            {/* Header: Back, Community + Author */}
            <div className="flex justify-between">
              <div className="flex items-center gap-3 mb-2">
                <Button
                  shape="circle"
                  icon={<IoIosArrowBack />}
                  onClick={() => {
                    // navigate(getRoutePath('COMMUNITY').replace(':slug', communitySlug));
                    navigate(-1);
                  }}
                />
                <div
                  className="cursor-pointer flex flex-col"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!(post?.authorId as IUser)?.username) return;
                    navigate(
                      getRoutePath('USER_PROFILE').replace(
                        ':username',
                        (post?.authorId as IUser)?.username
                      )
                    );
                  }}
                >
                  <Text className="text-gray-500 text-sm">
                    u/{(post?.authorId as IUser)?.username ?? '[Deleted]'}
                  </Text>
                  <span className="text-xs text-gray-400">{timeAgo(post?.createdAt!)}</span>
                </div>
              </div>
              {user?._id === (post?.authorId as IUser)?._id && (
                <div className="flex gap-2">
                  <Popconfirm
                    title="Are you sure to delete this post?"
                    onConfirm={deletePost}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button
                      className="!border-0 !text-2xl !text-red-500"
                      shape="circle"
                      icon={<MdDelete className="text-red-500" />}
                    />
                  </Popconfirm>
                  <Button
                    className="!border-0 !text-2xl !text-blue-500"
                    shape="circle"
                    icon={<MdEdit className="text-blue-500" />}
                    onClick={() => navigate(`/edit/${post?._id}`)}
                  />
                </div>
              )}
            </div>

            {/* Title */}
            <Title level={4} className="!mb-0.5">
              {post?.title}
            </Title>

            {/* Content */}
            {post?.content && (
              <Paragraph className="text-gray-800">
                {' '}
                <div dangerouslySetInnerHTML={{ __html: post.content as string }} />
              </Paragraph>
            )}

            {/* Media Carousel */}
            <Carousel
              arrows
              infinite={false}
              className="w-full h-full rounded-lg my-4"
              dots={{ className: 'carousel-dots-dark' }}
            >
              {post?.mediaUrls.map((url, index) => (
                <div
                  key={index}
                  className="relative w-full aspect-video !flex items-center justify-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Image
                    src={url}
                    alt={`Media ${index + 1}`}
                    preview={{
                      toolbarRender: () => null,
                      mask: <span className=""></span>,
                    }}
                    className="w-full h-full object-contain"
                  />
                </div>
              ))}
            </Carousel>

            {/* Voting Section */}
            <div className="flex flex-row justify-between items-center text-lg">
              <div className="flex items-center gap-6 text-gray-500">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-lg">
                    {post.voteType === VoteEnum.upVote ? (
                      <BiSolidUpvote
                        onClick={() => handleVote(1)}
                        className="cursor-pointer text-orange-700"
                        size={18}
                      />
                    ) : (
                      <BiUpvote
                        onClick={() => handleVote(1)}
                        className="cursor-pointer"
                        size={18}
                      />
                    )}

                    {post.netVotes ?? post.upvotesCount - post.downvotesCount}

                    {post.voteType === VoteEnum.downVote ? (
                      <BiSolidDownvote
                        onClick={() => handleVote(-1)}
                        className="cursor-pointer ml-2 text-purple-500"
                        size={18}
                      />
                    ) : (
                      <BiDownvote
                        onClick={() => handleVote(-1)}
                        className="cursor-pointer ml-2"
                        size={18}
                      />
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <LuMessageSquareText size={18} /> <span>{post?.commentsCount} Comments</span>
                </div>
              </div>
              <div>
                {post?.isSaved ? (
                  <FaBookmark size={18} className={`text-blue-400 `} />
                ) : (
                  <FaRegBookmark size={18} onClick={handlePostSave} className={``} />
                )}
              </div>
            </div>

            <Divider />

            {/* Comments Section */}
            <div>
              <Title level={5}>Comments</Title>
              <PostComments postId={post?._id!} />
            </div>
          </>
        )}
      </Col>
      <Col span={0} md={7} className="">
        <Communitysidebar
          community={post?.communityId as ICommunity}
          allDetails
          onCommunityChange={handleCommunityUpdate}
        />
      </Col>
    </Row>
  );
};

export default PostDetailPage;

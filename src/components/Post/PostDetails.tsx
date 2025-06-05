import React, { useEffect, useState } from 'react';
import { Button, Carousel, Divider, Typography, Avatar, Row, Col, Image } from 'antd';
import {
  ArrowLeftOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  MessageOutlined,
} from '@ant-design/icons';
import { ICommunity, IPost } from '@src/types/app';
import { VoteEnum } from '@src/types/enum';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import PostOp from '@src/api/postOperations';
import { getRoutePath } from '@src/utils/getRoutePath';
import { useLoader } from '@src/hooks/useLoader';
import Communitysidebar from '@src/components/Community/Community.sidebar';
import VoteIcon from '@src/components/Vote.svg';
import CommentInput from '@src/components/CommentInput';
import PostComments from '@src/components/Post/PostComments';

const { Title, Paragraph, Text } = Typography;

const PostDetailPage: React.FC = () => {
  const [post, setPost] = useState<IPost | null>(null);
  const [load, setLoad] = useState(true);

  const { slug: communitySlug, postSlug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
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
    if (!load && post) {
      // Wait for DOM and media to settle before scrolling
      const timeout = setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'instant' }); // or 'smooth'
      }, 50); // allow slight delay for layout

      return () => clearTimeout(timeout);
    }
  }, [load, post]);

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

  const handleCommunityUpdate = (community: ICommunity) => {
    setPost(
      (prev) =>
        ({
          ...prev,
          community,
        } as IPost)
    );
  };

  return (
    <Row
      gutter={[18, 18]}
      className="post-detail_container flex flex-col items-start h-auto w-full mx-auto  space-y-6 bg-white shadow-md rounded-xl text-start p-6"
    >
      <Col span={24} md={17} className="">
        {!load && !post ? (
          <div className="text-center">
            <h1 className="text-2xl font-bold">Post not found</h1>
          </div>
        ) : (
          <>
            {/* Header: Back, Community + Author */}
            <div className="flex items-center gap-3 mb-2">
              <Button
                shape="circle"
                icon={<ArrowLeftOutlined />}
                onClick={() => {
                  // navigate(getRoutePath('COMMUNITY').replace(':slug', communitySlug));
                  navigate(-1);
                }}
              />
              <div>
                <Text className="text-gray-500 text-sm">
                  <span className="font-medium">u/{post?.author?.username ?? '[Deleted]'}</span>
                </Text>
                <div className="text-xs text-gray-400">
                  {new Date(post?.createdAt!).toLocaleString()}
                </div>
              </div>
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
                    preview={false}
                    className="w-full h-full object-contain"
                  />
                </div>
              ))}
            </Carousel>

            {/* Voting Section */}
            <div className="flex items-center gap-6 text-gray-500">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-sm">
                  <VoteIcon
                    dir="up"
                    onClick={() => handleVote(1)}
                    className={`cursor-pointer text-gray-400 ${
                      post?.voteType === VoteEnum.upVote && 'text-orange-700'
                    }`}
                  />
                  {post?.netVotes ?? post?.upvotesCount - post?.downvotesCount}
                  <VoteIcon
                    dir="down"
                    onClick={() => handleVote(-1)}
                    className={`cursor-pointer ml-2 text-gray-400 ${
                      post?.voteType === VoteEnum.downVote && 'text-purple-500'
                    }`}
                  />
                </span>
              </div>
              <div className="flex items-center gap-1">
                <MessageOutlined />
                <span>{post?.commentsCount} Comments</span>
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
          community={post?.community as ICommunity}
          allDetails
          onCommunityChange={handleCommunityUpdate}
        />
      </Col>
    </Row>
  );
};

export default PostDetailPage;

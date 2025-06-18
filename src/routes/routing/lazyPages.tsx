import { lazy } from 'react';

export const Login = lazy(() => import('@src/pages/Auth/Login'));
export const Signup = lazy(() => import('@src/pages/Auth/Signup'));
export const ResetPassword = lazy(() => import('@src/pages/Auth/ResetPassword'));
export const SignupAddDetails = lazy(() => import('@src/pages/Auth/SignupDetails'));
export const SignupInterests = lazy(() => import('@src/pages/Auth/SignupInterest'));
export const Home = lazy(() => import('@src/pages/Home'));
export const Chats = lazy(() => import('@src/pages/Chats'));
export const Community = lazy(() => import('@src/pages/Community'));
export const CreatePost = lazy(() => import('@src/components/Post/CreatePost'));
export const PostDetailPage = lazy(() => import('@src/components/Post/PostDetails'));
export const Popular = lazy(() => import('@src/pages/Popular/Index'));
export const Profile = lazy(() => import('@src/pages/User/Profile'));
export const Settings = lazy(() => import('@src/pages/User/settings'));
export const NotFoundPage = lazy(() => import('@src/pages/NotFound'));

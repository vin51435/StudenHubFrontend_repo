import { deleteResource, get, post } from '@src/libs/apiConfig';
import { ADMIN_ENDPOINTS } from '@src/libs/apiEndpoints';
import { IPaginatedResponse } from '@src/types';
import { ICommunity, IPost, IUser, LogEntry } from '@src/types/app';

class AdminOp {
  // ✅ Access Logs
  static async getAccessLogs(page: number, pageSize: number) {
    return await get<{}, IPaginatedResponse<LogEntry>>(ADMIN_ENDPOINTS.ACCESS_LOGS(), {
      BASE_URLS: 'admin',
      queries: [{ page: String(page) }, { pageSize: String(pageSize) }],
    });
  }

  static async deleteAccessLogs(id?: string) {
    return await deleteResource(ADMIN_ENDPOINTS.ACCESS_LOGS(id), {
      BASE_URLS: 'admin',
    });
  }

  // ✅ Users
  static async getUsers(page: number, pageSize: number) {
    return await get<{}, IPaginatedResponse<IUser>>('USERS', {
      BASE_URLS: 'admin',
      queries: [{ page: String(page) }, { pageSize: String(pageSize) }],
    });
  }

  static async deleteUser(id: string) {
    return await deleteResource(ADMIN_ENDPOINTS.USER_BY_ID(id), {
      BASE_URLS: 'admin',
    });
  }

  // ✅ Communities
  static async getCommunities(page: number, pageSize: number) {
    return await get<{}, IPaginatedResponse<ICommunity>>('COMMUNITIES', {
      BASE_URLS: 'admin',
      queries: [{ page: String(page) }, { pageSize: String(pageSize) }],
    });
  }

  static async deleteCommunity(id: string) {
    return await deleteResource(ADMIN_ENDPOINTS.COMMUNITY_BY_ID(id), {
      BASE_URLS: 'admin',
    });
  }

  // ✅ Posts
  static async getPosts(page: number, pageSize: number) {
    return await get<{}, IPaginatedResponse<IPost>>('POSTS', {
      BASE_URLS: 'admin',
      queries: [{ page: String(page) }, { pageSize: String(pageSize) }],
    });
  }

  static async deletePost(id: string) {
    return await deleteResource(ADMIN_ENDPOINTS.POST_BY_ID(id), {
      BASE_URLS: 'admin',
    });
  }

  // ✅ IPs
  static async getBannedIPs(page: number, pageSize: number) {
    return await get<{}, IPaginatedResponse>(ADMIN_ENDPOINTS.BANNED_IPS(), {
      BASE_URLS: 'admin',
      queries: [{ page: String(page) }, { pageSize: String(pageSize) }],
    });
  }

  static async banIP({
    ip,
    reason,
    banNetwork,
  }: {
    ip: string;
    reason: string;
    banNetwork: boolean;
  }) {
    return await post(ADMIN_ENDPOINTS.BANNED_IPS(), {
      BASE_URLS: 'admin',
      data: { ip, reason, banNetwork },
    });
  }

  static async unbanIP(ip: string) {
    return await deleteResource(ADMIN_ENDPOINTS.BANNED_IPS(ip), {
      BASE_URLS: 'admin',
    });
  }
}

export default AdminOp;

import { deleteResource, get } from '@src/libs/apiConfig';
import { IPaginatedResponse } from '@src/types';
import { LogEntry } from '@src/types/app';

class AdminOp {
  static async getAccessLogs(page: number, pageSize: number) {
    const res = await get<{}, IPaginatedResponse<LogEntry>>('ACCESS_LOGS', {
      BASE_URLS: 'admin',
      queries: [{ page: String(page), pageSize: String(pageSize) }],
    });
    return res;
  }

  static async deleteAccessLogs() {
    const res = await deleteResource('ACCESS_LOGS', {
      BASE_URLS: 'admin',
    });
    return res;
  }
}

export default AdminOp;

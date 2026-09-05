import type { ApiResponse, FeedStatus } from '../types';
import { API_BASE } from '../constants';

// Calls the /api/threats endpoint on our backend proxy server.
export async function fetchThreats(): Promise<ApiResponse> {
  const response = await fetch(`${API_BASE}/api/threats`);
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error(`Server returned non-JSON response (${response.status})`);
  }
  if (!response.ok) {
    throw new Error(`Server returned error ${response.status}`);
  }
  return response.json() as Promise<ApiResponse>;  
}

interface FeedStatusResponse {
  feeds: FeedStatus[];
  activeCount: number;
  offlineCount: number;
  totalCount: number;
  checkedAt: string;
}

// Calls the /api/feed-status endpoint.
// Returns the list of feed health statuses.
// Throws an error if the request fails.
export async function fetchFeedStatus(): Promise<FeedStatus[]> {
  const response = await fetch(`${API_BASE}/api/feed-status`);
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error(`Server returned non-JSON response (${response.status})`);
  }
  if (!response.ok) {
    throw new Error(`Server returned error ${response.status}`);
  }
  const data: FeedStatusResponse = await response.json();
  return data.feeds || [];
}
import { API_BASE } from '../constants';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isError?: boolean;
}

export interface AIChatRequest {
  message: string;
  history: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export interface AIChatResponse {
  response?: string;
  error?: string;
  resetIn?: number;
}

/**
 * Sends a message to the CyberGuard AI backend and returns the assistant's reply.
 * Throws an Error with a user-friendly message on failure.
 */
export async function sendAIMessage(
  message: string,
  history: ChatMessage[]
): Promise<string> {
  // Convert ChatMessage history to the API shape (role + content only)
  const historyPayload = history
    .filter(m => !m.isError)
    .map(m => ({ role: m.role, content: m.content }));

  const body: AIChatRequest = { message, history: historyPayload };

  const response = await fetch(`${API_BASE}/api/ai-chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    const text = await response.text();
    console.error('Non-JSON response from server:', text.slice(0, 300));
    throw new Error(
      `Server returned an invalid response (${response.status}). If deployed on Vercel, make sure CF_ACCOUNT_ID and CF_API_TOKEN are set in Vercel Environment Variables.`
    );
  }

  const data: AIChatResponse = await response.json();

  if (!response.ok) {
    if (response.status === 429) {
      const wait = data.resetIn ? ` Please wait ${data.resetIn} seconds.` : '';
      throw new Error(`Rate limit reached.${wait}`);
    }
    throw new Error(data.error || `Server error (${response.status}). Please try again.`);
  }

  if (!data.response) {
    throw new Error('The AI returned an empty response. Please try again.');
  }

  return data.response;
}

/** Generates a unique ID for a chat message */
export function generateMessageId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

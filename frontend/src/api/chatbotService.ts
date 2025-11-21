import client from './client';

export async function sendChat(message: string): Promise<{ reply: string }> {
  const { data } = await client.post('/api/chatbot', { message });
  return data;
}

import { mastra } from '@/mastra';
import { toAISdkStream } from '@mastra/ai-sdk';
import { createUIMessageStreamResponse } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, id, resourceId } = await req.json();

    // When using Mastra Memory, we only need to send the LATEST user message
    // Memory automatically loads conversation history from the thread
    const allMessages = (messages ?? [])
      .filter((m: any) => m && m.role && (
        (Array.isArray(m.parts) && m.parts.length > 0) ||
        (typeof m.content === 'string' && m.content.trim().length > 0)
      ))
      .map((m: any) => ({
        role: m.role as 'user' | 'assistant' | 'system',
        content: Array.isArray(m.parts)
          ? m.parts.filter((p: any) => p.type === 'text').map((p: any) => p.text ?? '').join('')
          : (m.content ?? ''),
      }))
      .filter((m: any) => m.content.trim().length > 0);

    if (allMessages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No valid messages provided' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Only send the last user message — Memory handles the rest
    const lastMessage = allMessages[allMessages.length - 1];

    const agent = mastra.getAgent('eventManagementAgent');

    // Use Mastra Memory to auto-store chat history
    // thread = conversation ID, resource = user ID
    const mastraStream = await agent.stream(lastMessage.content, {
      memory: {
        thread: id,
        resource: resourceId || 'anonymous',
      },
    });

    return createUIMessageStreamResponse({
      stream: toAISdkStream(mastraStream, { from: 'agent' }) as any,
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process chat message' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
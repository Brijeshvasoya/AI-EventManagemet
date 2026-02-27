import { mastra } from '@/mastra';
import { toAISdkStream } from '@mastra/ai-sdk';
import { createUIMessageStreamResponse } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, id } = await req.json();

    // Filter + normalize to {role, content} format Mastra expects
    const validMessages = (messages ?? [])
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

    if (validMessages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No valid messages provided' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const agent = mastra.getAgent('eventManagementAgent');

    const mastraStream = await agent.stream(validMessages, {
      threadId: id,
    });

    // Per official Mastra docs: pass toAISdkStream() directly to createUIMessageStreamResponse
    // toAISdkStream returns an async iterable — NOT an object with methods
    return createUIMessageStreamResponse({
      stream: toAISdkStream(mastraStream, { from: 'agent' }),
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process chat message' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
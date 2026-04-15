import { mastra } from '@/mastra';
import { NextRequest } from 'next/server';

// GET /api/chat/threads?resourceId=xxx — List threads for sidebar
export async function GET(req: NextRequest) {
  try {
    const resourceId = req.nextUrl.searchParams.get('resourceId');

    if (!resourceId) {
      return Response.json({ error: 'resourceId is required' }, { status: 400 });
    }

    const agent = mastra.getAgent('eventManagementAgent');
    const memory = await agent.getMemory();

    if (!memory) {
      return Response.json({ error: 'Memory not configured' }, { status: 500 });
    }

    const result = await memory.listThreads({
      filter: { resourceId },
      perPage: 50,
      page: 0,
      orderBy: { field: 'createdAt', direction: 'DESC' },
    });

    const threads = result.threads.map((t: any) => ({
      id: t.id,
      title: t.title || 'New Chat',
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    }));

    return Response.json({ threads });
  } catch (error) {
    console.error('List threads error:', error);
    return Response.json({ error: 'Failed to list threads' }, { status: 500 });
  }
}

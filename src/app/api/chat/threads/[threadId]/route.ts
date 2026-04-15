import { mastra } from '@/mastra';
import { NextRequest } from 'next/server';

// GET /api/chat/threads/[threadId]?resourceId=xxx — Get messages for a thread
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  try {
    const { threadId } = await params;
    const resourceId = req.nextUrl.searchParams.get('resourceId');

    if (!threadId) {
      return Response.json({ error: 'threadId is required' }, { status: 400 });
    }

    const agent = mastra.getAgent('eventManagementAgent');
    const memory = await agent.getMemory();

    if (!memory) {
      return Response.json({ error: 'Memory not configured' }, { status: 500 });
    }

    // Get thread info
    const thread = await memory.getThreadById({ threadId });

    if (!thread) {
      return Response.json({ error: 'Thread not found' }, { status: 404 });
    }

    // Verify resource ownership
    if (resourceId && thread.resourceId !== resourceId) {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Get all messages from the thread
    const { messages } = await memory.recall({
      threadId,
      perPage: false,
    });

    return Response.json({
      thread: {
        id: thread.id,
        title: thread.title || 'New Chat',
        createdAt: thread.createdAt,
        updatedAt: thread.updatedAt,
      },
      messages,
    });
  } catch (error) {
    console.error('Get thread error:', error);
    return Response.json({ error: 'Failed to get thread' }, { status: 500 });
  }
}

// DELETE /api/chat/threads/[threadId]?resourceId=xxx — Delete a thread
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  try {
    const { threadId } = await params;
    const resourceId = req.nextUrl.searchParams.get('resourceId');

    if (!threadId) {
      return Response.json({ error: 'threadId is required' }, { status: 400 });
    }

    const agent = mastra.getAgent('eventManagementAgent');
    const memory = await agent.getMemory();

    if (!memory) {
      return Response.json({ error: 'Memory not configured' }, { status: 500 });
    }

    // Verify resource ownership before deleting
    const thread = await memory.getThreadById({ threadId });
    if (!thread) {
      return Response.json({ error: 'Thread not found' }, { status: 404 });
    }

    if (resourceId && thread.resourceId !== resourceId) {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Get all messages from the thread first, then delete by IDs
    const { messages } = await memory.recall({ threadId, perPage: false });
    
    if (messages && messages.length > 0) {
      const messageIds = messages.map((m: any) => m.id);
      await memory.deleteMessages(messageIds);
    }

    // Delete the thread itself
    await memory.deleteThread(threadId);

    return Response.json({ success: true });
  } catch (error) {
    console.error('Delete thread error:', error);
    return Response.json({ error: 'Failed to delete thread' }, { status: 500 });
  }
}

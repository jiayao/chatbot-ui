import { Conversation } from '@/types';

export const config = {
    runtime: 'edge',
  };
  
const handler = async (req: Request): Promise<Response> => {
    const { id, name, messages, model, prompt, folderId } = (await req.json()) as Conversation;
    // TODO: do better than simple concat.
    const text = messages.map(result => result.content).join("\n");

    let json = {
                "id": id,
                "text": text,
                "metadata": {
                    "source": "chat",
                    "source_id": model.id,
                    "author": model.id
                }
            };
    
    const res = await fetch(`${process.env.PLUGIN_HOST}/upsert`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.BEARER_TOKEN}`,
        },
        method: 'POST',
        body: JSON.stringify({
            "documents": [
                json
            ]}),
      });
    return new Response(res.body, { status: res.status });
  };

export default handler;
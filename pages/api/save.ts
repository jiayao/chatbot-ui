import { Conversation, Message, OpenAIModelID } from '@/types';

export const config = {
    runtime: 'edge',
  };
let MEMORY_PLUGIN_HOST = "http://0.0.0.0:8000"
  
const handler = async (req: Request): Promise<Response> => {
    const { id, name, messages, model, prompt, folderId } = (await req.json()) as Conversation;
    let text = "";
    for (let i = messages.length - 1; i >= 0; i--) {
        const message = messages[i];
        text += message.content + "\n";
    }

    let json = {
                "id": id,
                "text": text,
                "metadata": {
                    "source": "chat",
                    "source_id": model.id,
                    "author": model.id
                }
            };
    console.log(json);
    const res = await fetch(`${MEMORY_PLUGIN_HOST}/upsert`, {
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
    console.log(res);
    
    return new Response(res.body, { status: res.status });
  };

export default handler;
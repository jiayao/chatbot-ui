export const config = {
    runtime: 'edge',
  };
  
const handler = async (req: Request): Promise<Response> => {
    const res = await fetch(`${process.env.PLUGIN_HOST}/query`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.BEARER_TOKEN}`,
        },
        method: 'POST',
        body: JSON.stringify({
            "queries": [{
                    "query": (await req.json())["query"],
                    "top_k": 3
                }]}),
      });

    if (res.status === 200) {
        const json = await res.json();
        let results = json.results[0].results;
        results = results.filter((result: { score: number; }) => result.score >= 0.01);
        const text = results
            .filter((result: { score: number; }) => result.score > 0.01)
            .map((result: { text: string; }) => result.text).join("\n");
        return new Response(JSON.stringify({result: text}), { status: res.status });
    }
    return new Response(res.body, { status: res.status });
  };

export default handler;
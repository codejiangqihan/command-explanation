export async function onRequest(context) {
    try {
        const { request } = context;

        // 检查请求方法是否为POST
        if (request.method !== 'POST') {
            return new Response('Method Not Allowed', { status: 405 });
        }

        const { text } = await request.json();

        if (!text) {
            return new Response('Bad Request: Missing input text', { status: 400 });
        }

        // 调用OpenAI GPT API获取含义
        const openAiResponse = await fetch('https://duckduckgo-ai.codeqihan.workers.dev/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${context.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                prompt: `请解释以下词语或命令的含义: ${text}`,
                max_tokens: 150
            })
        });

        // 检查API响应是否成功
        if (!openAiResponse.ok) {
            return new Response(`Error from OpenAI API: ${openAiResponse.statusText}`, { status: openAiResponse.status });
        }

        const data = await openAiResponse.json();

        // 确保返回的数据中包含所需的字段
        if (data && data.choices && data.choices.length > 0) {
            const definition = data.choices[0].text.trim();
            return new Response(JSON.stringify({ definition }), {
                headers: { 'Content-Type': 'application/json' },
            });
        } else {
            return new Response('Bad response format from OpenAI API', { status: 502 });
        }
    } catch (error) {
        // 捕获和处理所有错误
        console.error('Error occurred:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}

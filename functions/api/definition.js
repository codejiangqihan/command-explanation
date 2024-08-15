export async function onRequest(context) {
    try {
        const { request } = context;

        if (request.method !== 'POST') {
            return new Response('Method Not Allowed', { status: 405 });
        }

        const { text } = await request.json();

        if (!text) {
            return new Response('Bad Request: Missing input text', { status: 400 });
        }

        // 调用第三方API获取含义
        const apiResponse = await fetch('https://duckduckgo-ai.codeqihan.workers.dev/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${context.env.YOUR_APIKEY}`, // 使用你的API密钥
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini', // 使用你指定的模型
                messages: [
                    { role: 'user', content: `请解释以下词语或命令的含义: ${text}` }
                ]
            })
        });

        if (!apiResponse.ok) {
            return new Response(`Error from API: ${apiResponse.statusText}`, { status: apiResponse.status });
        }

        const data = await apiResponse.json();

        if (data && data.choices && data.choices.length > 0) {
            const definition = data.choices[0].message.content.trim();
            return new Response(JSON.stringify({ definition }), {
                headers: { 'Content-Type': 'application/json' },
            });
        } else {
            return new Response('Bad response format from API', { status: 502 });
        }
    } catch (error) {
        console.error('Error occurred:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}

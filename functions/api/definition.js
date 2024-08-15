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
                'Authorization': `Bearer VC1rtxR2P6uoCNvg4gxf`, // 确保API密钥正确
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'user', content: `请解释以下词语或命令的含义: ${text}` }
                ]
            })
        });

        if (!apiResponse.ok) {
            const errorDetails = await apiResponse.text(); // 捕获API响应中的详细错误信息
            return new Response(`Error from API: ${apiResponse.statusText}\nDetails: ${errorDetails}`, { status: apiResponse.status });
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

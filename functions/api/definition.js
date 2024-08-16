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
                'Authorization': `Bearer VC1rtxR2P6uoCNvg4gxf`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: "你是一个负责解释Linux命令的语言模型。请确保输出内容中不包含任何 Markdown 格式（例如，避免使用#, *, [链接], 等符号，不要带有“- ”这样的字符（容易和命令混淆）！只能使用纯文本！。只生成纯文本。只能回答关于命令的含义，不能回答别的（只能拒绝），需要具体地解析（尽量分成几行讲解，最好带有示例）"},
                    { role: 'user', content: `请解释以下Linux命令的含义（不要带有“- ”这样的字符（容易和命令混淆）！只能使用纯文本！）: ${text}` }
                ]
            })
        });

        if (!apiResponse.ok) {
            const errorDetails = await apiResponse.text();
            return new Response(`Error from API: ${apiResponse.statusText}\nDetails: ${errorDetails}`, { status: apiResponse.status });
        }

        const data = await apiResponse.json();

        if (data && data.choices && data.choices.length > 0) {
            let definition = data.choices[0].message.content.trim();

            // 检查并去除末尾的 "undefined"
            if (definition.endsWith("undefined")) {
                definition = definition.slice(0, -9).trim(); // 去除 "undefined" 和可能的空格
            }

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

const API_CONFIG = {
    URL: 'https://duckduckgo-ai.codeqihan.workers.dev/v1/chat/completions',
    TOKEN: 'VC1rtxR2P6uoCNvg4gxf',
    MODEL: 'gpt-4o-mini'
};

const SYSTEM_PROMPT = `你是一个专业的Linux命令解释助手。请按照以下格式解释命令，每个部分请单独成段：

1. 基本功能：
用一句话简明扼要地说明这个命令的主要用途。

2. 语法结构：
说明命令的基本语法格式。

3. 常用参数：
列出2-3个最常用的参数及其作用。每个参数单独一行，使用数字编号。

4. 使用示例：
给出1-2个具体的使用示例。每个示例单独一行，使用数字编号。

注意事项：
1. 只输出纯文本，不使用任何Markdown格式
2. 不使用短横线或星号等特殊符号作为标记
3. 每个主要部分之间要空行
4. 只解答Linux命令相关问题，其他问题请礼貌拒绝
5. 保持专业、简洁、易懂的表达方式`;

async function callAIAPI(text) {
    const response = await fetch(API_CONFIG.URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_CONFIG.TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: API_CONFIG.MODEL,
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: `请解释以下Linux命令: ${text}` }
            ]
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error (${response.status}): ${errorText}`);
    }

    return response.json();
}

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

        const data = await callAIAPI(text);

        if (data?.choices?.[0]?.message?.content) {
            const definition = data.choices[0].message.content.trim();
            return new Response(JSON.stringify({ definition }), {
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return new Response('Invalid API Response Format', { status: 502 });
    } catch (error) {
        console.error('Error occurred:', error);
        return new Response(
            JSON.stringify({
                error: 'Internal Server Error',
                message: error.message
            }), 
            { 
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}
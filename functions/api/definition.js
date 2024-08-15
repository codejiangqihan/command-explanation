export async function onRequest(context) {
    const { request } = context;
    const { text } = await request.json();

    // 调用OpenAI GPT API获取含义
    const openAiResponse = await fetch('https://duckduckgo-ai.codeqihan.workers.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${context.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'gpt-4o-mini', // 或其他模型
            prompt: `请解释以下词语或命令的含义: ${text}`,
            max_tokens: 150
        })
    });

    const data = await openAiResponse.json();
    const definition = data.choices[0].text.trim();

    return new Response(
        JSON.stringify({ definition }),
        { headers: { 'Content-Type': 'application/json' } }
    );
}

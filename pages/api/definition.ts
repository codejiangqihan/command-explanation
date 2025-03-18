import type { NextApiRequest, NextApiResponse } from 'next';

type RequestData = {
  text: string;
};

type ResponseData = {
  definition?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { text } = req.body as RequestData;
    
    // 这里实现你的命令查询逻辑
    // 示例：这里只是一个模拟的响应
    const definitions: Record<string, string> = {
      'ls': '列出目录内容\n\n用法: ls [选项]... [文件]...\n\n列出指定目录下的文件和子目录。如果没有指定目录，则列出当前目录的内容。',
      'cd': '更改当前工作目录\n\n用法: cd [目录]\n\n将当前工作目录更改为指定的目录。如果没有指定目录，通常会切换到用户的主目录。',
      'pwd': '打印当前工作目录\n\n用法: pwd\n\n显示当前工作目录的完整路径名。',
      // 可以添加更多命令定义
    };

    const definition = definitions[text.toLowerCase()];
    
    res.status(200).json({ definition });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
} 
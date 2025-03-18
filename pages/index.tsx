import { useState } from 'react';
import { Input, Button, Card, Typography, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import styles from '../styles/Home.module.css';

const { Title, Text } = Typography;

export default function Home() {
  const [inputText, setInputText] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const getDefinition = async () => {
    const trimmedInput = inputText.trim();
    if (!trimmedInput) {
      setResult('请输入要查询的命令');
      return;
    }

    try {
      setLoading(true);
      setResult('正在查询...');
      
      const response = await fetch('/api/definition', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: trimmedInput })
      });
      
      if (!response.ok) {
        throw new Error('网络请求失败');
      }

      const data = await response.json();
      setResult((data.definition || '未找到该命令的解释').replace(/\\n/g, '\n'));
    } catch (error) {
      setResult('查询失败，请稍后重试');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      getDefinition();
    }
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <Title level={2} className={styles.title}>命令查询工具</Title>
        
        <Input
          placeholder="输入要查询的命令，例如：ls"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          size="large"
          className={styles.input}
          spellCheck={false}
          autoComplete="off"
        />
        
        <Button 
          type="primary" 
          icon={<SearchOutlined />}
          size="large"
          onClick={getDefinition}
          className={styles.button}
          block
        >
          查询命令含义
        </Button>
        
        <div className={styles.resultContainer}>
          {loading ? (
            <div className={styles.loadingContainer}>
              <Spin />
              <Text className={styles.loadingText}>正在查询...</Text>
            </div>
          ) : (
            <pre className={styles.resultText}>
              {result || '在上方输入命令并点击查询按钮'}
            </pre>
          )}
        </div>
      </Card>
    </div>
  );
} 
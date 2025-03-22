import React, { useState } from "react";
import { Input, Button, Card, Typography, message, Spin } from "antd";
import { SendOutlined } from "@ant-design/icons";

const { Title } = Typography;

const Home: React.FC = () => {
  const [inputText, setInputText] = useState("");
  const [definition, setDefinition] = useState("");
  const [loading, setLoading] = useState(false);

  const getDefinition = async () => {
    const trimmedText = inputText.trim();
    if (!trimmedText) {
      setDefinition("请输入要查询的命令");
      message.warning("请输入要查询的命令");
      return;
    }

    setLoading(true);
    setDefinition("正在查询...");
    try {
      const response = await fetch("/api/definition", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: trimmedText }),
      });

      if (!response.ok) {
        throw new Error("网络请求失败");
      }

      const result = await response.json();
      setDefinition(result.definition || "未找到该命令的解释");
    } catch (error) {
      console.error("Error:", error);
      setDefinition("查询失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f8fafc",
        padding: "1rem",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: 700,
          borderRadius: "1rem",
          padding: "2rem",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Title
          level={2}
          style={{
            textAlign: "center",
            marginBottom: "1.5rem",
            color: "#1e293b",
          }}
        >
          命令查询工具
        </Title>
        <Input
          placeholder="输入要查询的命令，例如：ls"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onPressEnter={getDefinition}
          autoComplete="off"
          spellCheck={false}
          size="large"
          style={{ marginBottom: "1rem", borderRadius: "0.75rem" }}
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={getDefinition}
          size="large"
          block
          style={{ marginBottom: "1rem" }}
        >
          查询命令含义
        </Button>
        <Card
          style={{
            marginTop: "2rem",
            borderColor: "#e2e8f0",
            backgroundColor: "#f8fafc",
            minHeight: "100px",
            borderRadius: "0.75rem",
          }}
        >
          {loading ? (
            <Spin tip="正在查询..." />
          ) : (
            <pre
              style={{
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
                fontFamily: "monospace",
                margin: 0,
              }}
            >
              {definition || "在上方输入命令并点击查询按钮"}
            </pre>
          )}
        </Card>
      </Card>
    </div>
  );
};

export default Home;

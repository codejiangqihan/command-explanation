import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/* 将页面初始隐藏，并添加平滑过渡效果 */}
          <style>{`
            body {
              opacity: 0;
              transition: opacity 0.3s ease-in-out;
            }
          `}</style>
          {/* 当所有资源加载完毕后，显示页面 */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.addEventListener('load', function() {
                  document.body.style.opacity = '1';
                });
              `,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument; 
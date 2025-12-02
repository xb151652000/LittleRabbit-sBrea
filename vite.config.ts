import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

/*
  Vite 配置（开发服务器与构建相关）
  - server.host = '0.0.0.0' 允许局域网访问（注意防火墙）
  - port = 3000：可在启动时通过终端看到实际 Local/Network 地址
  - plugins: react() 使 Vite 支持 JSX/TSX 与 Fast Refresh
  - define: 把 .env 中的 GEMINI_API_KEY 字符串注入到构建时代码 (文本替换)
  - resolve.alias: 设置 @ 指向仓库根，方便绝对路径导入（注意与 tsconfig paths 保持一致）
*/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  };
});

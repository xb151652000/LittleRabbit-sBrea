import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';        // 确保 src/App.tsx 存在
import './index.css';          // 全局样式（包含 Tailwind 指令）

/*
  main.tsx — 应用入口（React 挂载）
  - 作用：把 App 组件挂载到 index.html 的 #root
  - 注意：当 main.tsx 导入 './index.css' 时，Vite 会走 PostCSS -> Tailwind 流程来生成样式
*/
const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');

createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
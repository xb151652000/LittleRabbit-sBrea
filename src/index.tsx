import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// 获取页面中 id 为 "root" 的 DOM 节点 —— React 会把整个应用挂载到这个节点上
const rootElement = document.getElementById('root');
if (!rootElement) {
  // 如果页面没有 root 节点，抛出错误并停止运行，便于定位问题
  throw new Error("Could not find root element to mount to");
}

// 使用 React 18 的 createRoot API 创建渲染根（root）
// 这是 React 应用的入口渲染器，通过它把 React 组件树输出到上面的 DOM 节点
const root = ReactDOM.createRoot(rootElement);

// 把应用的根组件 App 渲染到页面上
// React.StrictMode 是一个开发模式下的辅助组件，会启用额外的检查和警告（不会影响生产环境）
root.render(
  <React.StrictMode>
    {/* App 组件通常在 src/App.tsx 中定义，包含整个页面的路由和主要 UI */}
    <App />
  </React.StrictMode>
);
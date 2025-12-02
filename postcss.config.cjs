/*
  PostCSS 配置（告诉 Vite 在处理 CSS 时使用哪些插件）
  - 使用 @tailwindcss/postcss 而不是直接用 tailwindcss 作为 PostCSS 插件（针对新版 Tailwind）
  - autoprefixer 用来自动添加浏览器前缀，提升兼容性
  安装命令（若未安装）：
    npm install -D @tailwindcss/postcss postcss autoprefixer tailwindcss
*/
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
};
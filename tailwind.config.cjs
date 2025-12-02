/*
  Tailwind 配置
  - content 指定 Tailwind 在哪些文件中查找类名以便产出最终 CSS（生产构建会依据此裁剪未使用样式）
  - theme.extend 可用来扩展默认主题（颜色、字体等）
*/
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
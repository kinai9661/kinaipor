# Kinaipor 部署指南

## 本地開發

### 1. 克隆倉庫

```bash
git clone https://github.com/kinai9661/kinaipor.git
cd kinaipor
```

### 2. 安裝依賴

```bash
npm install
```

### 3. 啟動開發服務器

```bash
npm run dev
```

訪問 http://localhost:5173

## 添加 shadcn/ui 組件

```bash
# 查看所有可用組件
npx shadcn@latest add

# 添加特定組件
npx shadcn@latest add card
npx shadcn@latest add dialog
npx shadcn@latest add input
npx shadcn@latest add label
```

## Cloudflare Workers 部署

### 方法 1: 使用 Wrangler CLI（推薦）

```bash
# 1. 登錄 Cloudflare
wrangler login

# 2. 構建並部署
npm run deploy
```

### 方法 2: 手動部署

```bash
# 1. 構建生產版本
npm run build

# 2. 部署到 Workers
wrangler deploy
```

### 環境變量配置

如果需要添加環境變量，創建 `.dev.vars` 文件（本地開發）：

```bash
API_KEY=your_api_key
DATABASE_URL=your_database_url
```

生產環境變量在 Cloudflare Dashboard 設置：
1. 前往 Workers & Pages
2. 選擇你的 Worker
3. Settings → Variables
4. 添加環境變量

## Cloudflare Pages 替代方案

如果只需要靜態托管（不需要 Workers API）：

```bash
# 1. 構建
npm run build

# 2. 部署到 Pages
npx wrangler pages deploy dist --project-name=kinaipor
```

## 項目結構

```
kinaipor/
├── src/
│   ├── components/
│   │   └── ui/           # shadcn/ui 組件
│   ├── lib/
│   │   └── utils.ts      # 工具函數
│   ├── App.tsx           # 主應用組件
│   ├── main.tsx          # React 入口
│   ├── index.css         # 全局樣式 + Tailwind
│   └── index.ts          # Workers 入口
├── public/               # 靜態資源
├── dist/                 # 構建輸出
├── components.json       # shadcn/ui 配置
├── tailwind.config.js    # Tailwind 配置
├── vite.config.ts        # Vite 配置
├── wrangler.toml         # Cloudflare Workers 配置
└── package.json
```

## 常用命令

```bash
# 開發
npm run dev              # 啟動開發服務器

# 構建
npm run build            # 生產構建
npm run preview          # 預覽構建結果

# 部署
npm run deploy           # 部署到 Cloudflare Workers

# 添加組件
npx shadcn@latest add [component-name]

# Workers 本地測試
wrangler dev             # 在本地運行 Workers
```

## 疑難排解

### 問題 1: 路徑別名無法解析

確保 `tsconfig.json` 和 `vite.config.ts` 都配置了路徑別名：

```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### 問題 2: Tailwind 樣式不生效

檢查 `tailwind.config.js` 的 `content` 配置包含所有組件文件：

```js
content: [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
]
```

### 問題 3: Workers 部署失敗

確保 `wrangler.toml` 配置正確，特別是 `compatibility_date`。

## 性能優化

### 1. 代碼分割

Vite 會自動進行代碼分割，但你可以手動優化：

```tsx
import { lazy, Suspense } from 'react'

const HeavyComponent = lazy(() => import('./HeavyComponent'))

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  )
}
```

### 2. 按需加載 shadcn/ui 組件

只安裝需要的組件，避免引入整個組件庫。

### 3. Cloudflare Workers 優化

- 使用 KV 存儲靜態數據
- 啟用 Cloudflare Cache API
- 使用 Durable Objects 處理狀態

## 更多資源

- [shadcn/ui 文檔](https://ui.shadcn.com)
- [Cloudflare Workers 文檔](https://developers.cloudflare.com/workers/)
- [Vite 文檔](https://vitejs.dev)
- [Tailwind CSS 文檔](https://tailwindcss.com)

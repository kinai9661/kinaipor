# Flux AI Pro 移植指南

## 📋 移植進度

### ✅ 已完成
1. **配置文件** - `src/lib/flux-config.ts`
   - Flux AI 模型配置（4個模型）
   - 風格預設（9+種風格）
   - 尺寸預設
   - TypeScript 類型定義

2. **基礎 UI 組件** (shadcn/ui)
   - Button 組件
   - Card 組件
   - Input 組件
   - Label 組件
   - Dialog 組件

### 🚧 待完成

#### 階段 1: Workers API 後端
```
src/index.ts (Cloudflare Workers 入口)
├─ /_internal/generate (生成 API)
├─ /health (健康檢查)
└─ / (React 前端)
```

**需要添加的功能：**
- [ ] Pollinations API 集成
- [ ] 圖像生成處理
- [ ] 錯誤處理和重試邏輯
- [ ] 環境變量配置 (POLLINATIONS_API_KEY)

#### 階段 2: React 前端組件
```
src/
├─ components/
│  ├─ flux/
│  │  ├─ GeneratorPanel.tsx    (生成參數面板)
│  │  ├─ PromptEditor.tsx      (提示詞編輯器)
│  │  ├─ ImageGallery.tsx      (圖片畫廊)
│  │  ├─ StyleSelector.tsx     (風格選擇器)
│  │  └─ HistoryManager.tsx    (歷史管理)
│  └─ ui/ (shadcn/ui 組件)
└─ App.tsx (FluxAI 主應用)
```

**核心功能：**
- [ ] 圖像生成表單
- [ ] 即時預覽
- [ ] 歷史記錄（LocalStorage）
- [ ] 圖片下載
- [ ] 參數重用
- [ ] 風格分類選擇
- [ ] 響應式佈局

#### 階段 3: 進階功能
- [ ] 批量生成（1-4張）
- [ ] 圖生圖支持
- [ ] 參考圖像上傳
- [ ] Seed 控制
- [ ] 負面提示詞
- [ ] 自動優化參數
- [ ] HD 增強
- [ ] 中文自動翻譯（Workers AI）

## 🎨 UI 設計對比

### 原版 (worker.js 內嵌 HTML)
- 單頁面 HTML + 原生 JavaScript
- 內聯 CSS 樣式
- 三欄佈局（參數 | 結果 | 提示詞）
- 45+ 種風格分類選擇器

### 新版 (React + shadcn/ui)
- React 組件化
- shadcn/ui 設計系統
- Tailwind CSS
- TypeScript 類型安全
- 相同的三欄佈局
- 改進的交互體驗

## 🔧 關鍵技術差異

| 功能 | 原版 (worker.js) | 新版 (React) |
|------|-----------------|-------------|
| 框架 | 原生 JS | React 18 + TypeScript |
| 樣式 | 內聯 CSS | Tailwind CSS + shadcn/ui |
| 狀態管理 | DOM 操作 | React Hooks |
| 存儲 | LocalStorage (原生) | LocalStorage (React Hook) |
| API 調用 | fetch (原生) | fetch (React) |
| 部署 | Cloudflare Workers | Cloudflare Workers + Vite |

## 📦 環境變量配置

需要在 Cloudflare Workers 中設置：

```bash
# 設置 Pollinations API Key
wrangler secret put POLLINATIONS_API_KEY

# （可選）Workers AI 用於中文翻譯
# 需要在 Cloudflare Dashboard 綁定 AI
```

## 🚀 快速開始

### 本地開發
```bash
# 1. 克隆倉庫
git clone https://github.com/kinai9661/kinaipor.git
cd kinaipor

# 2. 安裝依賴
npm install

# 3. 開發模式
npm run dev
```

### 部署到 Cloudflare Workers
```bash
# 1. 登錄 Cloudflare
wrangler login

# 2. 設置 API Key
wrangler secret put POLLINATIONS_API_KEY

# 3. 部署
npm run deploy
```

## 📝 API 端點

### 生成圖像
```http
POST /_internal/generate
Content-Type: application/json

{
  "prompt": "a beautiful sunset",
  "model": "zimage",
  "style": "anime",
  "width": 1024,
  "height": 1024,
  "quality_mode": "standard",
  "seed": -1,
  "n": 1
}
```

### 健康檢查
```http
GET /health

Response:
{
  "status": "ok",
  "version": "9.6.1",
  "models": [...],
  "styles_count": 45
}
```

## 🎯 下一步計劃

1. **立即完成**（今天）
   - ✅ 配置文件和類型定義
   - ⏳ Workers API 後端實現
   - ⏳ React 主界面

2. **短期目標**（本週）
   - 完整的圖像生成流程
   - 歷史記錄功能
   - 響應式設計

3. **中期目標**（下週）
   - 45+ 種風格完整移植
   - 進階參數控制
   - 圖生圖功能

4. **長期目標**
   - 用戶認證
   - 雲端存儲
   - 社區分享

## 💡 注意事項

- Pollinations API 需要 API Key 才能使用
- 新 API 端點：`https://gen.pollinations.ai`
- 免費層級可能有速率限制
- 建議使用 Cloudflare Workers 免費層（每天 100,000 請求）

## 📚 相關資源

- [Pollinations.ai 官網](https://pollinations.ai/)
- [Cloudflare Workers 文檔](https://developers.cloudflare.com/workers/)
- [shadcn/ui 文檔](https://ui.shadcn.com/)
- [原始 Flux-AI-Pro 倉庫](https://github.com/kinai9661/Flux-AI-Pro)

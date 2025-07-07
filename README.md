## 🎯 Frontend Homework Assignment - Video AI Highlight Tool

### [Demo](video-ai-highlight-tool.vercel.app)

上傳畫面
![](/public/upload.png)

Transcript 畫面
![](/public/transcript.png)


### 功能要求
#### 1. 影片上傳功能 ✅
- 拖拽和點擊上傳
- 多種影片格式支援 (MP4, WebM, AVI)
- 即時上傳進度顯示
- 檔案格式驗證

#### 2. Mock AI 處理 ✅
- 完整的 Mock API 實現
- 標準 JSON 回傳格式
- 包含完整轉錄、分段、標題、建議高亮
- 模擬處理進度

#### 3. 雙欄分割介面 ✅
- 左側編輯區域：轉錄顯示、句子選擇、時間戳導航
- 右側預覽區域：高亮片段播放、控制、字幕疊加
- 完整響應式設計

#### 4. 雙向同步功能 ✅
- 編輯→預覽：點擊更新播放位置、選擇更新內容
- 預覽→編輯：播放高亮當前句子、自動滾動

#### 5. 跨平台支援 ✅
- Windows/Mac/Linux 桌面支援
- iOS/Android 手機支援
- Chrome/Safari/Firefox 瀏覽器支援

### 🏗️ 技術實現亮點

#### 元件化架構
- 6+ 個可重用元件：TranscriptList、TranscriptItem、VideoPlayer、VideoControls、HighlightMarker、ProgressBar
- 完整的 TypeScript 型別定義
- 統一的元件導出與管理

#### 專案架構模式
- **模組化設計** - 功能按模組分離
  - features/ - 功能模組
  - components/ - 可重用元件
  - hooks/ - 自定義 Hooks
  - lib/ - 工具函數
  - types/ - 型別定義

- **分層架構** - 清晰的職責分離
  - 展示層 (UI Components)
  - 業務邏輯層 (Features)
  - 資料存取層 (API Clients)
  - 工具層 (Utilities)


### 🛠️ 技術棧詳解
- **Next.js 15** - 選擇最新版本以使用 App Router 和 Server Components
- **React 19** - 最新的 React 版本，支援 Concurrent Features
- **TypeScript** - 提供完整的型別安全和開發體驗
- **Tailwind CSS** - 快速開發和一致的設計系統
- **shadcn/ui** - 高品質的可自定義元件庫
- **TanStack Query** - 強大的伺服器狀態管理解決方案

#### 核心技術框架
- **Next.js 15** - React 全棧框架
  - App Router 架構
  - 伺服器元件支援
  - 自動程式碼分割
  - 內建效能優化

- **React 18** - 前端函式庫
  - Concurrent Features
  - Suspense 支援
  - Custom Hooks
  - Context API

- **TypeScript 5.0+** - 型別安全
  - 完整型別定義
  - 介面規範
  - 編譯時檢查
  - IntelliSense 支援

#### 樣式與 UI 系統
- **Tailwind CSS 3.4** - 原子化 CSS 框架
  - 響應式設計
  - 深色模式支援
  - JIT 編譯
  - 自定義主題

- **shadcn/ui** - React 元件庫
  - Radix UI 基礎
  - 無障礙設計
  - 可自定義樣式
  - TypeScript 原生支援

- **Lucide React** - 圖示系統
  - 一致的視覺語言
  - 可縮放向量圖示
  - 樹搖優化

#### 狀態管理與資料處理
- **TanStack Query (React Query)** - 伺服器狀態管理
  - 快取機制
  - 背景同步
  - 錯誤處理
  - 樂觀更新

- **React Hooks** - 本地狀態管理
  - useState 元件狀態
  - useEffect 副作用處理
  - useRef DOM 操作
  - Custom Hooks 邏輯封裝

#### Mock API 實現
- **本地 JSON 數據** - 模擬後端 API
  - 結構化數據格式
  - 真實的回應延遲
  - 錯誤狀態模擬
  - 類型安全的介面

#### 效能優化技術
- **程式碼分割** - 減少初始包大小
- **圖片優化** - Next.js Image 元件
- **字體優化** - 系統字體回退
- **快取策略** - 靜態資源快取
- **Tree Shaking** - 移除未使用程式碼

#### 主要依賴版本
```json
{
  "dependencies": {
    "next": "15.3.4",              // React 全棧框架
    "react": "19.0.0",             // React 核心
    "react-dom": "19.0.0",         // React DOM 渲染
    "@tanstack/react-query": "5.81.5", // 狀態管理
    "axios": "1.10.0",             // HTTP 客戶端
    "lucide-react": "0.525.0",     // 圖示庫
    "sonner": "2.0.6",             // 通知系統
    "clsx": "^2.1.1",              // 類別名稱工具
    "tailwind-merge": "^3.3.1",    // Tailwind 合併工具
    "class-variance-authority": "^0.7.1" // 樣式變體管理
  },
  "devDependencies": {
    "typescript": "5.8.8",         // TypeScript 編譯器
    "eslint": "9.18.1",            // 程式碼檢查
    "tailwindcss": "3.5.6",       // CSS 框架
    "postcss": "8.5.2",           // CSS 後處理器
    "@types/node": "22.10.0",      // Node.js 型別
    "@types/react": "19.0.3",      // React 型別
    "@types/react-dom": "19.0.3"   // React DOM 型別
  }
}
```




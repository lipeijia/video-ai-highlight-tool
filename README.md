## 🎯 Frontend Homework Assignment - Video AI Highlight Tool

###[Demo](video-ai-highlight-tool.vercel.app)

上傳畫面
![](/public/upload.png)

Transcript 畫面
![](/public/transcript.png)


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

#### 使用者體驗
- 流暢的動畫效果
- 即時回饋機制
- 錯誤處理與提示
- 無縫的同步互動




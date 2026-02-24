# 回憶 3D 拼圖

一款以「回憶」為主題、在瀏覽器中直接執行的 **3D 滑動拼圖遊戲**，採用 Three.js 打造沉浸式立體視覺效果。玩家上傳一張對自己具有特別意義的照片後，系統會將其切割成若干碎片並打亂排列，玩家需要透過滑動來還原完整的影像。

---

## 目錄

- [線上體驗](#線上體驗)
- [功能特色](#功能特色)
- [技術架構](#技術架構)
- [遊戲玩法](#遊戲玩法)
- [專案結構](#專案結構)
- [本機執行](#本機執行)
- [自訂與設定](#自訂與設定)
- [常見問題](#常見問題)
- [版權聲明](#版權聲明)

---

## 線上體驗

> 🔗 **[https://memory-puzzle.gh.miniasp.com](https://memory-puzzle.gh.miniasp.com)**

直接在瀏覽器中開啟，無需安裝任何軟體，支援桌機與行動裝置。

---

## 功能特色

| 功能 | 說明 |
|------|------|
| 📷 **自訂照片** | 支援從裝置上傳任意圖片（JPG、PNG、GIF 等常見格式）或直接拍照（行動裝置） |
| 🎲 **3D 立體拼圖** | 使用 Three.js WebGL 渲染引擎，拼圖碎片以立體方式呈現，具備輕微浮動動畫 |
| 🕹️ **直覺滑動操作** | 滑鼠拖曳或觸控滑動皆可操作，支援多種滑動方向 |
| ⏱️ **即時計時** | 遊戲開始後自動計時，紀錄完成所需的時間 |
| 🔢 **移動次數記錄** | 完整統計玩家移動碎片的次數，追蹤解題效率 |
| 👁️ **原圖預覽** | 遊戲進行中可隨時按下「查看原圖」按鈕，半透明預覽完整圖片作為提示 |
| 🎉 **粒子慶祝特效** | 成功完成拼圖後，畫面會播放炫麗的粒子爆炸慶祝動畫 |
| 📱 **響應式設計** | 自動適應桌機、平板、手機等各種螢幕尺寸 |
| 🔒 **隱私優先** | 所有影像處理皆在瀏覽器本地端完成，照片不會上傳至任何伺服器 |

---

## 技術架構

本專案採用**純前端**架構，無需後端伺服器，所有運算皆在使用者的瀏覽器中完成。

### 使用技術

- **[Three.js r128](https://threejs.org/)** — WebGL 3D 渲染引擎，負責建立場景、相機、光源及 3D 網格
- **[TWEEN.js 18.6.4](https://github.com/tweenjs/tween.js/)** — 補間動畫函式庫，用於碎片移動、相機動畫等平滑過渡效果
- **HTML5 Canvas API** — 用於將上傳的圖片裁切、縮放並轉換為 Three.js 材質貼圖
- **HTML5 File API** — 在瀏覽器本地端讀取使用者選擇的圖片檔案
- **CSS3** — 採用 CSS 自訂屬性（變數）、Flexbox、玻璃擬態（Glassmorphism）風格設計
- **Google Analytics (GA4)** — 頁面流量與使用者行為分析

### 渲染流程

```
使用者上傳圖片
      │
      ▼
HTML5 Canvas 裁切與縮放
      │
      ▼
依格數將圖片切割為碎片紋理 (CanvasTexture)
      │
      ▼
Three.js 建立對應數量的 3D Mesh (BoxGeometry + MeshPhongMaterial)
      │
      ▼
隨機打亂碎片位置
      │
      ▼
玩家滑動 → Raycaster 偵測點擊碎片 → 計算可移動方向 → TWEEN 動畫移動
      │
      ▼
每次移動後檢查是否完成 → 完成則播放粒子特效並顯示成功視窗
```

---

## 遊戲玩法

1. **開啟遊戲頁面**，看到進場說明畫面。
2. **點擊「選擇或拍攝照片」**，從裝置選取一張您喜歡的圖片。
   - 桌機：開啟檔案選擇器，選取圖片檔案。
   - 行動裝置：可選擇從相簿挑選，或直接使用相機拍攝。
3. 選完圖片後，系統會自動**載入並切割圖片**，準備好後進入遊戲畫面。
4. 畫面上方顯示**計時器**與**移動次數**。
5. **點擊（或觸碰）拼圖碎片**並往空格方向**拖曳**，即可移動碎片。
   - 每次只能移動與空格相鄰的碎片。
   - 碎片可向上、下、左、右四個方向滑入空格。
6. 若需要提示，可按下畫面下方的**「查看原圖」**按鈕，半透明原圖將疊加顯示，再次點擊則關閉。
7. 當所有碎片回到正確位置後，遊戲自動偵測**通關**，播放粒子特效並顯示成績（時間與移動次數）。
8. 點擊「**重新創造回憶**」可返回首頁，重新上傳圖片或再次挑戰。

---

## 專案結構

```
memory-puzzle/
├── index.html      # 主要應用程式（所有程式碼皆在此單一檔案中）
├── CNAME           # GitHub Pages 自訂網域設定
└── README.md       # 本說明文件
```

本專案刻意採用**單一 HTML 檔案**的架構，所有 CSS 樣式、JavaScript 邏輯、HTML 結構皆內嵌在 `index.html` 中，方便部署與分享，無需建置步驟。

---

## 本機執行

由於所有資源（Three.js、TWEEN.js）皆透過 CDN 載入，本機執行只需一個靜態伺服器即可。

### 方法一：使用 VS Code Live Server

1. 安裝 VS Code 擴充功能 **Live Server**（ritwickdey.liveserver）。
2. 以 VS Code 開啟專案資料夾。
3. 在 `index.html` 上按右鍵，選擇「Open with Live Server」。
4. 瀏覽器會自動開啟 `http://localhost:5500`。

### 方法二：使用 Python 內建 HTTP 伺服器

```bash
# Python 3
cd /path/to/memory-puzzle
python -m http.server 8080
# 然後開啟瀏覽器前往 http://localhost:8080
```

### 方法三：使用 Node.js http-server

```bash
npm install -g http-server
cd /path/to/memory-puzzle
http-server -p 8080
# 然後開啟瀏覽器前往 http://localhost:8080
```

> ⚠️ **注意**：請勿直接雙擊 `index.html` 以 `file://` 協定開啟，部分瀏覽器的安全限制可能導致 WebGL 或 File API 無法正常運作。建議透過 HTTP 伺服器存取。

---

## 自訂與設定

### 修改拼圖格數

在 `index.html` 中找到以下程式碼段落，修改 `GRID_SIZE` 常數即可調整拼圖的行列數：

```javascript
const GRID_SIZE = 4; // 預設為 4x4，共 15 個碎片 + 1 個空格
```

> 建議值範圍：`3`（簡單）、`4`（預設/中等）、`5`（困難）

### 更換 Google Analytics 追蹤 ID

在 `<head>` 區塊中找到 GA 追蹤碼，將 `G-XXXXXXXXXX` 替換為您自己的 GA4 測量 ID：

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
</script>
```

### 修改配色主題

在 CSS `:root` 區塊中調整自訂屬性：

```css
:root {
    --primary-color: #f3f4f6;   /* 主要文字顏色 */
    --bg-color: #1a1a2e;         /* 背景顏色（深藍黑） */
    --accent-color: #e94560;     /* 強調色（玫瑰紅） */
    --glass-bg: rgba(255, 255, 255, 0.1);    /* 玻璃背景透明度 */
    --glass-border: rgba(255, 255, 255, 0.2); /* 玻璃邊框透明度 */
}
```

---

## 常見問題

**Q：遊戲無法載入 3D 畫面？**
A：請確認您的瀏覽器支援 WebGL。可前往 [https://get.webgl.org/](https://get.webgl.org/) 確認。建議使用最新版 Chrome、Firefox、Edge 或 Safari。

**Q：手機上上傳圖片後畫面空白？**
A：請確認您已允許瀏覽器存取相機或相簿的權限。如問題持續，請嘗試換用 Chrome 瀏覽器。

**Q：拼圖碎片無法點擊或滑動？**
A：請確認是在遊戲進行中（計時器已啟動）且未開啟原圖預覽模式。如果是在預覽模式，請先點擊畫面關閉預覽。

**Q：上傳的照片會被儲存到雲端嗎？**
A：不會。本遊戲所有影像處理均在您的裝置（瀏覽器）本地端完成，照片資料不會傳送至任何伺服器。

**Q：可以離線遊玩嗎？**
A：由於 Three.js 和 TWEEN.js 透過 CDN 載入，首次使用需要網路連線。若瀏覽器已快取這些資源，則後續可在離線狀態下使用。

**Q：為什麼要用 HTTP 伺服器而不能直接開啟 HTML 檔案？**
A：部分瀏覽器（尤其是 Chrome）在 `file://` 協定下會封鎖 WebGL context 的建立及 File API 的使用，透過本機 HTTP 伺服器可避免此問題。

---

## 版權聲明

本站由 [Will 保哥的技術交流中心](https://www.facebook.com/will.fans/) 設計、開發與維護

Copyright © 2026 Will 保哥

本專案所有程式碼與設計，著作權歸屬 Will 保哥所有。如需引用或二次開發，請先取得授權。

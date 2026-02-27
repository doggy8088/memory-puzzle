# Codex CLI 圖片生成工作流程設定

本專案使用 GitHub Actions 工作流程 `.github/workflows/codex-generate-images.yml` 自動執行 Codex CLI 產生圖片。

## 1) 工作流程與排程

- 工作流程檔案：`.github/workflows/codex-generate-images.yml`
- 觸發方式：
  - `schedule`：`0 */6 * * *`（UTC 每 6 小時一次）
  - `workflow_dispatch`：可手動執行
- 等於每日固定執行 4 次：`00:00 / 06:00 / 12:00 / 18:00 (UTC)`

## 2) 固定 Codex Prompt

工作流程固定執行以下指令內容，不帶動態輸入：

`generate image using puzzle-image-generator skill`

## 3) 自動 commit / push 規則

流程最後會 `git add -A`，但只在「有新增檔案」時才提交並推送：

- 判斷條件：`git diff --cached --name-only --diff-filter=A`
- 有新增檔案：`git commit` + `git push`
- 沒有新增檔案：只輸出 `No newly added files to commit.`

## 4) 必要 Secrets 與 Permissions

### Secrets

- `OPENAI_API_KEY`：給 `codex exec` 呼叫模型用，未設定會在驗證步驟直接失敗。
- `CODEX_GITHUB_TOKEN`：用於 `actions/checkout` 與後續 `git push` 驗證，也會注入為 `GITHUB_TOKEN` 供 Codex 執行時使用 GitHub 存取能力。

> 為何 `CODEX_GITHUB_TOKEN` 必要：工作流程需要把新生成檔案推回分支；若沒有可寫入 repo 的 token，`git push` 會因未授權而失敗。

### Permissions

- `permissions: contents: write`
  - 允許此 workflow 建立 commit 並 push 到儲存庫內容。
  - 若改成唯讀（`contents: read`），push 會失敗。

## 5) 手動觸發（workflow_dispatch）

1. 到 GitHub 倉庫的 **Actions**。
2. 選擇 **Codex Generate Images**。
3. 點 **Run workflow**，選分支後執行。
4. 開啟該次 run，確認 `Run Codex` 與 `Commit and push when new files exist` 步驟結果。

## 6) 基本疑難排解清單

- `Missing OPENAI_API_KEY` / `Missing CODEX_GITHUB_TOKEN`：確認 Repository Secrets 已設定。
- `git push` 權限錯誤：確認 `CODEX_GITHUB_TOKEN` 具備 repo 寫入權限，且 workflow 保持 `contents: write`。
- 工作流程沒自動跑：確認時區為 UTC，排程是每 6 小時不是本地時區整點。
- `No newly added files to commit.`：代表本次沒有「新增檔案」，屬正常行為（修改舊檔不會觸發 commit）。
- Codex 執行失敗：先檢查 `Run Codex` step log、API 金鑰有效性、以及 skill 名稱 `puzzle-image-generator` 是否可用。

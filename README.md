# 🎮 GameArchive - 极简主义游戏素材管理与展示系统

![GameArchive Banner](https://img.shields.io/badge/Status-Stable-success?style=for-the-badge&logo=googleshell&logoColor=white)
![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)

**GameArchive** 是一个为硬核玩家打造的游戏封面展示与归档系统。它能自动扫描本地文件夹中的游戏素材，并以如钢琴律动般优雅的动画，在网页端呈现你的游戏编年史。

---

## ✨ 项目特色

- **🎹 钢琴式交互动画**：采用 Framer Motion 打造独特的瀑布式加载特效，每一年的游戏封面都如琴键般优雅跳动。
- **📁 自动化目录扫描**：无需手动配置，只需将图片放入按年份命名的文件夹（如 `游戏统计-2025`），系统即可自动解析、分类并生成预览。
- **🎨 极致审美 (Yu Style)**：继承了 YuToys 系列的深色模式、玻璃拟态与细腻阴影，打造专业级画廊质感。
- **🚀 双模驱动**：
  - **开发模式**：使用 FastAPI 实时扫描本地路径，支持即时预览。
  - **静态导出**：支持一键将整个画廊导出为静态网站，方便部署到 GitHub Pages 或个人服务器。

---

## 🛠️ 技术栈

- **前端**：Vite + React + Framer Motion + TailwindCSS (或 Vanilla CSS)
- **后端**：Python (FastAPI) + Uvicorn
- **自动化**：自定义 Python 脚本实现静态化导出

---

## 📦 快速启动

### 1. 准备素材

在项目根目录（或配置文件指定的路径）下创建如下结构：

```text
游戏数据/
├── 游戏统计-2024/
│   ├── 塞尔达传说.jpg
│   └── 艾尔登法环.png
└── 游戏统计-2025/
    └── 黑神话悟空.webp
```

### 2. 运行后端 (API 模式)

```bash
python server.py
```

### 3. 生成静态网站

```bash
python static_export.py
```

---

## ⚙️ 配置说明

在 `server.py` 和 `static_export.py` 中，你可以修改 `GAME_DOC_PATH` 和 `SOURCE_DIR` 的指向，让系统识别你电脑上任意位置的游戏文件夹。

---

## 📜 开源协议

本项目采用 [MIT License](LICENSE) 许可协议。

---

_Keep Gaming, Keep Archiving._
_Made with ❤️ by Yu._

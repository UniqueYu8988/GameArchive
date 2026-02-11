import os
import uvicorn
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict
import re

app = FastAPI()

# 允许跨域请求，方便前后端分离开发
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 数据路径配置
# 优先查找本地 'games' 文件夹，如果不存在则使用硬编码备份路径 (已兼容用户本地路径)
LOCAL_GAMES_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "games")
GAME_DOC_PATH = LOCAL_GAMES_PATH if os.path.exists(LOCAL_GAMES_PATH) else r"C:\Users\Yu\OneDrive\图片\数据备份"

# 挂载静态文件目录，用于直接访问图片
# 访问路径如：http://localhost:8000/images/游戏统计-2025/cover.jpg
# 1. 挂载游戏图片目录 (API 依赖)
print(f"Checking path: {GAME_DOC_PATH}")
if os.path.exists(GAME_DOC_PATH):
    print(f"Path exists! Found {len(os.listdir(GAME_DOC_PATH))} items.")
    app.mount("/images", StaticFiles(directory=GAME_DOC_PATH), name="images")
else:
    print(f"WARNING: Path does not exist or is not accessible: {GAME_DOC_PATH}")

# 2. 挂载前端构建资源 (JS/CSS)
FRONTEND_DIST = os.path.join(os.path.dirname(os.path.abspath(__file__)), "frontend", "dist")
print(f"Checking Frontend Dist Path: {FRONTEND_DIST}")

if os.path.exists(FRONTEND_DIST):
    print("Frontend Dist found! Mounting...")
    app.mount("/assets", StaticFiles(directory=os.path.join(FRONTEND_DIST, "assets")), name="assets")
else:
    print(f"WARNING: Frontend Dist NOT found at {FRONTEND_DIST}")

from fastapi.responses import FileResponse, HTMLResponse

@app.get("/")
async def read_index():
    if os.path.exists(os.path.join(FRONTEND_DIST, "index.html")):
        return FileResponse(os.path.join(FRONTEND_DIST, "index.html"))
    return HTMLResponse(
        content=f"<h1>Error: Frontend not built</h1><p>Expected index.html at: {FRONTEND_DIST}</p><p>Please run 'npm run build' in frontend directory.</p>",
        status_code=500
    )

def get_game_data():
    """
    扫描目录结构，提取年份和游戏图片信息
    """
    if not os.path.exists(GAME_DOC_PATH):
        return []
    
    data = []
    # 遍历年份目录
    for folder_name in os.listdir(GAME_DOC_PATH):
        folder_path = os.path.join(GAME_DOC_PATH, folder_name)
        if not os.path.isdir(folder_path):
            continue
            
        # 尝试从目录名提取年份，例如 "游戏统计-2025" -> "2025"
        year_match = re.search(r'(\d{4})', folder_name)
        year = year_match.group(1) if year_match else "Other"
        
        games = []
        for file_name in os.listdir(folder_path):
            if file_name.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
                # 构建图片的各种信息
                games.append({
                    "id": f"{folder_name}/{file_name}",
                    "name": os.path.splitext(file_name)[0],
                    "url": f"/images/{folder_name}/{file_name}",
                    "year": year
                })
        
        if games:
            data.append({
                "category": folder_name,
                "year": year,
                "games": games
            })
            
    # 按年份倒序排列
    data.sort(key=lambda x: x['year'] if x['year'].isdigit() else '0', reverse=True)
    return data

@app.get("/api/games")
async def get_games():
    """获取所有游戏数据的接口"""
    return get_game_data()

@app.get("/api/health")
async def health():
    return {"status": "ok"}

# 放在文件末尾，作为兜底
# 服务 dist 目录下的其他静态文件（如 avatar.png）
# --- DEBUG: 日志中间件 ---
from fastapi import Request
@app.middleware("http")
async def log_requests(request: Request, call_next):
    print(f"Request: {request.method} {request.url.path}")
    response = await call_next(request)
    return response

@app.get("/hello")
async def hello():
    return {"message": "Hello! Server is running!"}

# 放在文件末尾，作为兜底
@app.get("/{file_path:path}")
async def read_dist_file(file_path: str):
    # 排除 api 路径，防止冲突
    if file_path.startswith("api/") or file_path.startswith("images/"):
        from fastapi import HTTPException
        raise HTTPException(status_code=404)
    
    # 如果是空路径 (根目录)，手动重定向到 index.html
    if file_path == "" or file_path == "/":
        if os.path.exists(os.path.join(FRONTEND_DIST, "index.html")):
            return FileResponse(os.path.join(FRONTEND_DIST, "index.html"))
        return HTMLResponse(content="<h1>Root: Frontend index.html not found</h1>", status_code=404)

    full_path = os.path.join(FRONTEND_DIST, file_path)
    if os.path.exists(full_path) and os.path.isfile(full_path):
        return FileResponse(full_path)
    
    # 如果是 SPA 路由 (即找不到文件)，也返回 index.html
    if os.path.exists(os.path.join(FRONTEND_DIST, "index.html")):
        return FileResponse(os.path.join(FRONTEND_DIST, "index.html"))
    return HTMLResponse(content=f"<h1>File not found & No index.html</h1><p>Path: {file_path}</p>", status_code=404)

if __name__ == "__main__":
    # 启动服务，默认端口 8000
    print(f"Starting server... Serving from {GAME_DOC_PATH}")
    uvicorn.run(app, host="0.0.0.0", port=8000)

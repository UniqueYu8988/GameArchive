import os
import shutil
import json
import re

# 配置
# 优先查找本地 'games' 文件夹
LOCAL_GAMES_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "games")
SOURCE_DIR = LOCAL_GAMES_PATH if os.path.exists(LOCAL_GAMES_PATH) else r"C:\Users\Yu\OneDrive\图片\数据备份"
FRONTEND_PUBLIC = os.path.join(os.path.dirname(os.path.abspath(__file__)), "frontend", "public")
TARGET_IMG_DIR = os.path.join(FRONTEND_PUBLIC, "static_games")
TARGET_JSON_PATH = os.path.join(FRONTEND_PUBLIC, "static_data.json")

def generate_static_site():
    print("正在准备静态化导出...")
    
    # 1. 清理并重建目标目录
    if os.path.exists(TARGET_IMG_DIR):
        shutil.rmtree(TARGET_IMG_DIR)
    os.makedirs(TARGET_IMG_DIR)
    
    data = []
    
    # 2. 扫描并复制文件
    if not os.path.exists(SOURCE_DIR):
        print(f"Error: 源目录不存在 {SOURCE_DIR}")
        return

    print("正在复制图片并生成数据...")
    for folder_name in os.listdir(SOURCE_DIR):
        source_folder = os.path.join(SOURCE_DIR, folder_name)
        if not os.path.isdir(source_folder):
            continue

        # 提取年份
        year_match = re.search(r'(\d{4})', folder_name)
        year = year_match.group(1) if year_match else "Other"
        
        # 在目标目录创建对应文件夹
        target_folder = os.path.join(TARGET_IMG_DIR, folder_name)
        os.makedirs(target_folder, exist_ok=True)
        
        games = []
        for file_name in os.listdir(source_folder):
            if file_name.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
                source_file = os.path.join(source_folder, file_name)
                target_file = os.path.join(target_folder, file_name)
                
                # 复制图片
                shutil.copy2(source_file, target_file)
                
                # 生成相对路径的 URL (注意：URL 路径中使用正斜杠 /)
                # 最终在网页中的路径将是: /static_games/文件夹/文件名
                url_path = f"/static_games/{folder_name}/{file_name}"
                
                games.append({
                    "id": f"{folder_name}/{file_name}",
                    "name": os.path.splitext(file_name)[0],
                    "url": url_path,
                    "year": year
                })
        
        if games:
            data.append({
                "category": folder_name,
                "year": year,
                "games": games
            })
            print(f"  - 处理: {folder_name} ({len(games)} 张图片)")

    # 3. 按年份排序
    data.sort(key=lambda x: x['year'] if x['year'].isdigit() else '0', reverse=True)

    # 4. 写入 JSON 数据文件
    with open(TARGET_JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"\n成功！数据已生成到: {TARGET_JSON_PATH}")
    print(f"图片已复制到: {TARGET_IMG_DIR}")

if __name__ == "__main__":
    try:
        generate_static_site()
    except Exception as e:
        print(f"发生错误: {e}")
        import traceback
        traceback.print_exc()

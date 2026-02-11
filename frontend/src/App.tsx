import { useEffect, useState, useRef } from 'react';
import { Sun, Moon, Volume2, VolumeX, ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MinecraftChest from './MinecraftChest';

interface Game {
  id: string;
  name: string;
  url: string;
  year: string;
}

interface Category {
  category: string;
  year: string;
  games: Game[];
}

// 修改为相对路径，这样打包后无论是 localhost 还是公网域名都能正常请求
const API_BASE = "";

// 补充 2010 年之前的描述 (虽然没有游戏数据，但在 UI 上展示)
const ORIGIN_YEAR = "2001";
const YEAR_DESCRIPTIONS: Record<string, string> = {
  "2001": "故事的起点，玩家 1 号登录地球Online。虽未握得手柄，但眼中的光，已为此后的冒险埋下了伏笔。",
  "2010": "那一年，屏幕微光初现。在网页的方寸之间，我第一次叩响了通往异世界的门扉。",
  "2015": "指尖流淌的时光，将灵魂安放于掌心。在触控的交互中，沉浸于移动时代的浪潮。",
  "2020": "穿过蒸汽的迷雾，在独行的旅途中驻足。Steam 开启的不仅是游戏库，更是对第九艺术深邃的探索。",
  "2023": "绿色的 X 光标点亮了客厅的一角。摆脱繁杂的参数，我重新拥抱了主机游戏最纯粹的快乐。",
  "2024": "从红蓝的跃动到白色的巨塔，跨越御三家的边界，构筑起无尽的虚拟疆域。",
  "2025": "在工业化的喧嚣外，听见独立灵魂的低语。那些小而美的故事，成了我与创作者之间最私密的共鸣。",
  "2026": "未完待续的诗篇。手柄握在掌心，只要心怀热忱，这场名为人生的游戏就永远没有具体的终点……"
};

function App() {
  const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>(
    (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
  );
  
  // 背景音乐状态 (默认静音/不播放)
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 回到顶部按钮状态
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // 监听滚动，控制回到顶部按钮显示
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMute = () => {
    if (audioRef.current) {
        if (isMuted) {
            // 当前是静音(停止)状态 -> 点击播放
            audioRef.current.play().catch(e => console.error("Play failed:", e));
            setIsMuted(false);
        } else {
            // 当前是播放状态 -> 点击暂停
            audioRef.current.pause();
            setIsMuted(true);
        }
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
     try {
       const staticResponse = await fetch('static_data.json');
       if (staticResponse.ok) {
         const data = await staticResponse.json();
         setData(data);
         setLoading(false);
         return; 
       }
 
       const response = await fetch(`${API_BASE}/api/games`);
       if (!response.ok) throw new Error('Failed to fetch from API');
       const result = await response.json();
       setData(result);
       setLoading(false);
     } catch (error) {
       console.error("Failed to fetch games:", error);
       setLoading(false);
     }
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const allGamesSorted = data
    .flatMap(cat => cat.games)
    .sort((a, b) => b.year.localeCompare(a.year));

  const rows: Game[][] = Array.from({ length: 7 }, () => []);
  allGamesSorted.forEach((game, index) => {
    rows[index % 7].push(game);
  });

  const processedRows = rows.map(row => {
    if (row.length === 0) return [];
    return [...row, ...row, ...row, ...row];
  });

  const [row1, row2, row3, row4, row5, row6, row7] = processedRows;

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        <p>正在拉取您的游戏馆藏...</p>
      </div>
    );
  }

  return (
    <div className="App">
      {/* 全局背景音乐 */}
      <audio ref={audioRef} src="/bgm.mp3" loop />

      {/* 沉浸式头部 */}
      <header className="app-header">
        <div className="header-content">
          <img 
            src="/assets/avatar.png" 
            alt="Avatar" 
            className="avatar header-avatar" 
          />
          <div className="header-text">
            <h1 className="header-title">
              GameArchive
            </h1>
            <p className="header-desc">
              收录共计 {allGamesSorted.length} 款作品。这里是我的数字灵魂碎片，在比特流中永恒回响。
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', position: 'relative' }}>
             {/* 音乐开关 */}
             <button 
              onClick={toggleMute}
              className="theme-toggle"
              style={{ position: 'static' }}
              title={isMuted ? '播放音乐' : '暂停音乐'}
            >
              {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </button>

            {/* 主题开关 */}
            <button 
              onClick={toggleTheme}
              className="theme-toggle"
              style={{ position: 'static' }}
              title={theme === 'light' ? '切换到暗黑模式' : '切换到明亮模式'}
            >
              {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
            </button>
        </div>
      </header>

      <main className="container" style={{ paddingBottom: '4rem' }}>
        
        {/* 第一部分：无尽艺廊 (总览) */}
        <section style={{ marginBottom: '2rem', position: 'relative' }}>
          <div className="scrolling-wrapper">
            {[row1, row2, row3, row4, row5, row6, row7].map((row, index) => (
              <div key={index} className={`scroll-track ${index % 2 === 0 ? 'animate-left' : 'animate-right'}`} style={{ marginTop: index === 0 ? 0 : '0.8rem' }}>
                {row.map((game, i) => (
                  <div key={`${index}-${i}`} className="game-card-mini">
                    <img src={`${API_BASE}${game.url}`} alt={game.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            ))}
          </div>
          {/* 视觉分割遮罩 */}
          <div style={{ 
            position: 'absolute', 
            bottom: 0, 
            left: 0, 
            right: 0, 
            height: '100px', 
            background: 'linear-gradient(to top, var(--bg-primary), transparent)',
            pointerEvents: 'none'
          }} />
        </section>

        {/* 第二部分：年度历程 */}
        <section style={{ padding: '0 1rem' }}>
          
          {data.map((category) => (
            <div key={category.category} className="year-section" style={{ marginBottom: '5rem' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '1rem' }}>
                <h2 className="year-title" style={{ fontSize: '3rem', borderLeft: 'none', paddingLeft: 0 }}>{category.year}</h2>
                <div style={{ height: '2px', flex: 1, background: 'var(--glass-border)' }}></div>
              </div>
              
              {YEAR_DESCRIPTIONS[category.year] && (
                <p className="year-desc" style={{ fontSize: '1.1rem', marginBottom: '2rem', paddingLeft: '0' }}>
                  {YEAR_DESCRIPTIONS[category.year]}
                </p>
              )}

              <motion.div 
                className="year-grid"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.02, 
                      delayChildren: 0.1
                    }
                  }
                }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "100px" }}
              >
                {category.games.map((game) => (
                  <motion.div 
                    key={game.id} 
                    className="game-card"
                    style={{ width: '100%' }}
                    variants={{
                      hidden: { opacity: 0, scale: 0.8 },
                      visible: { 
                        opacity: 1, 
                        scale: 1,
                        transition: { duration: 0.4, ease: "easeOut" }
                      }
                    }}
                    whileHover={{ scale: 1.05, y: -5, zIndex: 10, transition: { duration: 0.2 } }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img src={`${API_BASE}${game.url}`} alt={game.name} loading="lazy" />
                    <div className="info"><h3>{game.name}</h3></div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          ))}

          {/* 补充：2001 起源章节 (没有游戏卡片，只有文字) */}
          <div key="origin-2001" className="year-section" style={{ marginBottom: '5rem' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '1rem' }}>
                <h2 className="year-title" style={{ fontSize: '3rem', borderLeft: 'none', paddingLeft: 0 }}>{ORIGIN_YEAR}</h2>
                <div style={{ height: '2px', flex: 1, background: 'var(--glass-border)' }}></div>
              </div>
              <p className="year-desc" style={{ fontSize: '1.1rem', marginBottom: '2rem', paddingLeft: '0' }}>
                  {YEAR_DESCRIPTIONS[ORIGIN_YEAR]}
              </p>
          </div>

        </section>

      </main>

      <footer style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', borderTop: '1px solid var(--glass-border)' }}>
        <p style={{ marginBottom: '2rem' }}>© 2026 Yu's GameArchive | Crafted with ❤️ for Gaming</p>
        
        {/* 彩蛋区域 */}
        <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center' }}>
            <MinecraftChest />
        </div>
      </footer>

      {/* 回到顶部按钮 */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={scrollToTop}
            style={{
              position: 'fixed',
              bottom: '2rem',
              right: '2rem',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: 'var(--glass)',
              border: '1px solid var(--glass-border)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)',
              zIndex: 1000,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;

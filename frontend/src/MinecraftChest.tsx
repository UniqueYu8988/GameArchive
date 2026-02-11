import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function MinecraftChest() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    if (!isOpen) {
      setIsOpen(true);
      
      // 延迟一点点触发礼花，配合箱子打开动画
      setTimeout(() => {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.8 }, // 从屏幕底部稍微往上一点的位置发射
          colors: ['#4deeea', '#ffe700', '#ffffff'] // 钻石蓝、金、白
        });
      }, 300);
    }
  };

  return (
    <div style={{ 
      position: 'relative', 
      width: '100px', 
      height: '100px', 
      margin: '0 auto', 
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-end',
      perspective: '1000px'
    }} onClick={handleClick}>
      
      {/* 钻石 (藏在箱子里) -> 现在使用 Emoji */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 0, opacity: 0, scale: 0.5, rotate: 0 }}
            animate={{ 
              y: -100, 
              opacity: 1, 
              scale: 1.5, 
              rotate: 360,
              filter: "drop-shadow(0 0 15px #00ffff)" 
            }}
            transition={{ duration: 0.8, ease: "backOut" }}
            style={{
              position: 'absolute',
              zIndex: 10,
              fontSize: '40px', // Emoji 大小
              bottom: '40px', // inside chest
              textAlign: 'center',
              lineHeight: 1,
              display: 'flex',
              justifyContent: 'center'
            }}
          >
             <img src="/assets/diamond.png" alt="Diamond" style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 箱子本体 (像素风 CSS) */}
      <motion.div
        animate={isOpen ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 0.2 }}
        className={`pixel-chest ${isOpen ? 'open' : ''}`}
      >
        <div className="chest-lid"></div>
        <div className="chest-body">
            <div className="chest-lock"></div>
        </div>
      </motion.div>

      {/* 提示光圈 */}
      {!isOpen && (
        <motion.div 
            animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.9, 1.1, 0.9] }}
            transition={{ repeat: Infinity, duration: 2 }}
            style={{
                position: 'absolute',
                bottom: '10px',
                width: '60px',
                height: '10px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '50%',
                filter: 'blur(5px)',
                zIndex: -1
            }}
        />
      )}
    </div>
  );
}


import React, { useState, useEffect, useRef } from 'react';
import { Mood, GameState } from './types.ts';
import { GREETINGS, CHAT_RESOURCES, TOUCH_REACTIONS, GIFT_REACTIONS, SPECIAL_EVENTS, FOCUS_DIALOGUE } from './data.ts';

const App: React.FC = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [state, setState] = useState<GameState>({
    affection: 0,
    mood: Mood.CALM,
    currentMessage: "你好，很高兴见到你。",
    isAudioPlaying: false,
    interactionCount: 0,
    unlockedEvents: [],
    isFocusMode: false,
    focusTimeLeft: 0
  });

  const [currentTime, setCurrentTime] = useState(new Date());
  const [showEvent, setShowEvent] = useState<{title: string, text: string} | null>(null);
  const [ambientFilter, setAmbientFilter] = useState('');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<number | null>(null);

  // 启动游戏逻辑
  const startGame = () => {
    setGameStarted(true);
    // 延迟播放音效确保环境已激活
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().catch(() => console.log("Audio autoplay blocked"));
        setState(prev => ({ ...prev, isAudioPlaying: true }));
      }
    }, 100);
  };

  // 实时时钟和环境光效
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      
      const hour = now.getHours();
      if (hour >= 18 || hour < 6) {
        setAmbientFilter('brightness(0.7) sepia(0.2) hue-rotate(240deg)'); // 深夜蓝调
      } else if (hour >= 16 && hour < 18) {
        setAmbientFilter('brightness(0.9) sepia(0.3) hue-rotate(-30deg)'); // 傍晚余晖
      } else {
        setAmbientFilter('brightness(1.05)'); // 白天明亮
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 欢迎语
  useEffect(() => {
    if (!gameStarted) return;
    const hour = new Date().getHours();
    let timeKey = 'afternoon';
    if (hour >= 5 && hour < 12) timeKey = 'morning';
    else if (hour >= 18 || hour < 5) timeKey = 'night';
    
    const possibleGreetings = GREETINGS[timeKey as keyof typeof GREETINGS];
    const randomGreeting = possibleGreetings[Math.floor(Math.random() * possibleGreetings.length)];
    
    setState(prev => ({
      ...prev,
      currentMessage: randomGreeting.text,
      mood: randomGreeting.mood
    }));
  }, [gameStarted]);

  // 专注计时器
  useEffect(() => {
    if (state.isFocusMode && state.focusTimeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setState(prev => {
          if (prev.focusTimeLeft <= 1) {
            clearInterval(timerRef.current!);
            return { ...prev, isFocusMode: false, focusTimeLeft: 0, currentMessage: "辛苦了，你做得非常好。", affection: prev.affection + 10 };
          }
          if (prev.focusTimeLeft % 300 === 0) {
             const d = FOCUS_DIALOGUE[Math.floor(Math.random() * FOCUS_DIALOGUE.length)];
             return { ...prev, focusTimeLeft: prev.focusTimeLeft - 1, currentMessage: d.text, mood: d.mood };
          }
          return { ...prev, focusTimeLeft: prev.focusTimeLeft - 1 };
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [state.isFocusMode]);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (state.isAudioPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log("Audio play failed"));
      }
      setState(prev => ({ ...prev, isAudioPlaying: !prev.isAudioPlaying }));
    }
  };

  const handleInteraction = (type: string) => {
    if (state.isFocusMode) return;
    let newMsg = "";
    let newMood = Mood.CALM;
    let affectionGain = 1;

    switch (type) {
      case 'chat':
        const chat = CHAT_RESOURCES[Math.floor(Math.random() * CHAT_RESOURCES.length)];
        newMsg = chat.text;
        newMood = chat.mood;
        break;
      case 'touch':
        const touch = TOUCH_REACTIONS[Math.floor(Math.random() * TOUCH_REACTIONS.length)];
        newMsg = touch.text;
        newMood = touch.mood;
        affectionGain = 2;
        break;
      case 'gift':
        const gift = GIFT_REACTIONS[Math.floor(Math.random() * GIFT_REACTIONS.length)];
        newMsg = gift.text;
        newMood = gift.mood;
        affectionGain = 5;
        break;
    }

    setState(prev => ({
      ...prev,
      currentMessage: newMsg,
      mood: newMood,
      affection: prev.affection + affectionGain,
      interactionCount: prev.interactionCount + 1
    }));
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // 游戏未开始显示的封面
  if (!gameStarted) {
    return (
      <div className="relative w-full h-screen bg-black flex flex-col items-center justify-center font-['ZCOOL_KuaiLe'] p-10 text-center">
        <div className="pixel-border bg-white/10 p-8 space-y-6">
          <div className="text-pink-500 text-6xl animate-pulse">❤️</div>
          <h1 className="text-white text-4xl font-black tracking-widest">陆沉的午后</h1>
          <p className="text-white/60 text-sm">—— 像素间的温度，只为你存在 ——</p>
          <button 
            onClick={startGame}
            className="pixel-button bg-pink-500 text-white px-10 py-4 text-xl mt-8"
          >
            开启心动
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#1a1a2e] font-['ZCOOL_KuaiLe'] select-none">
      
      {/* 角色全屏展示 */}
      <div 
        className="absolute inset-0 z-0 transition-all duration-1000"
        style={{ filter: ambientFilter }}
      >
        <video 
          ref={videoRef}
          src="./juese1.mp4" 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover pixelated"
        />
        {/* 透明点击层：点击人物任意位置触发“触碰” */}
        <div 
          className="absolute inset-0 z-10" 
          onClick={() => handleInteraction('touch')}
        ></div>
      </div>

      {/* 顶部 UI */}
      <div className="absolute top-0 left-0 right-0 p-6 z-30 flex justify-between items-start pointer-events-none">
        <div className="flex flex-col space-y-1">
          <div className="text-white text-4xl font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="pixel-border bg-black/30 backdrop-blur-sm px-3 py-1 inline-flex items-center space-x-2 border-white/20">
            <span className="text-[10px] text-white/70 uppercase">Affection</span>
            <span className="text-sm text-pink-400 font-bold">{state.affection}</span>
          </div>
        </div>
        
        <div className="flex flex-col items-end space-y-3 pointer-events-auto">
          <button 
            onClick={toggleAudio}
            className="w-10 h-10 pixel-border bg-black/40 backdrop-blur-md flex items-center justify-center text-xl text-white border-white/20"
          >
            {state.isAudioPlaying ? '🎵' : '🔇'}
          </button>
          
          {state.isFocusMode && (
            <div className="pixel-border bg-pink-500 text-white px-3 py-1 text-lg font-bold animate-pulse">
              {formatTime(state.focusTimeLeft)}
            </div>
          )}
        </div>
      </div>

      {/* 底部 UI */}
      <div className="absolute bottom-0 left-0 right-0 p-4 pb-8 z-30 flex flex-col space-y-4">
        
        {/* 心情气泡 */}
        {state.mood !== Mood.CALM && (
          <div className="self-end mr-6 mb-[-10px] pixel-border bg-white px-3 py-1 text-lg animate-bounce shadow-2xl">
            {state.mood === Mood.SHY && '💕'}
            {state.mood === Mood.HAPPY && '✨'}
            {state.mood === Mood.TEASING && '😏'}
            {state.mood === Mood.FOCUS && '⏳'}
          </div>
        )}

        {/* 沉浸式对话框 */}
        <div className="pixel-border bg-black/60 backdrop-blur-xl p-5 min-h-[120px] border-white/10">
          <div className="text-white/40 text-[10px] uppercase tracking-widest mb-1">Lu Chen</div>
          <div className="text-white text-lg leading-relaxed font-medium drop-shadow-md">
            {state.currentMessage}
          </div>
        </div>

        {/* 交互面板 */}
        {!state.isFocusMode ? (
          <div className="grid grid-cols-4 gap-2 h-14">
            <button onClick={() => handleInteraction('chat')} className="pixel-button bg-white/5 text-white border-white/20 text-xs">💬 聊天</button>
            <button onClick={() => handleInteraction('gift')} className="pixel-button bg-white/5 text-white border-white/20 text-xs">🎁 投喂</button>
            <button 
              onClick={() => setState(prev => ({ ...prev, isFocusMode: true, focusTimeLeft: 1500, mood: Mood.FOCUS, currentMessage: "我会一直看着你的，专心开始吧。" }))} 
              className="pixel-button bg-pink-600/60 text-white border-white/20 text-xs col-span-2 flex flex-col items-center justify-center"
            >
              <span>🧘 专注陪伴</span>
              <span className="text-[8px] opacity-70">25 MINS</span>
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setState(prev => ({ ...prev, isFocusMode: false, focusTimeLeft: 0, currentMessage: "休息一下吧。" }))} 
            className="pixel-button bg-red-500/60 text-white border-white/20 h-14"
          >
            结束专注
          </button>
        )}
      </div>

      <audio ref={audioRef} src="./music.mp3" loop />

      {/* 剧情弹窗 */}
      {showEvent && (
        <div className="absolute inset-0 bg-black/95 z-50 flex items-center justify-center p-10 backdrop-blur-md">
          <div className="pixel-border bg-white p-8 max-w-xs w-full text-center space-y-6">
            <div className="text-4xl">🏆</div>
            <h2 className="text-[#ff4d6d] text-2xl font-black tracking-tighter">【{showEvent.title}】</h2>
            <p className="text-gray-800 text-base leading-relaxed">{showEvent.text}</p>
            <button 
              onClick={() => setShowEvent(null)}
              className="pixel-button w-full py-4 bg-[#ff4d6d] text-white font-bold"
            >
              铭记此刻
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

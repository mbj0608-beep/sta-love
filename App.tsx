
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

    // 检查是否有新成就
    const nextEvent = SPECIAL_EVENTS.find(e => e.threshold === state.interactionCount + 1);
    if (nextEvent && !state.unlockedEvents.includes(nextEvent.title)) {
      setShowEvent({ title: nextEvent.title, text: nextEvent.text });
      setState(prev => ({ ...prev, unlockedEvents: [...prev.unlockedEvents, nextEvent.title] }));
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

  if (!gameStarted) {
    return (
      <div className="relative w-full h-screen bg-[#121212] flex flex-col items-center justify-center font-['ZCOOL_KuaiLe'] p-10 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-pink-900/20 to-black pointer-events-none"></div>
        <div className="pixel-border bg-white/5 backdrop-blur-md p-10 space-y-8 z-10 border-white/20">
          <div className="text-pink-500 text-7xl animate-pulse drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]">❤️</div>
          <div className="space-y-2">
            <h1 className="text-white text-5xl font-black tracking-[0.2em]">星月的午后</h1>
            <p className="text-pink-200/50 text-xs tracking-widest">A PIXEL ROMANCE STORY</p>
          </div>
          <p className="text-white/60 text-sm italic">“即使在像素的世界里，我也想紧紧握住你的手。”</p>
          <button 
            onClick={startGame}
            className="pixel-button bg-pink-500 hover:bg-pink-400 text-white px-12 py-5 text-2xl mt-4 shadow-[0_4px_0_0_#9d174d]"
          >
            开启心动
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black font-['ZCOOL_KuaiLe'] select-none">
      
      {/* 角色全屏展示：撑满屏幕 */}
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
          className="w-full h-full object-cover pixelated opacity-90"
        />
        <div 
          className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-transparent to-black/30" 
          onClick={() => handleInteraction('touch')}
        ></div>
      </div>

      {/* 顶部 UI：状态与时间 */}
      <div className="absolute top-0 left-0 right-0 p-6 pt-10 z-30 flex justify-between items-start pointer-events-none">
        <div className="flex flex-col space-y-2">
          <div className="text-white text-5xl font-black drop-shadow-[0_4px_8px_rgba(0,0,0,1)] tracking-tighter">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="pixel-border bg-black/40 backdrop-blur-md px-3 py-1.5 inline-flex items-center space-x-2 border-white/10">
            <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></div>
            <span className="text-[10px] text-white/50 uppercase font-bold tracking-widest">Trust</span>
            <span className="text-base text-pink-400 font-black">{state.affection}</span>
          </div>
        </div>
        
        <div className="flex flex-col items-end space-y-4 pointer-events-auto">
          <button 
            onClick={toggleAudio}
            className="w-12 h-12 pixel-border bg-black/50 backdrop-blur-lg flex items-center justify-center text-2xl text-white border-white/20 shadow-xl"
          >
            {state.isAudioPlaying ? '🎵' : '🔇'}
          </button>
          
          {state.isFocusMode && (
            <div className="pixel-border bg-pink-600 text-white px-4 py-2 text-xl font-black shadow-lg animate-pulse border-white/40">
              {formatTime(state.focusTimeLeft)}
            </div>
          )}
        </div>
      </div>

      {/* 底部 UI：对话与交互 */}
      <div className="absolute bottom-0 left-0 right-0 p-5 pb-10 z-30 flex flex-col space-y-5">
        
        {/* 浮动心情提示 */}
        {state.mood !== Mood.CALM && (
          <div className="self-end mr-4 mb-[-15px] pixel-border bg-white px-4 py-2 text-2xl animate-bounce shadow-[4px_4px_0_0_rgba(0,0,0,0.3)] border-black">
            {state.mood === Mood.SHY && '💖'}
            {state.mood === Mood.HAPPY && '✨'}
            {state.mood === Mood.TEASING && '😏'}
            {state.mood === Mood.FOCUS && '⏳'}
          </div>
        )}

        {/* 沉浸式对话框：半透明磨砂 */}
        <div className="pixel-border bg-black/50 backdrop-blur-2xl p-6 min-h-[130px] border-white/10 shadow-2xl group transition-all duration-300 active:bg-black/70">
          <div className="flex justify-between items-center mb-2">
            <div className="text-pink-400 text-[12px] font-black uppercase tracking-[0.3em]">Xing Yue / 星月</div>
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-white/20"></div>
              <div className="w-1 h-1 bg-white/40"></div>
              <div className="w-1 h-1 bg-white/60"></div>
            </div>
          </div>
          <div className="text-white text-xl leading-relaxed font-bold tracking-wide drop-shadow-md">
            {state.currentMessage}
          </div>
          <div className="absolute bottom-3 right-5 text-white/20 text-xs animate-pulse font-sans">TAP TO TOUCH</div>
        </div>

        {/* 交互按钮栏 */}
        {!state.isFocusMode ? (
          <div className="grid grid-cols-4 gap-3 h-16">
            <button onClick={() => handleInteraction('chat')} className="pixel-button bg-white/10 text-white border-white/20 text-sm hover:bg-white/20">💬 聊天</button>
            <button onClick={() => handleInteraction('gift')} className="pixel-button bg-white/10 text-white border-white/20 text-sm hover:bg-white/20">🎁 投喂</button>
            <button 
              onClick={() => setState(prev => ({ ...prev, isFocusMode: true, focusTimeLeft: 1500, mood: Mood.FOCUS, currentMessage: "我会一直陪着你的，放心开始吧。" }))} 
              className="pixel-button bg-gradient-to-r from-pink-600/60 to-purple-600/60 text-white border-white/30 text-sm col-span-2 flex flex-col items-center justify-center group"
            >
              <span className="font-black">🧘 专注陪伴</span>
              <span className="text-[9px] opacity-70 font-sans tracking-widest">25:00 POMODORO</span>
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setState(prev => ({ ...prev, isFocusMode: false, focusTimeLeft: 0, currentMessage: "辛苦了，稍微休息一下吧。" }))} 
            className="pixel-button bg-red-500/50 text-white border-white/30 h-16 text-lg font-black tracking-widest backdrop-blur-md"
          >
            结束专注陪伴
          </button>
        )}
      </div>

      <audio ref={audioRef} src="./music.mp3" loop />

      {/* 剧情与成就弹窗 */}
      {showEvent && (
        <div className="absolute inset-0 bg-black/90 z-50 flex items-center justify-center p-8 backdrop-blur-2xl transition-all animate-in fade-in zoom-in duration-500">
          <div className="pixel-border bg-white p-10 max-w-sm w-full text-center space-y-8 shadow-[0_0_50px_rgba(255,255,255,0.1)]">
            <div className="text-6xl animate-bounce">🎁</div>
            <div className="space-y-2">
              <h2 className="text-pink-600 text-3xl font-black tracking-tighter">【{showEvent.title}】</h2>
              <div className="h-0.5 w-12 bg-pink-100 mx-auto"></div>
            </div>
            <p className="text-gray-800 text-lg leading-relaxed font-bold px-4">{showEvent.text}</p>
            <button 
              onClick={() => setShowEvent(null)}
              className="pixel-button w-full py-5 bg-pink-600 text-white font-black text-xl shadow-[0_4px_0_0_#9d174d] active:shadow-none translate-y-0 active:translate-y-1"
            >
              铭记此刻
            </button>
          </div>
        </div>
      )}

      {/* 氛围装饰颗粒 */}
      <div className="absolute inset-0 pointer-events-none opacity-30 z-20">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i}
            className="absolute bg-white/80 w-1 h-1 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `pulse ${2 + Math.random() * 3}s infinite alternate`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default App;

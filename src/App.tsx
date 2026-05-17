import React from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Activity, Repeat } from 'lucide-react';
import { useMusicPlayer, formatTime } from './hooks/useMusicPlayer';
import { useSnakeGame, GRID_SIZE } from './hooks/useSnakeGame';

export default function App() {
  const {
    tracks,
    currentTrackIndex,
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    isMuted,
    volume,
    isLooping,
    audioRef,
    togglePlay,
    nextTrack,
    prevTrack,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleSeek,
    toggleMute,
    changeVolume,
    selectTrack,
    toggleLoop
  } = useMusicPlayer();

  const {
    snake,
    food,
    score,
    bestScore,
    gameOver,
    isPaused,
    stage,
    resetGame,
  } = useSnakeGame();

  return (
    <div className="bg-[#050505] text-white w-full h-full min-h-screen flex flex-col font-sans border-[12px] border-[#0a0a0a] overflow-hidden select-none">
      {/* Top Header Navigation */}
      <header className="h-16 flex items-center justify-between px-8 border-b border-white/10 bg-[#080808]">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 bg-[#00f3ff] rounded-full shadow-[0_0_10px_#00f3ff]"></div>
          <h1 className="text-xl font-bold tracking-tighter uppercase hidden sm:block">Neon Sync <span className="text-[#00f3ff]">//</span> System</h1>
        </div>
        <div className="flex gap-4 md:gap-6 text-xs font-mono text-gray-500 uppercase tracking-widest items-center">
          <span className="hidden sm:inline">Session: Active</span>
          <span className="text-[#ff00ff]">Sync: 128 BPM</span>
        </div>
      </header>

      {/* Main Bento Grid */}
      <main className="flex-1 grid grid-cols-1 md:grid-cols-12 grid-rows-none md:grid-rows-6 gap-4 p-6 overflow-auto md:overflow-hidden">
        
        {/* Track List (Left Column) */}
        <div className="md:col-span-3 md:row-span-4 bg-[#0a0a0a] border border-white/5 rounded-2xl p-5 flex flex-col max-h-min md:max-h-full overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-semibold">Audio Repository</h2>
          </div>
          
          <div className="flex flex-col gap-2 overflow-y-auto flex-1 pr-2 custom-scrollbar">
            {tracks.map((track, i) => (
              <div
                key={track.id}
                className={`p-3 rounded-xl flex items-center justify-between group transition-colors ${
                  currentTrackIndex === i 
                    ? 'bg-[#00f3ff]/10 border border-[#00f3ff]/30' 
                    : 'bg-white/5 border border-white/5 hover:bg-white/10'
                }`}
              >
                <button onClick={() => selectTrack(i)} className="flex flex-col gap-1 text-left flex-1 overflow-hidden">
                  <span className={`text-xs font-bold truncate ${currentTrackIndex === i ? 'text-[#00f3ff]' : ''}`}>
                    0{i + 1}. {track.title}
                  </span>
                  <span className="text-[10px] text-gray-400 truncate">{track.artist}</span>
                </button>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-white/5">
             <div className="flex items-center justify-between text-[10px] text-gray-500 uppercase tracking-widest">
               <span>Status</span>
               <span className={isPlaying ? "text-[#39ff14] animate-pulse" : ""}>
                 {isPlaying ? 'PLAYING' : 'READY'}
               </span>
             </div>
          </div>
        </div>

        {/* Snake Game Arena (Center Piece) */}
        <div className="md:col-span-6 md:row-span-4 bg-black border-2 border-[#39ff14]/30 rounded-3xl relative flex flex-col items-center justify-center min-h-[450px]">
          {/* Game UI Overlay */}
          <div className="absolute top-6 left-6 flex flex-col z-10 pointer-events-none">
             <span className="text-[10px] uppercase text-[#39ff14] font-mono tracking-widest opacity-60">System.Core.Game</span>
             <span className="text-2xl font-mono text-[#39ff14] font-bold">STAGE 0{stage}</span>
          </div>
          
          {/* Snake Game Grid */}
          <div 
            className="w-[400px] h-[400px] relative mt-4 shadow-[0_0_30px_rgba(57,255,20,0.1)] rounded-xl overflow-hidden"
            style={{ 
              backgroundImage: 'radial-gradient(#111 1px, transparent 0)', 
              backgroundSize: `${100 / GRID_SIZE}% ${100 / GRID_SIZE}%` 
            }}
          >
            {/* Snake Body */}
            {snake.map((segment, index) => (
              <div
                key={index}
                className={`absolute rounded-sm ${index === 0 ? 'bg-[#39ff14] z-10 shadow-[0_0_15px_#39ff14]' : 'bg-[#39ff14]/80'}`}
                style={{
                  left: `${(segment.x / GRID_SIZE) * 100}%`,
                  top: `${(segment.y / GRID_SIZE) * 100}%`,
                  width: `${100 / GRID_SIZE}%`,
                  height: `${100 / GRID_SIZE}%`,
                  transform: 'scale(0.9)',
                }}
              />
            ))}

            {/* Food */}
            <div
              className="absolute bg-[#ff00ff] rounded-full z-10 shadow-[0_0_20px_#ff00ff] animate-[neon-pulse_1.5s_infinite]"
              style={{
                left: `${(food.x / GRID_SIZE) * 100}%`,
                top: `${(food.y / GRID_SIZE) * 100}%`,
                width: `${100 / GRID_SIZE}%`,
                height: `${100 / GRID_SIZE}%`,
                transform: 'scale(0.8)',
              }}
            />
            
            {/* Game Over / Pause Overlays */}
            {gameOver && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-20">
                <h3 className="text-[#ff00ff] font-bold text-3xl mb-2 drop-shadow-[0_0_15px_#ff00ff] tracking-widest">CRASHED</h3>
                <p className="text-gray-300 font-mono text-sm mb-6">FINAL SCORE: {score}</p>
                <button 
                  onClick={resetGame}
                  className="px-6 py-2 border border-[#39ff14] text-[#39ff14] font-mono text-xs tracking-widest rounded hover:bg-[#39ff14] hover:text-black transition-all shadow-[0_0_10px_rgba(57,255,20,0.3)]"
                >
                  REBOOT_SYSTEM
                </button>
              </div>
            )}

            {!gameOver && isPaused && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-20">
                <h3 className="text-[#39ff14] font-bold text-2xl tracking-[0.3em] drop-shadow-[0_0_15px_#39ff14] animate-pulse">STANDBY</h3>
              </div>
            )}
          </div>

          <div className="absolute bottom-6 text-[#39ff14]/40 font-mono text-xs uppercase tracking-tighter">
            Use [W][A][S][D] to navigate the stream
          </div>
        </div>

        {/* Game Stats (Right Column Top) */}
        <div className="md:col-span-3 md:row-span-2 bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase text-gray-500 font-bold">Current Score</span>
            <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-[#39ff14] shadow-[0_0_8px_#39ff14]' : 'bg-gray-600'}`}></div>
          </div>
          <span className="text-6xl font-mono text-[#39ff14] font-bold drop-shadow-[0_0_15px_rgba(57,255,20,0.4)]">
            {score.toString().padStart(4, '0')}
          </span>
          <div className="h-[1px] bg-white/10 w-full my-4"></div>
          <div className="flex justify-between items-end">
            <span className="text-[10px] uppercase text-gray-500 border border-white/5 bg-white/5 px-2 py-1 rounded">Best: {bestScore}</span>
            <span className="text-[10px] font-mono text-[#39ff14]">{score > 0 ? `+${score}` : '--'}</span>
          </div>
        </div>

        {/* Visualizer Component (Right Column Bottom) */}
        <div className="md:col-span-3 md:row-span-2 bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 flex flex-col">
          <span className="text-[10px] uppercase text-gray-500 font-bold mb-4 flex items-center gap-2">
            <Activity className="w-3 h-3 text-[#00f3ff]" />
            Frequency Spectrum
          </span>
          <div className="flex-1 flex items-end justify-between gap-1 overflow-hidden">
            {/* Mock visualizer bars */}
            {[20, 45, 80, 100, 60, 40, 15, 30].map((height, i) => (
              <div 
                key={i} 
                className="flex-1 bg-[#00f3ff] transition-all duration-300 w-full"
                style={{ 
                  height: isPlaying ? `${Math.max(10, height * (Math.random() * 0.5 + 0.5))}%` : '5%',
                  opacity: (height / 100) * 0.8 + 0.2
                }}
              ></div>
            ))}
          </div>
        </div>

        {/* Music Control Bar (Bottom Wide) */}
        <div className="md:col-span-12 md:row-span-2 bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6 w-full md:w-1/3">
            <div className="w-16 h-16 bg-[#111] rounded-lg border border-[#00f3ff]/20 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(0,243,255,0.1)]">
              <Activity className="w-8 h-8 text-[#00f3ff]" />
            </div>
            <div className="flex flex-col overflow-hidden w-full">
              <span className="text-lg font-bold truncate text-[#00f3ff]">{currentTrack?.title || 'NO TRACK'}</span>
              <span className="text-xs text-gray-500 font-mono tracking-tighter truncate">
                {currentTrack?.artist || 'SYSTEM'} // {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
          </div>
          
          {/* Playback Controls */}
          <div className="flex items-center gap-8 w-full md:w-1/3 justify-center">
            <button onClick={toggleLoop} className={`transition-colors ${isLooping ? 'text-[#00f3ff] drop-shadow-[0_0_5px_#00f3ff]' : 'text-gray-500 hover:text-white'}`}>
              <Repeat className="w-5 h-5" />
            </button>
            <button onClick={prevTrack} className="text-gray-500 hover:text-white transition-colors">
              <SkipBack className="w-6 h-6" fill="currentColor" />
            </button>
            <button 
              onClick={togglePlay}
              className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-[0_0_15px_rgba(255,255,255,0.4)]"
            >
              {isPlaying ? <Pause className="w-6 h-6" fill="currentColor" /> : <Play className="w-6 h-6 ml-1" fill="currentColor" />}
            </button>
            <button onClick={nextTrack} className="text-gray-500 hover:text-white transition-colors">
              <SkipForward className="w-6 h-6" fill="currentColor" />
            </button>
            <div className="w-5" /> {/* spacer to balance the loop button */}
          </div>

          <div className="w-full md:w-1/3 flex flex-col md:items-end justify-center gap-3">
             <div className="flex items-center gap-3 w-full md:w-auto">
               <button onClick={toggleMute} className="text-gray-500 hover:text-white shrink-0">
                 {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
               </button>
               <input
                 type="range"
                 min="0"
                 max="1"
                 step="0.01"
                 value={isMuted ? 0 : volume}
                 onChange={(e) => changeVolume(parseFloat(e.target.value))}
                 className="w-32 md:w-24 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#00f3ff]"
               />
             </div>
             <input
               type="range"
               min={0}
               max={duration || 100}
               value={currentTime}
               onChange={(e) => handleSeek(Number(e.target.value))}
               className="w-full md:w-3/4 h-1 bg-gray-800 rounded-full appearance-none cursor-pointer accent-[#00f3ff] mt-1"
             />
          </div>
        </div>

      </main>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={currentTrack?.url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={nextTrack}
        crossOrigin="anonymous"
      />
      <style>{`
        @keyframes neon-pulse {
          0%, 100% { opacity: 1; filter: drop-shadow(0 0 20px #ff00ff); }
          50% { opacity: 0.5; filter: drop-shadow(0 0 10px #ff00ff); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 243, 255, 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 243, 255, 0.5);
        }
      `}</style>
    </div>
  );
}

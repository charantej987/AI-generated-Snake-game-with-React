import { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import Mascot from './components/Mascot';
import { Terminal } from 'lucide-react';

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen bg-black text-[#00ffff] flex flex-col relative overflow-hidden font-cyber">
      {/* Header */}
      <header className="w-full p-6 flex items-center justify-between z-10 border-b-4 border-[#ff00ff] bg-black">
        <div className="flex items-center gap-4">
          <Terminal className="text-[#ff00ff]" size={40} />
          <h1 className="text-4xl font-digital font-bold tracking-widest uppercase">
            PROTOCOL::SNAKE
          </h1>
        </div>
        
        <div className="flex flex-col items-end">
          <span className="text-sm text-[#ff00ff] uppercase tracking-widest">DATA_HARVESTED</span>
          <span className="text-6xl font-digital font-bold text-[#00ffff]">
            {score.toString().padStart(4, '0')}
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-16 p-8 z-10 relative">
        
        {/* Game Area */}
        <div className="flex-1 flex justify-center items-center w-full max-w-2xl">
          <SnakeGame onScoreChange={setScore} />
        </div>

        {/* Mascot */}
        <div className="hidden lg:block absolute left-[55%] top-[35%] -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
          <Mascot />
        </div>

        {/* Sidebar / Music Player */}
        <div className="w-full lg:w-auto flex flex-col items-center justify-center gap-8">
          <MusicPlayer />
          
          {/* Decorative Element */}
          <div className="hidden lg:flex flex-col gap-2 w-full">
            <div className="w-full h-1 bg-[#ff00ff]" />
            <div className="flex justify-between px-2">
              <span className="text-[12px] font-digital text-[#00ffff]">STATUS: COMPROMISED</span>
              <span className="text-[12px] font-digital text-[#ff00ff]">ERR_CODE: 0x00F</span>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

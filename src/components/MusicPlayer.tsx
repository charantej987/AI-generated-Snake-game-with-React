import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';

const TRACKS = [
  {
    title: "AUDIO_TRACK_01",
    artist: "UNKNOWN_SOURCE",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    title: "DATA_STREAM_B",
    artist: "SYS.ADMIN",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    title: "VOID_RESONANCE",
    artist: "CORRUPTED_FILE",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Audio play error:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleTrackEnd = () => {
    nextTrack();
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="w-full max-w-md bg-black border-magenta-cyan p-6 relative">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
      />
      
      <div className="absolute top-0 left-0 bg-[#ff00ff] text-black text-[10px] px-2 font-digital">
        AUDIO_SUBSYSTEM
      </div>

      <div className="flex items-center justify-between mb-6 mt-2">
        <div>
          <h3 className="text-xl font-bold text-[#00ffff] tracking-wide font-digital uppercase">{currentTrack.title}</h3>
          <p className="text-sm text-[#ff00ff] font-cyber mt-1 uppercase">[{currentTrack.artist}]</p>
        </div>
        
        {/* Animated Equalizer Bars when playing */}
        <div className="flex items-end gap-1 h-8">
          {[1, 2, 3, 4].map((bar) => (
            <div
              key={bar}
              className={`w-2 bg-[#00ffff] ${isPlaying ? 'animate-pulse' : 'h-1'}`}
              style={{
                height: isPlaying ? `${Math.random() * 100}%` : '4px',
                animationDuration: `${0.1 + Math.random() * 0.2}s`,
                transition: 'height 0.1s ease'
              }}
            />
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 w-full bg-gray-900 mb-6 overflow-hidden border border-[#ff00ff]">
        <div 
          className="h-full bg-[#00ffff] transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <button 
          onClick={toggleMute}
          className="p-2 text-gray-500 hover:text-[#ff00ff] transition-colors"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>

        <div className="flex items-center gap-4">
          <button 
            onClick={prevTrack}
            className="p-3 text-[#00ffff] hover:bg-[#00ffff] hover:text-black transition-all border border-transparent hover:border-[#00ffff]"
          >
            <SkipBack size={24} />
          </button>
          
          <button 
            onClick={togglePlay}
            className="p-4 bg-black border-2 border-[#ff00ff] text-[#ff00ff] hover:bg-[#ff00ff] hover:text-black transition-all duration-0"
          >
            {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
          </button>
          
          <button 
            onClick={nextTrack}
            className="p-3 text-[#00ffff] hover:bg-[#00ffff] hover:text-black transition-all border border-transparent hover:border-[#00ffff]"
          >
            <SkipForward size={24} />
          </button>
        </div>

        <div className="w-9" /> {/* Spacer for balance */}
      </div>
    </div>
  );
}

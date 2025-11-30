import { useEffect, useRef, useState } from "react";
import { Play, Pause, SkipForward, SkipBack } from "lucide-react";
import { motion } from "framer-motion";

export default function Player({ currentTrack, onNext, onPrev }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (currentTrack?.url) {
      audioRef.current.src = currentTrack.url;
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [currentTrack]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current && audioRef.current.duration) {
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] md:w-[60%] bg-[#111] border border-[#222] rounded-2xl shadow-lg backdrop-blur-md text-white p-4 flex flex-col items-center">
      <audio ref={audioRef} onTimeUpdate={handleTimeUpdate} onEnded={onNext} />

      {currentTrack ? (
        <>
          <div className="flex items-center gap-4 w-full">
            <img
              src={currentTrack.thumbnail}
              alt="thumbnail"
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div className="flex-1">
              <p className="font-semibold text-sm truncate">{currentTrack.title}</p>
              <p className="text-xs text-gray-400 truncate">{currentTrack.artist || "Unknown Artist"}</p>
            </div>
            <div className="flex items-center gap-3">
              <SkipBack onClick={onPrev} className="cursor-pointer hover:text-purple-400" />
              <div
                onClick={togglePlay}
                className="p-2 rounded-full bg-purple-600 hover:bg-purple-700 transition"
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              </div>
              <SkipForward onClick={onNext} className="cursor-pointer hover:text-purple-400" />
            </div>
          </div>

          <motion.div
            className="w-full h-1 bg-gray-700 rounded-full mt-3 overflow-hidden"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
          >
            <motion.div
              className="h-1 bg-purple-500"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.2 }}
            />
          </motion.div>
        </>
      ) : (
        <p className="text-gray-500 text-sm">No song playing</p>
      )}
    </div>
  );
}

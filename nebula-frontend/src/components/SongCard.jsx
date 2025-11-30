import { Play } from "lucide-react";

export default function SongCard({ song, onPlay }) {
  return (
    <div
      className="bg-gray-900 rounded-xl p-3 hover:bg-gray-800 transition cursor-pointer relative group"
      onClick={onPlay}
    >
      <img
        src={song.thumbnail}
        alt={song.title}
        className="rounded-lg mb-2 w-full aspect-square object-cover"
      />
      <div className="font-semibold truncate">{song.title}</div>
      <div className="text-sm text-gray-400 truncate">{song.artist}</div>

      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition">
        <Play className="w-10 h-10 text-purple-400" />
      </div>
    </div>
  );
}

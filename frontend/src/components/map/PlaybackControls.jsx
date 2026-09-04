import "./PlaybackControls.css";

export default function PlaybackControls({
  playing,
  setPlaying,
  currentIndex,
  setCurrentIndex,
  maxIndex,
}) {
  return (
    <div className="playback-controls">

      <button
        onClick={() => setPlaying(!playing)}
      >
        {playing ? "⏸ Pause" : "▶ Play"}
      </button>

      <input
        type="range"
        min="0"
        max={maxIndex}
        value={currentIndex}
        onChange={(e) =>
          setCurrentIndex(Number(e.target.value))
        }
      />

      <span>
        {currentIndex + 1} / {maxIndex + 1}
      </span>

    </div>
  );
}
import React, { useState } from "react";

const PlayButton = ({ audioTrack }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleButtonClick = () => {
    setIsPlaying(!isPlaying);

    // Get track from audioTrack string
    const audio = new Audio(audioTrack);

    // Logic to play or pause audio
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }

    // When audio ends, set isPlaying to false
    audio.addEventListener("ended", () => {
      setIsPlaying(false);
    });
  };

  return (
    <button
      style={{
        display: "inline",
        marginLeft: "0.25rem",
        backgroundColor: "transparent",
        border: "none",
        cursor: "pointer",
        // borderRadius: "50%",
      }}
      onClick={handleButtonClick}
    >
      {isPlaying ? "🎵" : "▶️"}
    </button>
  );
};

export default PlayButton;

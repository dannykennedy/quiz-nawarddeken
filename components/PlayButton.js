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
    <span
      style={{
        cursor: "pointer",
      }}
      onClick={handleButtonClick}
    >
      {isPlaying ? " 🎵" : " ▶️"}
    </span>
  );
};

export default PlayButton;

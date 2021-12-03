import { useState, useEffect, useMemo, useRef } from "react";
import lofi_background from "./assets/lofi-background.mp4";
import lofi_girl from "./assets/lofi-girl.jpg";
import play_icon from "./assets/play.svg";
import pause_icon from "./assets/pause.svg";
import previous_icon from "./assets/previous.svg";
import next_icon from "./assets/next.svg";
import swaying_trees from "./assets/swaying_trees.mp3";
import old_friends from "./assets/old_friends.mp3";

var songs = [
  { title: "Swaying Trees", singer: "Ornithology", source: swaying_trees },
  { title: "Old Friend", singer: "Charlee Nguyen, Mondo Loops, trxxshed", source: old_friends },
];

function App() {
  const progressBarRef = useRef(null);
  const [time, setTime] = useState("");
  const [totalTime, setTotalTime] = useState("");
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const audio = useMemo(() => new Audio(), []);

  useEffect(() => {
    audio.addEventListener("timeupdate", (e) => {
      var { currentTime, duration } = e.target;
      if (duration) {
        setTime(new Date(currentTime * 1000).toISOString().substr(14, 5));
        setTotalTime(new Date(duration * 1000).toISOString().substr(14, 5));
        setProgress((currentTime * 100) / duration);
      }
    });
    progressBarRef.current.addEventListener("click", (e) => {
      var pos = (e.offsetX / progressBarRef.current.clientWidth) * audio.duration;
      audio.currentTime = pos;
    });
  }, []);

  useEffect(() => {
    audio.src = songs[currentSongIndex].source;
    audio.pause();
    audio.load();
    audio.play();
    setIsPlaying(true);
  }, [currentSongIndex]);

  useEffect(() => {
    isPlaying ? audio.play() : audio.pause();
  }, [isPlaying]);

  const handlePlayPause = () => {
    setIsPlaying((playing) => !playing);
  };
  const handlePrevious = () => {
    currentSongIndex > 0 ? setCurrentSongIndex((current) => current - 1) : setCurrentSongIndex(songs.length - 1);
  };
  const handleNext = () => {
    currentSongIndex < songs.length - 1 ? setCurrentSongIndex((current) => current + 1) : setCurrentSongIndex(0);
  };

  return (
    <div className="w-screen h-screen flex justify-center items-end">
      <video autoPlay muted loop id="backgroundVideo" className="fixed w-screen h-screen top-0 left-0 object-cover">
        <source src={lofi_background} type="video/mp4" />
      </video>
      <div className="fixed w-1/2 mb-8 bg-gradient-to-br from-purple-400 bg-opacity-10 rounded-2xl py-10 px-12 flex justify-between items-center shadow-lg text-white backdrop-filter backdrop-blur-sm">
        <div
          className="lofi-circle w-28 h-28 bg-white rounded-full border-4 border-white bg-cover bg-no-repeat bg-center "
          style={{ backgroundImage: `url(${lofi_girl})`, animationPlayState: isPlaying ? "running" : "paused" }}></div>
        <div className="content flex flex-col flex-grow pl-6">
          <div className="title text-3xl font-bold">{songs[currentSongIndex].title}</div>
          <div className="title text-lg font-extralight mb-6">{songs[currentSongIndex].singer}</div>
          <div className="player w-full">
            <div className="time text-sm w-full flex justfiy-between justify-between mb-3">
              <div className="start-time">{time ? time : "00:00"}</div>
              <div className="end-time">{totalTime ? totalTime : "00:00"}</div>
            </div>
            <div ref={progressBarRef} className="relative pointer-events-auto progress-bar w-full py-4 cursor-pointer">
              <div className="bar w-full h-1 bg-gradient-to-r from-pink-300 to-purple-400 rounded-lg"></div>
              <div
                className={`cursor-pointer bg-gradient-to-r from-purple-300 to-purple-400 rounded-full absolute w-4 h-4 border-4 border-white transform top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}
                style={{
                  left: progress + "%",
                }}></div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div onClick={handlePrevious} className={`relative w-10 h-10 cursor-pointer bg-gradient-to-r from-purple-300 to-purple-400 rounded-full`}>
              <img src={previous_icon} alt="" className="absolute w-4 h-4 transform top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div
              onClick={handlePlayPause}
              className={`relative w-16 h-16 mx-4 cursor-pointer bg-gradient-to-r from-purple-300 to-purple-400 rounded-full`}>
              <img
                src={isPlaying ? pause_icon : play_icon}
                alt=""
                className="absolute w-4 h-4 transform top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              />
            </div>
            <div onClick={handleNext} className={`relative w-10 h-10 cursor-pointer bg-gradient-to-r from-purple-300 to-purple-400 rounded-full`}>
              <img src={next_icon} alt="" className="absolute w-4 h-4 transform top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;


import React, { useContext, useEffect, useState } from 'react'
import { IoIosArrowDown } from "react-icons/io";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { PlayContext } from '../contexts/PlayerContext';
import { assets } from '../assets/assets';
import { motion } from 'framer-motion';


const SongFace = () => {

  const { audioRef, seekBar,seekBg,playStatus, play,pause,track,time,previous,next,seekSong, openSong, setOpenSong, handleSeekDrag } = useContext(PlayContext)
  
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const formatTime = (minute, second) =>
    `${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;

  const getProgressFromClientX = (clientX) => {
    const rect = seekBg.current.getBoundingClientRect();
    const percent = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
    return percent * 100;
  };

  const updateAudioProgress = (percent) => {
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = (percent / 100) * audioRef.current.duration;
    }
  };

  // When dragging, update thumb and audio
  const handleMouseDown = () => {
    setIsDragging(true);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    const newProgress = getProgressFromClientX(e.clientX);
    setProgress(newProgress); // move the thumb
    updateAudioProgress(newProgress);
  };

  const handleMouseUp = (e) => {
    const newProgress = getProgressFromClientX(e.clientX);
    setProgress(newProgress);
    updateAudioProgress(newProgress);
    setIsDragging(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  // Click-to-seek
  const handleClick = (e) => {
    const newProgress = getProgressFromClientX(e.clientX);
    setProgress(newProgress);
    updateAudioProgress(newProgress);
  };

  // Update progress bar from time
  useEffect(() => {
    if (!isDragging && audioRef.current?.duration) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      const currentProgress = (current / duration) * 100;
      setProgress(currentProgress);
    }
  }, [time]);

  return (
    <motion.div
    initial={{ y: '100%', opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    exit={{ y: '100%', opacity: 0 }}
    transition={{
      type: 'spring',
      stiffness: 100,
      damping: 15,
      delay: 0 // ⏱️ Delay before slide animation starts
    }}
    className='text-white w-[100%] lg:w-[75%] min-h-screen bg-gradient-to-t from-black to-blue-950 top-0 max-sm:left-0 fixed flex flex-col'>
      <div className='flex items-center text-[40px] justify-between px-5 mt-4'>
        <IoIosArrowDown onClick={()=>setOpenSong(false)} className='cursor-pointer hover:bg-gray-700 rounded-full p-2' />
        <HiOutlineDotsVertical className='cursor-pointer hover:bg-gray-700 rounded-full p-2' />
      </div>
      <div className='flex flex-col mt-10 px-3'>
        <img src={track.image} className='rounded-3xl w-50 max-sm:w-full' alt="" />
        <p className='text-[20px] font-medium mt-4'>{track.name}</p>
        <p className='text-[16px] text-gray-400'>{track.desc}</p>
      </div>

    <div className='flex flex-col items-center gap-1 mt-15'>

      {/* <div className='flex items-center gap-3'>
          <p>{time.currentTime.minute}:{time.currentTime.second}</p>
            <div ref={seekBg} onClick={seekSong} className='w-[60vw] max-w-[500px] bg-gray-300 rounded-full cursor-pointer'>
              <hr ref={seekBar} className='h-1 border-none w-0 bg-green-800 rounded-full' />
            </div>
          <p>{time.totalTime.minute}:{time.totalTime.second}</p>
      </div> */}

      <div className="flex items-center justify-center gap-3 w-full px-4">
      <p className="text-[14px]">
        {formatTime(time.currentTime.minute, time.currentTime.second)}
      </p>

      <div
        ref={seekBg}
        className="relative w-full h-1 bg-white/30 rounded-full cursor-pointer max-w-[500px]"
        onClick={handleClick}
      >
        {/* progress bar */}
        <div
          className="absolute h-1 bg-white rounded-full"
          style={{ width: `${progress}%` }}
        ></div>

        {/* draggable thumb (end circle) */}
        <div
          className="absolute w-4 h-4 bg-white rounded-full -top-1.5 shadow-md"
          style={{ left: `calc(${progress}% - 8px)` }}
          onMouseDown={handleMouseDown}
        ></div>
      </div>

      <p className="text-[14px]">
        {formatTime(time.totalTime.minute, time.totalTime.second)}
      </p>
      </div>

      <div className='flex gap-x-7 mt-3'>
          <img className='w-5 cursor-pointer' src={assets.shuffle_icon} alt="" />
          <img onClick={previous} className='w-5 cursor-pointer' src={assets.prev_icon} alt="" />
          {
            playStatus ?
            <img onClick={pause} className='w-5 cursor-pointer' src={assets.pause_icon} alt="" />
            :
            <img onClick={play} className='w-5 cursor-pointer' src={assets.play_icon} alt="" /> 
          }
          <img onClick={next} className='w-5 cursor-pointer' src={assets.next_icon} alt="" />
          <img className='w-5 cursor-pointer' src={assets.loop_icon} alt="" />
      </div>
      
    </div>

    </motion.div>
  )
}

export default SongFace
